const url = 'http://localhost';
const token = localStorage.getItem('token');
const name = localStorage.getItem('name');
const messages = document.getElementById("messages_cont_ul");
const addMsgBtn = document.getElementById('addmsgbtn');
const messageInput = document.getElementById('messageinput');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        getGroups();
        getAllUsers();
    } catch (error) {
        console.log(error);
    }
});

async function creategroup(event) {
    try {
        event.preventDefault();
        let groupname = document.getElementById("groupname").value;
        if (groupname.length < 1) {
            alert('Please enter a group name');
            return;
        }
        let obj = {
            groupname: groupname
        };
        const response = await axios.post(`${url}:3000/group/createGroup`, obj, { headers: { Authorization: token } });
        if (response.data.success) {
            getGroups();
            document.getElementById("groupname").value = '';
            alert(response.data.message);
        } else {
            alert('Group already exists');
        }
    } catch (error) {
        console.log(error);
        alert('Error creating a group');
    }
}

async function getGroups() {
    try {
        const response = await axios.get(`${url}:3000/group/getGroups`, { headers: { Authorization: token } });
        localStorage.setItem("usergroup", JSON.stringify(response.data));
        const group = document.getElementById("mygroups");
        let content = "";
        for (let i = 0; i < response.data.length; i++) {
            let groupname = response.data[i].group.groupname;
            let groupid = response.data[i].group.id;
            content += `<li class="grpdetail"><strong class="grpele">${groupname} - </strong>
            <button type="submit" onclick="goToYourGroup(${groupid})" class="grpele btn" id="jumpbtn">Go to Group</button></li><br>`;
        }
        group.innerHTML = content;
    } catch (error) {
        console.log(error);
        alert('Error getting groups');
    }
}

async function sendMessage(groupid) {
    try {
        let message = document.getElementById(groupid).value;
        if (message.length < 1) {
            alert('Please enter a message');
            return;
        }
        document.getElementById(groupid).value = '';
        let obj = {
            message: message
        };
        const response = await axios.post(`${url}:3000/message/addMessage/${groupid}`, { msg: obj }, { headers: { "Authorization": token } });
        getMessages(groupid);
        alert(response.data.message);
    } catch (error) {
        console.log(error);
        alert('Error sending message');
    }
}

function goToYourGroup(groupid) {
    getMessages(groupid);
    getMembers(groupid);
}

async function getMessages(groupid) {
    try {
        const response = await axios.get(`${url}:3000/message/getMessage/${groupid}`, { headers: { "Authorization": token } });
        const allMessages = document.getElementById("allchats");
        let content = `<h3 id="chatheader1">Group Chats</h3><div><strong><label>Enter your message: </label></strong>
        <input type="text" id=${groupid} required><button onclick="sendMessage(${groupid})" id="sendbtn">Send</button></div><br>`;

        for (let i = 0; i < response.data.length; i++) {
            let message = response.data[i].msg;
            let name = response.data[i].username;
            content += `<div id="chatdetails"><strong class="chats">${name} : </strong>
            <span class="chats">${message}</span></div>`;
        }
        allMessages.innerHTML = content;
    } catch (error) {
        console.log(error);
        alert('Error getting messages');
    }
}

