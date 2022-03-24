import { onValue, ref, update, push, query, limitToLast, remove} from "firebase/database";
import { db } from "./modules/firebaseApp";
import { Message } from "./modules/messageClass";

const dbRef = ref(db, '/messages');
const headerData:HTMLDivElement = document.querySelector('#header-data');
const loginBtn:HTMLButtonElement = document.querySelector("#login-btn");
const addMessBtn:HTMLButtonElement = document.querySelector("#add-message-btn");
const userId:HTMLParagraphElement = document.querySelector('#user-id');
const user:HTMLHeadingElement = document.querySelector('#user');
const messageForm:HTMLFormElement = document.querySelector('#message-form');
const userForm:HTMLFormElement = document.querySelector('#username-form');
const logoutBtn:HTMLButtonElement = document.querySelector('#logout-btn');
const username:HTMLInputElement = document.querySelector('#username');
const password:HTMLInputElement = document.querySelector('#password');
const messInput:HTMLInputElement = document.querySelector("#message");
let messages:Message[] = [];

// Function to fetch data from database
const fetchAllData = () => {   
    /* Another way to show last 25 messages:
    onValue(query (dbRef, limitToLast(25)), snapshot => {...});*/
    onValue(dbRef, snapshot => {   
        const messagesData = snapshot.val();
        console.log(messagesData);

        // Remove messages from DOM
        for(const message of messages){
            message.clearChat();
        }

        messages = [];

        for(const key in messagesData){
            messages.push(new Message(
                key,
                messagesData[key].username,
                messagesData[key].message,
                messagesData[key].timestamp,
                messagesData[key].userId
            ));
        }
        console.log(messages);

        // Add messages from database to DOM
        for(const message of messages){
            message.displayChat();
        }       

    });
}

// Function to check if there is more than 25 messages in database and if yes - remove the oldest
const checkDatabase = () => {   
    fetchAllData();

    if (messages.length > 25){
        let deleteMessage:Message = messages[0];
        console.log(deleteMessage);

        const messRef = ref(db, '/messages/' + deleteMessage.id);
        remove(messRef);
    }   
}

// Event listener for login-button
loginBtn.addEventListener('click', e => {
    e.preventDefault();

    if (username.value == '') {
        alert('Enter username!');
    }
    else if (password.value == ''){
        alert('Password required!');
    }
    else {
        user.innerText = username.value;
        userId.innerText = password.value;
        username.value = '';
        password.value = '';
        messageForm.style.display = 'flex';
        userForm.style.display = 'none';
        logoutBtn.style.display = 'block';
        headerData.style.justifyContent = 'space-between';
        fetchAllData();
    }

})

// Event listener for logout-button
logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location.reload();
})

// Event listener for add-message-button
addMessBtn.addEventListener('click', e => {
    e.preventDefault();
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const pad = (n) => {   
    // function pad(n) {
        return n<10 ? '0'+n : n;
    }
    const messTimestamp = pad(date.getDate())+
        "-"+pad(date.getMonth()+1)+
        "-"+date.getFullYear()+
        ", "+pad(date.getHours())+
        ":"+pad(date.getMinutes());

        console.log(messTimestamp);

    if (user.innerText == '') {
        alert('Enter username!');
    }
    else if (messInput.value == ''){
        alert('Enter text to post!');
    }
    else {
        // Update database with new message
        const messToAdd = {
            message: messInput.value,
            username: user.innerText,
            timestamp: messTimestamp,
            userId: userId.innerText
        }

        messInput.value = '';

        const newKey:string = push(dbRef).key;
        const newMessage = {};
        newMessage[newKey] = messToAdd;

        update(dbRef, newMessage);
        checkDatabase();
    }

})