const url = 'http://localhost:3000';

async function signup(e) {
    try {
        e.preventDefault();
        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            phonenumber: e.target.phonenumber.value,
            password: e.target.password.value
        }

        const response = await axios.post(`${url}/user/signup`, signupDetails);

        console.log(response);

        if (response.data.success) {
            alert("Successfully signed up");
            window.location.href = "../Login/login.html";
        } else {
            const errorMessage = response.data.message || 'An error occurred during signup.';
            alert(errorMessage);
        }
    } catch (error) {
        console.log(error);
        alert('An error occurred during signup.');
    }
}