async function getMembers(groupid) {
    try {
        const response = await axios.get(`${url}:3000/group/getMembers/${groupid}`, { headers: { "Authorization": token } });
        let userId = JSON.parse(localStorage.getItem("user"));
        let usergroups = JSON.parse(localStorage.getItem("usergroup"));
        let usergroup = null;
        for (let i = 0; i < usergroups.length; i++) {
            if (groupid == usergroups[i].groupId) {
                usergroup = usergroups[i];
                break;
            }
        }
        let innertitle = document.getElementById("memberheader");
        innertitle.innerHTML = `Group Members`;
        let parent = document.getElementById("groupmembers");
        let parent2 = document.getElementById("groupmembers2");
        let onemoreparent = document.getElementById("addmems");
        let content = "";
        let onemorecontent = "";
        for (let i = 0; i < response.data.length; i++) {
            let name = response.data[i].user.name;
            let id = response.data[i].user.id;
            let isAdmin = response.data[i].isadmin;
            if (userId[0].id == id) {
                if (isAdmin) {
                    onemorecontent = `<label class="addduser"><strong>Add User : </strong></label>
                    <input type="text" id="name" class="addduser" required>
                    <label class="addduser"><strong>Add User through Email: </strong></label>
                    <input type="email" id="email" class="addduser" required>
                    <button onclick="addMember(${groupid})">Add</button>`;
                }
            } else {
                if (usergroup.isadmin != true) {
                    content += `<div class="userdiv"><strong class="userele">${name}</strong>`;
                } else {
                    if (usergroup.isadmin == true) {
                        content += `<div class="userdiv"><strong class="userele" id="username">${name}</strong>
                        <button class="userele" onclick="makeAdmin(${groupid},${id})">Make Admin</button>
                        <button class="userele" onclick= "removeMember(${groupid},${id})">Remove as Member</button></div><br>`;
                        onemorecontent = `<label class="addduser"><strong>Add User : </strong></label>
                        <input type="text" id="name" class="addduser" required>
                        <button onclick="addMember(${groupid})">Add</button>`;
                        onemorecontent = `<label class="addduser"><strong>Add User : </strong></label>
                        <input type="text" id="name" class="addduser" required>
                        <label class="addduser"><strong>Add User through Email: </strong></label>
                        <input type="email" id="email" class="addduser" required>
                        <button onclick="addMember(${groupid})">Add</button>`;
                    }
                    if (isAdmin == true) {
                        content = `<div class="userdiv"><strong class="userele">${name}</strong>
                        <button class="userele" onclick="removeAdmin(${groupid},${id})">Remove as Admin</button>
                        <button class="userele" onclick= "removeMember(${groupid},${id})">Remove as Member</button></div><br>`;
                        onemorecontent = `<label class="addduser"><strong>Add User : </strong></label>
                        <input type="text" id="name" class="addduser" required>`;
                        onemorecontent = `<label class="addduser"><strong>Add User : </strong></label>
                        <input type="text" id="name" class="addduser" required>
                        <label class="addduser"><strong>Add User through Email: </strong></label>
                        <input type="email" id="email" class="addduser" required>
                        <button onclick="addMember(${groupid})">Add</button>`;
                    }
                }
            }
        }
        onemoreparent.innerHTML = onemorecontent;
        parent.innerHTML = content;
        parent2.innerHTML = '';
    } catch (error) {
        console.log(error);
        alert('Error getting members');
    }
}

async function addMember(groupid) {
    try {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        if (name.length < 1 && email.length < 1) {
            alert('Please enter a Name or Email');
            return;
        }
        let obj = {
            name: name,
            email: email,
        };
        const response = await axios.post(`${url}:3000/admin/addMember/${groupid}`, obj, { headers: { "Authorization": token } });
        getMembers(groupid);
        if (response.data.success) {
            alert(response.data.message);
        } else {
            alert('Error adding a member');
        }
    } catch (error) {
        console.log(error);
    }
}

async function removeMember(groupid, userid) {
    try {
        const response = await axios.post(`${url}:3000/admin/removeMember/${groupid}`, { userid: userid }, { headers: { "Authorization": token } });
        if (response.data.success) {
            getMembers(groupid);
            alert(response.data.message);
        } else {
            alert('Error removing a member');
        }
    } catch (error) {
        console.log(error);
    }
}

async function makeAdmin(groupid, userid) {
    try {
        const response = await axios.post(`${url}:3000/admin/makeAdmin/${groupid}`, { userid: userid }, { headers: { "Authorization": token } });
        if (response.data.success) {
            getMembers(groupid);
            alert(response.data.message);
        } else {
            alert('Error making a member an admin');
        }
    } catch (error) {
        console.log(error);
    }
}

async function removeAdmin(groupid, userid) {
    try {
        const response = await axios.post(`${url}:3000/admin/removeAdmin/${groupid}`, { userid: userid }, { headers: { "Authorization": token } });
        if (response.data.success) {
            getMembers(groupid);
            alert(response.data.message);
        } else {
            alert('Error removing admin status');
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllUsers() {
    try {
        const response = await axios.get(`${url}:3000/group/getAllUsers`, { headers: { "Authorization": token } });
        const allUsers = document.getElementById("allusers");
        let names = '';
        for (let i = 0; i < response.data.length; i++) {
            let name = response.data[i].name;
            names += `<li><strong class="chats">${name} </strong></li><br>`;
        }
        allUsers.innerHTML = names;
    } catch (error) {
        console.log(error);
    }
}
