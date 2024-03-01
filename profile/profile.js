const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        try {
            const userInfoData = await getEmailFromToken(token);
            if (userInfoData) {
                displayUserInfoAndFetchUserInfo(userInfoData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        window.location.href = '/login/login.html';
    }
});

const informationUser = document.querySelector('.information');


async function displayUserInfoAndFetchUserInfo(userInfoData) {
    console.log(userInfoData);
    if (userInfoData) {
        // Создаем контейнер для информации
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('container');
        infoContainer.innerHTML = `
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Name</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="fullName">${userInfoData.userInfo.name}</div>
            </div>
            <br> 
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Email</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="email">${userInfoData.userInfo.email}</div>
            </div>
            <br> 
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Age</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="age">${userInfoData.userInfo.age}</div>
            </div>
            <br> 
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Gender</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="gender">${userInfoData.userInfo.gender}</div>
            </div>
            <br> 
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Admin</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="isAdmin">${userInfoData.userInfo.isAdmin}</div>
            </div>
            <br> 
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Joke</h6>
                </div>
                <div class="col-sm-9 text-secondary" id="Joke"></div>
            </div>
            <br> 
        `;
        
        // Добавляем контейнер с информацией о пользователе на страницу
        informationUser.appendChild(infoContainer);
        
        // Получаем шутку и добавляем её в соответствующий элемент
        const jokeContainer = infoContainer.querySelector("#Joke");
        const joke = await fetchJoke();
        jokeContainer.textContent = joke;
    }
}


async function getEmailFromToken(token) {
    try {
        const tokenParts = token.split('.');
        const decodedBody = atob(tokenParts[1]);
        const tokenBody = JSON.parse(decodedBody);
        return await userInfo(tokenBody.email, token);
    } catch (error) {
        console.error('Error:', error);
        return null;
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

document.getElementById('logout').addEventListener('click', function () {
    logout();
});

function logout() {
    localStorage.removeItem('token');
    alert('You have been signed out.');
    window.location.href = '/login/login.html';
}

function md5(string) {
    let hash = 0;
    if (string.length === 0) {
        return hash;
    }
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}


async function fetchJoke() {
    const url = "https://v2.jokeapi.dev/joke/Any";
    
    try {
        const response = await fetch(url);
      
        if (!response.ok) {
            throw new Error('Ошибка при получении шутки:', response.status);
        }

        const data = await response.json();
        if (data.type === "single") {
            return data.joke;
        } else if (data.type === "twopart") {
            return `${data.setup} ${data.delivery}`;
        }
    } catch (error) {
        console.error(error);
        return "Не удалось получить шутку :(";
    }
}