import { db } from "./firebaseApp";
import {  ref, remove, update } from "firebase/database";

// Message class with consturctor and methods
class Message {
    constructor (
        public readonly id:string,
        public readonly username:string,
        public message:string, 
        private readonly timestamp: string,
        private readonly userId: string
    ){}
    
    // Function for displaying chat on DOM
    public displayChat():void{
        const chatDiv:HTMLDivElement = document.querySelector('#chat-div');
        const user:HTMLHeadingElement = document.querySelector("#user");
        const userId:HTMLParagraphElement = document.querySelector('#user-id');
        const userDiv:HTMLDivElement = document.createElement('div');
        const messDiv:HTMLDivElement = document.createElement('div');
        const usernameEl:HTMLHeadingElement = document.createElement('h5');
        const dateEl:HTMLHeadingElement = document.createElement('h5');
        const messageEl:HTMLParagraphElement = document.createElement('p');
        const delButton:HTMLButtonElement = document.createElement('button');
        const messContainer:HTMLDivElement = document.createElement('div');

        usernameEl.innerText = this.username;
        dateEl.innerText = this.timestamp;
        messageEl.innerText = this.message;
        delButton.innerText = 'X';
        delButton.className = 'delete-btn';
        userDiv.className = 'user-div';
        messDiv.className = 'mess-div';
        messContainer.className = 'message-container';
        messContainer.id = this.id;

        userDiv.append(usernameEl);
        userDiv.append(dateEl);
        messDiv.append(messageEl);
        // Show delete-button on message and add event listeners only if 
        // username and password during login are the same as data saved with message
        if (this.username == user.innerText && this.userId == userId.innerText){
            messDiv.append(delButton);
            // Event listener for delete-button (for own message)
            delButton.addEventListener('click', () => {
                console.log(user.innerText);
                    const messRef = ref(db, '/messages/' + this.id);
                    remove(messRef);
            })
            // Event listener for message editing by clicking on it (for own message)
            messageEl.addEventListener('click', (e) => {
                e.preventDefault();
                this.editMessage(messageEl);
            })
        }       
        messContainer.append(userDiv);
        messContainer.append(messDiv);
        chatDiv.prepend(messContainer);
        document.body.append(chatDiv);
    }

    // Function for deleting messages from DOM
    public clearChat():void{
        document.querySelector(`#${this.id}`).remove();
    }

    // Function for editing own message
    private editMessage(messEl):void{
        messEl.setAttribute("contenteditable", true);
        messEl.className = 'mess-edit';
        messEl.focus();
        const newMessage:HTMLParagraphElement = document.querySelector('.mess-edit');

        // Event listener for finishing message editing by pushing enter-key
        messEl.addEventListener('keydown', (event) => {
            if (event.keyCode === 13 || event.code === "Enter") {
                event.preventDefault();
                messEl.setAttribute('contenteditable', false);
                this.message = newMessage.innerText;
                // Update message in database
                const messRef = ref(db, '/messages/' + this.id);
                const updates = {};
                updates['/message'] = this.message;
                update(messRef, updates);
                messEl.classList.remove('mess-edit');
            }
        });
    }
}

export { Message }