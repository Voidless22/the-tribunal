# **The Tribunal**
## **Commands**
- /setTicketChannel *channel*
  - This stores the id of the user supplied channel in a database categorized by guild-id(server ID). Then it creates a button to create petitions with.
- /genStaffPetitionSection *staff role*
  - This command is required to be ran currently after the ticket channel is set. It creates a discord category named "Staff-Petitions" and under that, individual channels for each petition category.
  - Petition Categories are stored in config.js, I don't recommend modifying this unless you plan on adding a new category under the selection menu and a modal with that.
  - The staff role ID is stored in the database along with the staff petition discord category ID
  - Permissions are set for these channels so that the supplied role and higher can see the channels.
  - Eventually this command will be optional when I add a toggle for staff copies
  
## **Functionality/User Flow**
### **The general process for creating a petition from a non staff perspective would be as follows:**
- Click the "Create Petition Button"
- Clicking this sends a message with a dropdown list of petition categories. Select one(currently only IP Exemption differs from the others.)
- This opens up a form(modal) to fill out, with Character Name, Account Name, and Petition Description being required inputs, and other characters being optional.
  - *IP Exemption differs from this in that it has 2 character/account inputs, no other character input, but still a description*
- On Submitting the form, a thread is created under the petition channel, with the character name followed by the petition category as the title.
- A copy of the form info is sent, the submitting user is pingged to join the thread, and the staff role is pinged as well to join the thread.

### **For staff, all of the above is true but with a few additions.**
- Once the user submits the form, all of the above happens still, but a thread is also created under the petition category's channel, with a copy of the info sent as well.
- There is no staff ping in this thread, since they can only see it as is. Though, a message is sent in the category channel with links to the petition and the staff copy.
- Soon, chat logs will be pulled to here, either automatically or via command.

