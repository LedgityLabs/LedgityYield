import { IExecWeb3mail, type Contact, getWeb3Provider } from '@iexec/web3mail';
import { IExecDataProtector } from '@iexec/dataprotector';
import { retryable } from './retryable';
import { LedgityAddress } from "@/utils/address";
import { hasEmailBeenSent, markEmailAsSent, clearEmailSendStatus } from './jsonStorage';

// Constants
const DELAY_BETWEEN_EMAILS = 15000; // 15 seconds
const MAX_RETRIES = 5;
const INITIAL_WAIT_TIME = 1000; // 1 second

// Initialize signer
const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY;
const signer = getWeb3Provider(SENDER_PRIVATE_KEY as string);
if (!signer) {
    throw new Error('Failed to initialize signer. Check your environment variables.');
}

// Create web3mail instance
const web3mail = new IExecWeb3mail(signer);

// Fetch contacts with access
async function fetchContactsWithAccess(signer: any): Promise<Contact[]> {
    const contactsList = await web3mail.fetchUserContacts({ userAddress: LedgityAddress });
    const filteredContacts = await Promise.all(
        contactsList.map(async (contact) => {
            const hasAccess = await checkAppIsGrantedAccess(contact.address, signer);
            return hasAccess ? contact : null;
        })
    );
    return filteredContacts.filter((contact): contact is Contact => contact !== null);
}

// Check if app is granted access
async function checkAppIsGrantedAccess(protectedDataAddress: string, signer: any): Promise<boolean> {
    const dataProtector = new IExecDataProtector(signer);
    const { grantedAccess } = await dataProtector.core.getGrantedAccess({
        protectedData: protectedDataAddress,
        authorizedUser: LedgityAddress,
    });
    const LedgityIsGranted = grantedAccess.filter((oneAccess: any) =>
        oneAccess.requesterrestrict.toLowerCase() === LedgityAddress
    );
    return LedgityIsGranted.length > 0;
}

// Send batch emails
export async function sendBatchEmails(subject: string, content: string, contentType: string, label: string) {
    try {
        const contacts = await fetchContactsWithAccess(signer);

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            try {
                // Check if email has already been sent
                if (hasEmailBeenSent(contact.address)) {
                    continue;
                }

                // Send email with retryable logic
                const { taskId } = await retryable(
                    async () => {
                        const result = await web3mail.sendEmail({
                            protectedData: contact.address,
                            emailSubject: subject,
                            emailContent: content,
                            contentType,
                            label,
                            senderName: 'Ledgity',
                        });
                        return result;
                    },
                    {
                        initialWaitTime: INITIAL_WAIT_TIME,
                        maxTries: MAX_RETRIES,
                    }
                );

                // Mark email as sent
                markEmailAsSent(contact.address, taskId);

                // Wait before sending the next email
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
            } catch (error) {
                throw new Error(`Failed to send email to ${contact.address}:` + error);
            }
        }

        // Clear email send status
        clearEmailSendStatus();
    } catch (error) {
        throw error;
    }
}
