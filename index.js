import { Command } from 'commander';
import { listContacts, getContactById, addContact, removeContact } from './db/contacts.js';


const program = new Command();

program
    .option('-a, --action <type>', 'choose action')
    .option('-i, --id <type>', 'user id')
    .option('-n, --name <type>', 'user name')
    .option('-e, --email <type>', 'user email')
    .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
    try {
        switch (action) {
            case 'list':
                const allContacts = await listContacts();
                console.table(allContacts);
                break;

            case 'get':
                if (!id) {
                    console.error('Please provide id with --id option');
                    return;
                }
                const contactById = await getContactById(id);
                if (contactById) {
                    console.log(contactById);
                } else {
                    console.log(`Contact with id ${id} not found`);
                }
                break;

            case 'add':
                if (!name || !email || !phone) {
                    console.error('Please provide name, email, and phone with appropriate options');
                    return;
                }
                const addedContact = await addContact(name, email, phone);
                console.log('New contact added:', addedContact);
                break;

            case 'remove':
                if (!id) {
                    console.error('Please provide id with --id option');
                    return;
                }
                const removedContact = await removeContact(id);
                if (removedContact) {
                    console.log('Contact removed:', removedContact);
                } else {
                    console.log(`Contact with id ${id} not found`);
                }
                break;

            default:
                console.warn('\x1B[31m Unknown action type!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

invokeAction(argv);
