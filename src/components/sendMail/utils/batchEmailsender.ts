// src/utils/batchEmailSender.ts

import { IExecWeb3mail, type Contact } from '@iexec/web3mail';
import { IExecDataProtector } from '@iexec/dataprotector';
import { retryable } from './retryable';
import { LedgityAddress } from "@/utils/address";
import { hasEmailBeenSent, markEmailAsSent } from './jsonStorage';
import { getAutomaticSigner } from './senderAccount';

const DELAY_BETWEEN_EMAILS = 15000; // 30 seconds
const MAX_RETRIES = 5;
const INITIAL_WAIT_TIME = 1000; // 5 seconds
const MAX_CONTACTS = 20; // Limit for testing

export async function sendBatchEmails(subject: string, content: string) {
    const signer = getAutomaticSigner();
    if (!signer) {
        throw new Error('Failed to initialize signer. Check your environment variables.');
    }

    const web3mail = new IExecWeb3mail(signer);

    try {
        const contacts = await fetchContactsWithAccess(signer);
        const limitedContacts = contacts.slice(0, MAX_CONTACTS);

        for (const contact of limitedContacts) {
            try {
                if (hasEmailBeenSent(contact.address)) {
                    console.log(`Email already sent to ${contact.address}. Skipping.`);
                    continue;
                }

                console.log(`Attempting to send email to ${contact.address}`);

                const { taskId } = await retryable(
                    async () => {
                        try {
                            return await web3mail.sendEmail({
                                protectedData: contact.address,
                                emailSubject: subject,
                                emailContent: content,
                                contentType: 'text/plain',
                                senderName: 'Ledgity',
                            });
                        } catch (error) {
                            console.error('Error sending email:', error);
                            throw error;
                        }
                    },
                    {
                        initialWaitTime: INITIAL_WAIT_TIME,
                        maxTries: MAX_RETRIES,
                    }
                );

                markEmailAsSent(contact.address, taskId);
                console.log(`Email sent successfully to ${contact.address}`);

                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
            } catch (error) {
                console.error(`Failed to send email to ${contact.address}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in batch email process:', error);
        throw error;
    }
}

async function fetchContactsWithAccess(signer: any): Promise<Contact[]> {
    const web3mail = new IExecWeb3mail(signer);
    const contactsList = await web3mail.fetchUserContacts({ userAddress: LedgityAddress });

    const filteredContacts = await Promise.all(
        contactsList.map(async (contact) => {
            const hasAccess = await checkAppIsGrantedAccess(contact.address, signer);
            return hasAccess ? contact : null;
        })
    );

    return filteredContacts.filter((contact): contact is Contact => contact !== null);
}

async function checkAppIsGrantedAccess(protectedDataAddress: string, signer: any): Promise<boolean> {
    const dataProtector = new IExecDataProtector(signer);
    const { grantedAccess } = await dataProtector.core.getGrantedAccess({
        protectedData: protectedDataAddress,
        authorizedUser: LedgityAddress,
    });
    return grantedAccess.length > 0;
}
