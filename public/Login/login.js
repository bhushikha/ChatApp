const url = 'http://localhost'
async function login(e) {
    try {
        e.preventDefault();
        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        const respone = await axios.post(`${url}:3000/user/login`, loginDetails);
        localStorage.setItem('token', respone.token);
        localStorage.setItem('user', JSON.stringify(respone.user));
        alert(respone.message);
        window.location.href = '../Home/home.html';
        window.location.href = '../Group/group.html';
    }
    catch (err) {
        alert(err.message);
    }
}