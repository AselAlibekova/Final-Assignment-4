const loginContainer = document.querySelector('#loginForm');
const registrationContainer = document.querySelector('#registrationForm');
document.querySelector('#loginBtn').addEventListener("click", login);
document.querySelector('#registerBtn').addEventListener("click", registration);


async function login() {
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    try {
        const token = await getToken(loginEmail, loginPassword);
        //console.log(token)

            if (token) {
                setLocalStorage('token', token, 30); 
                alert('Login successful');
            window.location.href='/main/index.html'
            } else {
            alert('Incorrect email or password');
        }
    } catch (error) {
        console.error('Error logging in', error);
    }

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

async function registration() {
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const ageInput = document.getElementById('regAge');
    const genderInput = document.querySelector('input[name="gender"]:checked');

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const age = ageInput.value;
    const gender = genderInput ? genderInput.value : '';
    const isAdmin=false

    try {
        const token = await registerUser(name, email, password, age, gender, isAdmin);
        console.log(token);
        const subject='Asel'
        const message="Welcome to the site"

        if (token) {

            setLocalStorage('token', token, 30);
            alert('Registration successful');
            console.log(email)
            await sendRegistrationEmail(email,subject,message)
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error registering user', error);
    }

    // Clear input fields after registration
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    ageInput.value = '';
    genderRadios.forEach(radio => {
        radio.checked = false;
    });
}
async function sendRegistrationEmail(email,subject,message) {
    try {
        // Отправка запроса на сервер для отправки электронной почты
        const response = await fetch(`http://localhost:3000/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email,subject,message })
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email', error);
    }
}
async function getToken(email, password) {
    try {
        const response = await fetch(`http://localhost:3000/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting token', error);
        return null;
    }
}


async function registerUser(name, email, password, age, gender , isAdmin) {
    try {
        const response = await fetch(`http://localhost:3000/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, age, gender, isAdmin })
        });
        
        if (response.ok) {
            const data = await response.json();
            await sendRegistrationEmail(email);
           // console.log(data)
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error registering user', error);
        return null;
    }
}

function toggleForm() {
    var loginForm = document.getElementById('loginForm');
    var registrationForm = document.getElementById('registrationForm');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registrationForm.style.display = 'block';
    }
}



async function getUserInfo(email){
    try {
        const response = await fetch(`http://localhost:3000/api/getUser/${email}`);
        const data = await response.json();
       // console.log(data);
        return data.userInfo;
    } catch (error) {
        console.error('error:', error);
    }
}

async function userInfo(email, token) {
    try {
        const response = await fetch(`http://localhost:3000/api/getUser/${email}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting user info:', error);
        return null;
    }
}

async function getEmailFromToken(token) {
    try {
        const tokenParts = token.split('.');
        const decodedBody = atob(tokenParts[1]);
        const tokenBody = JSON.parse(decodedBody);
        console.log(tokenBody)
        return await userInfo(tokenBody.email, token);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function setLocalStorage(name, value, days) {
    localStorage.setItem(name, value);
    //console.log("Local storage set:", localStorage.getItem(name)); 
}

const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach(radio => {
    radio.addEventListener('change', () => {
       // console.log('Selected gender:', radio.value);
    });
});