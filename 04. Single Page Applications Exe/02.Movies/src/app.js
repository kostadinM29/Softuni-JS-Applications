import { showHome } from "./home.js";
import { showLogin} from "./login.js";
import { showRegister } from "./register.js";

const views = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,

}
const nav = document.querySelector('nav');

document.getElementById('logoutBtn').addEventListener('click', onLogout)
nav.addEventListener('click', (event)=>{
    const view = views[event.target.id];
    if (typeof view == 'function') {
        event.preventDefault();
        view();
    }
});

export function updateNav(){
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if(userData != null){
        document.getElementById('welcomeMsg').textContent = `Welcome, ${userData.email}`;
        [...document.querySelectorAll('.user')].forEach(l => l.style.display = 'block');
        [...document.querySelectorAll('.guest')].forEach(l => l.style.display = 'none');
    } else {
        [...document.querySelectorAll('.user')].forEach(l => l.style.display = 'none');
        [...document.querySelectorAll('.guest')].forEach(l => l.style.display = 'block');
    }
}

async function onLogout(event){
    event.preventDefault();
    event.stopImmediatePropagation();

    const {token} = JSON.parse(sessionStorage.getItem('userData'));

    await fetch('http://localhost:3030/users/logout', {
        headers:{
            'X-Authorization' : token
        }
    });
    sessionStorage.removeItem('userData');
    updateNav();
    showLogin();
}

updateNav();
showHome();