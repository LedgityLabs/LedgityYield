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

// export async function sendBatchEmails(subject: string, content: string) {
//     const signer = getAutomaticSigner();
//     if (!signer) {
//         throw new Error('Failed to initialize signer. Check your environment variables.');
//     }

//     const web3mail = new IExecWeb3mail(signer);

//     try {
//         const contacts = await fetchContactsWithAccess(signer);
//         console.log(`Fetched ${contacts.length} contacts`);

//         const limitedContacts = contacts.slice(0, MAX_CONTACTS);
//         console.log(`Limited to ${limitedContacts.length} contacts`);

//         for (let i = 0; i < limitedContacts.length; i++) {
//             const contact = limitedContacts[i];
//             try {
//                 console.log(`Processing contact ${i + 1}/${limitedContacts.length}: ${contact.address}`);

//                 if (hasEmailBeenSent(contact.address)) {
//                     console.log(`Email already sent to ${contact.address}. Skipping.`);
//                     continue;
//                 }

//                 console.log(`Attempting to send email to ${contact.address}`);

//                 const { taskId } = await retryable(
//                     async () => {
//                         const result = await web3mail.sendEmail({
//                             protectedData: contact.address,
//                             emailSubject: subject,
//                             emailContent: content,
//                             contentType: 'text/plain',
//                             senderName: 'Ledgity',
//                         });
//                         console.log(`Email sent successfully, taskId: ${result.taskId}`);
//                         return result;
//                     },
//                     {
//                         initialWaitTime: INITIAL_WAIT_TIME,
//                         maxTries: MAX_RETRIES,
//                     }
//                 );

//                 markEmailAsSent(contact.address, taskId);
//                 console.log(`Email marked as sent for ${contact.address}`);

//                 console.log(`Waiting ${DELAY_BETWEEN_EMAILS / 1000} seconds before next email`);
//                 await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
//             } catch (error) {
//                 console.error(`Failed to send email to ${contact.address}:`, error);
//             }
//         }
//     } catch (error) {
//         console.error('Error in batch email process:', error);
//         throw error;
//     }
// }

export async function sendBatchEmails(subject: string, content: string) {
    const signer = getAutomaticSigner();
    if (!signer) {
        throw new Error('Failed to initialize signer. Check your environment variables.');
    }
    console.log(signer)

    const web3mail = new IExecWeb3mail(signer);

    try {
        const contacts = await fetchContactsWithAccess(signer);


        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];

            console.log(`Processing contact ${i + 1}/${contacts.length}: ${contact.address}`);

            if (hasEmailBeenSent(contact.address)) {
                console.log(`Email already sent to ${contact.address}. Skipping.`);
                continue;
            }


            const result = await web3mail.sendEmail({
                protectedData: contact.address,
                emailSubject: subject,
                emailContent: content,
                contentType: 'text/plain',
                senderName: 'Ledgity',
                workerpoolAddressOrEns: 'prod-v8-bellecour.main.pools.iexec.eth'
            });
            console.log(result.taskId)


            console.log(`Waiting ${DELAY_BETWEEN_EMAILS / 1000} seconds before next email`);
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));

        }

        console.log('Batch email sending process completed.');
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
    // Filter granted access for Ledgity address
    const LedgityIsGranted = grantedAccess.filter((oneAccess: any) =>
        oneAccess.requesterrestrict.toLowerCase() === LedgityAddress
    );

    return LedgityIsGranted.length > 0;
}
