import { updateNav } from './app.js';
import { showView } from './dom.js';
import { showHome } from './home.js';


const section = document.getElementById('form-sign-up');
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);
section.remove();

export function showRegister(){
    showView(section)
}

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('repeatPassword');


    if (email == '' || password == '') {
        return alert('All field are requeired!');
    } else if (password != rePass){
        return alert('Password don\'t match!');
    }

    const response = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        event.target.reset();
        const data = await response.json();

        sessionStorage.setItem('userData', JSON.stringify({
            email: data.email,
            id: data._id,
            token: data.accessToken
        }));

        updateNav();
        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}