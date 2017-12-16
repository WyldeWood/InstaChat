*****NOTE*****
	Some of the newer chatrooms were created before we got the nicknames working. Therefore, if a message already in a chatroom appears without a nickname then it is not a bug, it is because there is no nickname assigned to it in the data base.

Instructions:
Our project should be pretty self explanatory but if you are at all confused at how to work it look no further. 
First go to localhost:8080. 
There you should find our home page.
Follow the prompts to choose a chatroom from the list or to create a new room.
After choosing a room you should be brought to a page where you are asked to input a screen name to be displayed to the other chatters. Input your preferred name and click “Next”.
You should then be brought to your chosen chatrooms page. Enter your message in the box located in the bottom left of your screen and click “Send” to submit it
Click “Change nickname” if you wish to change your nickname.
Click “Back to Chatroom List” if you wish to return to the home page to change chatrooms.
Happy Chatting!

Design:
	When one sends a message, the server receives that message, stores it in the database, and then sends the message to all connected clients who then display that message on their page. The same thing happens when a user connects, when they set their nickname, a message is sent to the server who then relays that message to the rest of the clients who then display that nickname in their members list. When a user disconnects a message is sent to all the other users that removes that users name from the members list.

Collaborators:
	Andy Wood

Bugs and Problems:
	The only bug in my is not exactly a bug as I don’t believe it has anything to do with our code. When you visit localhost:8080, the chatroom list sometimes appears empty. Simply refreshing the page fixes it and most of the time the list shows up the first time you go to the page. 

Extra Features:
	Ran out of time to full implement updating the database and message list to include changed nicknames.
