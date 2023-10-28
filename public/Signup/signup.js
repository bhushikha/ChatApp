const url = 'http://localhost:3000';

async function signup(event) {
    try {
        event.preventDefault();
        const signupDetails = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phonenumber: document.getElementById('phonenumber').value,
            password: document.getElementById('password').value
        }

        const response = await axios.post(`${url}/user/signup`, signupDetails);

        if (response.status >= 200 && response.status < 300) {
            alert("Successfully signed up");
            window.location.href = "../Login/login.html";
        } else {
            const errorMessage = (response.data && response.data.message) || 'An error occurred during signup.';
            alert(errorMessage);
        }
    } catch (error) {
        console.log(error);
        alert('An error occurred during signup.');
    }
}

// Add an event listener to the form
document.getElementById('signup-form').addEventListener('submit', signup);
