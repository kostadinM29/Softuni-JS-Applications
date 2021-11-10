import { showDetails } from './details.js';
import { showView } from './dom.js';


const section = document.getElementById('edit-movie');
const form = section.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
    }));
section.remove();

export async function showEdit(id){
    showView(section)

    const movie = await getMovieById(id);

    section.querySelector('[name="id"]').value = id;
    section.querySelector('[name="title"]').value = movie.title;
    section.querySelector('[name="description"]').value = movie.description;
    section.querySelector('[name="imageUrl"]').value = movie.img;
}

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const movie = await response.json();

    return movie;
}

async function onSubmit(data) {
    const token = JSON.parse(sessionStorage.getItem('userData')).token;
    try {
        const response = await fetch('http://localhost:3030/data/movies/' + data.id, { 
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({ title: data.title, description: data.description, img: data.imageUrl })
        });

        if (response.ok) {
            showDetails(data.id);
        } else {
            throw new Error(await response.json());
        }
    } catch (err) {
        console.error(err.message);
    }
}