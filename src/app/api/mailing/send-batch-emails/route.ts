import '@/polyfills';
import {NextRequest, NextResponse} from "next/server";
import {clearEmailSendStatus, hasEmailBeenSent, markEmailAsSent} from "@/components/send/utils/jsonStorage";
import {retryable} from "@/components/send/utils/retryable";
import {LedgityAddress} from "@/utils/address";
import {type Contact, getWeb3Provider, IExecWeb3mail} from '@iexec/web3mail';
import {IExecDataProtector} from '@iexec/dataprotector';
import Bull from "bull";

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
const mailQueue = new Bull('mailQueue', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: (process.env.REDIS_PORT as number | undefined) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        tls: {} // Enable TLS
    }
});

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

mailQueue.process(async (job) => {
    console.log('Processing job: ', job.id);

    const {contact, subject, content, contentType, label} = job.data
    try {
        if (hasEmailBeenSent(contact.address)) {
            return;
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
    } catch (error) {
        throw new Error(`Failed to send email to ${contact.address}:` + error);
    }

    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
    console.log('Completed job: ', job.id);
})

// Clear status on completed state
mailQueue.on('completed', () => clearEmailSendStatus())

// TODO: maybe add some security requirements
//  (to avoid mail send from unauthorized entity/user)
export const POST = async (request: NextRequest) => {
    const data = await request.json();

    // Check data from request send
    if (data.subject == null || data.content == null || data.contentType == null || data.label == null) {
        return NextResponse.json({success: false, error: "Invalid payload"});
    }

    const contacts = await fetchContactsWithAccess(signer);
    const jobs = await mailQueue.addBulk(
        contacts.map(contact => ({data: {...data, contact}})
    ))

    // Return success
    return NextResponse.json({ success: true, data: {jobIds: jobs.map(job => job.id)} });
}