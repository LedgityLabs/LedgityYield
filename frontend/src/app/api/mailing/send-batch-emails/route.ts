import { NextRequest, NextResponse } from "next/server";
import { clearEmailSendStatus, hasEmailBeenSent, markEmailAsSent } from "@/components/send/utils/jsonStorage";
import { retryable } from "@/components/send/utils/retryable";
import { LedgityAddress } from "@/utils/address";
import { type Contact, getWeb3Provider, IExecWeb3mail } from '@iexec/web3mail';
import { IExecDataProtector } from '@iexec/dataprotector';

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

// Create instances
const web3mail = new IExecWeb3mail(signer);
const mailQueue: any[] = []; // In-memory queue

const fetchContactsWithAccess = async (signer: any): Promise<Contact[]> => {
    const contactsList = await web3mail.fetchUserContacts({ userAddress: LedgityAddress });
    const filteredContacts = await Promise.all(
        contactsList.map(async (contact) => {
            const hasAccess = await checkAppIsGrantedAccess(contact.address, signer);
            return hasAccess ? contact : null;
        })
    );
    return filteredContacts.filter((contact): contact is Contact => contact !== null);
}

const checkAppIsGrantedAccess = async (protectedDataAddress: string, signer: any): Promise<boolean> => {
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

// Process the email queue
const processQueue = async () => {
    while (mailQueue.length > 0) {
        const job = mailQueue.shift();
        if (job) {
            try {
                console.log('Processing job: ', job.id);
                const { contact, subject, content, contentType, label } = job.data;

                if (hasEmailBeenSent(contact.address)) {
                    continue;
                }

                const { taskId } = await retryable(
                    async () => await web3mail.sendEmail({
                        protectedData: contact.address,
                        emailSubject: subject,
                        emailContent: content,
                        contentType,
                        label,
                        senderName: 'Ledgity',
                    }),
                    {
                        initialWaitTime: INITIAL_WAIT_TIME,
                        maxTries: MAX_RETRIES,
                    }
                );

                markEmailAsSent(contact.address, taskId);
                console.log('Completed job: ', job.id);
            } catch (error) {
                console.error(`Failed to send email to ${job.data.contact.address}:`, error);
            }

            // Delay between emails
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
        }
    }
    clearEmailSendStatus();
}

// Start processing the queue
setInterval(() => {
    if (mailQueue.length > 0) {
        processQueue();
    }
}, 1000); // Check every second if there are jobs in the queue

export const POST = async (request: NextRequest) => {
    const data = await request.json();

    // Check data from request
    if (!data.subject || !data.content || !data.contentType || !data.label) {
        return NextResponse.json({ success: false, error: "Invalid payload" });
    }

    try {
        const contacts = await fetchContactsWithAccess(signer);
        const jobs = contacts.map((contact, index) => ({
            id: `${Date.now()}-${index}`,
            data: { ...data, contact }
        }));

        // Add jobs to the in-memory queue
        mailQueue.push(...jobs);

        return NextResponse.json({ success: true, data: { jobIds: jobs.map(job => job.id) } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err });
    }
}