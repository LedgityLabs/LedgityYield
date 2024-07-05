import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import { IExecWeb3mail, type Contact } from '@iexec/web3mail';
import { checkAppIsGrantedAccess } from '@/components/mail/utils/utils';
import { LedgityAddress } from "@/utils/address";
   
   // Initialize Web3Mail and DataProtector instances
const web3mail = new IExecWeb3mail(window.ethereum);
// const dataProtector = new IExecDataProtector(window.ethereum);
// const dataProtectorCore = dataProtector.core;
   
   export const fetchContactList = async () => {
        try {
            const contactsList: Contact[] = await web3mail.fetchUserContacts({ userAddress: LedgityAddress });

            // Filter contacts and check access for each
            const filteredContacts = await Promise.all(
                contactsList.map(async (contact) => {
                    const hasAccess = await checkAppIsGrantedAccess(contact.address);
                    return hasAccess ? contact : null;
                })
            );

            // Remove null values and set the filtered contacts
            const validContacts = filteredContacts.filter((contact): contact is Contact => contact !== null);
            
            return validContacts;
        } catch (err) {
            console.error('Error fetching contacts:', err);
        }
    };

    export const batchEmails = async ( subject: string, content: string, contentType: string, senderName: string, label: string) => {
        const failedEmails: Contact[] = [];
        const contacts: Contact[] = await fetchContactList() || [];
        
        const promises = contacts.map(async (contact) => {
            try {
                await web3mail.sendEmail({
                protectedData: contact.address,
                emailSubject: subject,
                emailContent: content,
                contentType,
                senderName: senderName || undefined,
                label: label || undefined
            });
            console.log('Email sent to:', contact);
            } catch (err) {
                console.error('Error sending email:', err);
                failedEmails.push(contact);
            }
        });

        await Promise.all(promises);
        console.log('Failed emails:', failedEmails);
    }

