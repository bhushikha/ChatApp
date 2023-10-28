const url = 'http://localhost';
const token = localStorage.getItem('token');
const name = localStorage.getItem('name');
const email = localStorage.getItem('email');
const messages = document.getElementById("messages_cont_ul");


// console.log(name, email);

const totalMsg = [];
const names = []



const addMsgBtn = document.getElementById('addmsgbtn');
const messageInput = document.getElementById('messageinput');

window.addEventListener('DOMContentLoaded', async () => {
    // getMessages();
    setInterval(() => {
        getMessages();
    }, 1000);
    try {
        const msg = localStorage.getItem('totalMsgs');
        const nam = localStorage.getItem('name');

        if (msg !== null && nam !== null) {
            const msg1 = msg.split(',');
            const nam1 = nam.split(',');

            displayMsg(nam1, msg1);
        } else {
            // Handle the case where data is not found in localStorage
            // For example, you can display a message or take another appropriate action.
            console.log('No data found in localStorage');
        }


    }
    catch (error) {
        console.log(error)
    }
})

const btn = document.getElementById('addmsgbtn');
btn.addEventListener('click', () => {
    getMessages();
})

async function displayMsg(nam1, msg1) {
    try {
        for (i = 0; i < msg1.length; i++) {
            messages.innerHTML = messages.innerHTML + ` <li class="even"><strong>${nam1[i]} :</strong> ${msg1[i]} </li>`;
        }

    }
    catch (error) {
        console.log(error)
    }

}

addMsgBtn.addEventListener('click', async () => {
    try {
        let msg = messageInput.value;
        // console.log(messageInput.value)
        messageInput.value = "";
        await axios.post(`${url}:3000/message/addMessage`, { msg: msg }, { headers: { "Authorization": token } });
        alert('Message sent successfully');
    }
    catch (error) {
        alert(error);
    }
})

// ... (other code remains the same)

// ... (other code remains the same)

async function getMessages() {
    try {
        const msg = await localStorage.getItem('totalMsgs');
        if (msg !== null) {  // Check if msg is not null
            let msg1 = msg.split(',');
            const msLength = msg1.length;
            const response = await axios.get(`${url}:3000/message/getMessage?lastmsg=${msLength}`, { headers: { "Authorization": token } });

            console.log(response.data); // Moved the console.log here

            const data = response.data;
            let messages = document.getElementById("messages_cont_ul");
            messages.innerHTML = '';
            for (i = 0; i < response.data.length; i++) {
                messages.innerHTML = messages.innerHTML + ` <li class="even"><strong>${data[i].username} :</strong> ${data[i].msg} </li`;
                const totalMsg2 = [];
                const names2 = [];

                totalMsg2.push(JSON.stringify(data[i].msg));
                names2.push(JSON.stringify(data[i].username));
                var totalMsg3 = [...totalMsg, ...totalMsg2];
                var names3 = [...names, ...names2]
            }

            localStorage.setItem('totalMsgs', totalMsg3);
            localStorage.setItem('name', names3);
        }
    } catch (error) {
        console.log(error)
    }
}
