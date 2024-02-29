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
const avatarUser = document.querySelector('.avatar');

async function displayUserInfoAndFetchUserInfo(userInfoData) {
    console.log(userInfoData)
    if (userInfoData) {
       
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
    `;

        informationUser.appendChild(infoContainer);
        avatarUser.appendChild(avatar);
    }
    const editUserButton = document.getElementById('editUser');
    editUserButton.addEventListener('click', async function () {
        addBtn();
    });
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

document.querySelector("#cancel").addEventListener("click", function() {
    cancelBtn();
});
function addBtn() {
    $('.dialog').attr('close', false);
    $('.dialog').attr('open', true);

}
function cancelBtn() {
    $('.dialog').attr('open', false)
    $('.dialog').attr('close', true)

}
