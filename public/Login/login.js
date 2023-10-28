const url = 'http://localhost'
async function login(e) {
    try {
        e.preventDefault();
        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        // console.log(loginDetails);

        const respone = await axios.post(`${url}:3000/user/login`, loginDetails);
        // console.log(respone.token);
        localStorage.setItem('token', respone.token)
        alert(respone.message);
    }
    catch (err) {
        // console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}<div>`;
        alert(err.message);
    }
}