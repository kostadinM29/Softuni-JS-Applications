import { e, showView } from './dom.js';
import { showEdit } from './edit.js';
import { showHome } from './home.js';


const section = document.getElementById('movie-details');
section.remove();



export async function showDetails(id){
    showView(section)

    const requests = [
        fetch('http://localhost:3030/data/movies/' + id),
        fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`)
    ]

    
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if(userData != null){
        requests.push(fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userData.id}%22`));
    }
    const [movieRes, likesRes, ownLikeRes] = await Promise.all(requests);
    const [movie, likes, ownLike] = await Promise.all([
        movieRes.json(),
        likesRes.json(),
        ownLikeRes && ownLikeRes.json()
    ])
    const card = createMovieCard(movie, likes, ownLike);
    section.replaceChildren(card);
}

function createMovieCard(movie, likes, ownLike) {

    const controls = e('div', { className: 'col-md-4 text-center' },
        e('h3', { className: 'my-3' }, 'Movie Description'),
        e('p', {}, movie.description)
    );

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        if (userData.id == movie._ownerId) {
            controls.appendChild(e('a', { className: 'btn btn-danger', href: '#', onClick: (e) => onDelete(e, movie._id) }, 'Delete'));
            controls.appendChild(e('a', { className: 'btn btn-warning', href: '#', onClick: () => showEdit(movie._id) }, 'Edit'));
        } 
            if (ownLike.length > 0) {
                controls.appendChild(e('a', { className: 'btn btn-primary', href: '#', onClick: unlikeMovie }, 'Unlike'));
            } else {
                controls.appendChild(e('a', { className: 'btn btn-primary', href: '#', onClick: likeMovie }, 'Like'));
            }
        

        
    }

    const likesSpan = e('span', { className: 'enrolled-span' }, likes + ' like' + (likes == 1 ? '' : 's'));
    controls.appendChild(likesSpan);

    const element = document.createElement('div');
    element.className = 'container';

    element.appendChild(e('div', { className: 'row bg-light text-dark' },
        e('h1', {}, `Movie title: ${movie.title}`),
        e('div', { className: 'col-md-8' }, e('img', { className: 'img-thumbnail', src: movie.img })),
        controls
    ));

    async function likeMovie(event) {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': JSON.parse(sessionStorage.getItem('userData')).token
            },
            body: JSON.stringify({ movieId: movie._id })
        });

        if (response.ok) {
            event.target.remove();
            likes++;
            likesSpan.textContent = likes + ' like' + (likes == 1 ? '' : 's');
        }
        showDetails(movie._id);
    }

    async function unlikeMovie(event) {
        const likeId = ownLike[0]._id;

        const response = await fetch('http://localhost:3030/data/likes/' + likeId, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': JSON.parse(sessionStorage.getItem('userData')).token
            },
            body: JSON.stringify({ movieId: movie._id })
        });

        if (response.ok) {
            event.target.remove();
            likes++;
            likesSpan.textContent = likes + ' like' + (likes == 1 ? '' : 's');
        }
        showDetails(movie._id);
    }

    return element;
}

async function onDelete(e, id) {
    e.preventDefault();
    const confirmed = confirm('Are you sure you want to delete this movie ?');
    if (confirmed) {
        const response = await fetch('http://localhost:3030/data/movies/' + id, {
            method: 'delete',
            headers: { 'X-Authorization': JSON.parse(sessionStorage.getItem('userData')).token }
        });

        if (response.ok) {
            alert('Movie deleted');
            showHome();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    }
}