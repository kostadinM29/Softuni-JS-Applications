import { showDetails } from './details.js';
import { showView } from './dom.js';




const section = document.getElementById('add-movie');
const form = section.querySelector('form').addEventListener('submit', onSubmit);
section.remove();

export function showCreate(){
    showView(section)
}

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl')
    };

    if (movie.title == '' || movie.description == '' || movie.img == '') {
        return alert('All field are required!');
    };

    const response = await fetch('http://localhost:3030/data/movies', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': JSON.parse(sessionStorage.getItem('userData')).token
        },
        body: JSON.stringify(movie)
    });

    if (response.ok) {
        const movie = await response.json();
        showDetails(movie._id);
    } else {
        const error = await response.json();
        alert(error.message);
    }
}
