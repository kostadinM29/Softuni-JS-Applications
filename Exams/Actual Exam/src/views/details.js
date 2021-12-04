import { html } from '../../node_modules/lit-html/lit-html.js';

import { deleteAlbum, getAlbumById } from '../api/data.js';
                             
const detailsTemplate = (album, isOwner, onDelete) => html`
<section id="detailsPage">
        <div class="wrapper">
            <div class="albumCover">
                <img src="${album.imgUrl}">
            </div>
            <div class="albumInfo">
                <div class="albumText">

                    <h1>Name: ${album.name}</h1>
                    <h3>Artist: ${album.artist}</h3>
                    <h4>Genre: ${album.genre}</h4>
                    <h4>Price: ${album.price}</h4>
                    <h4>Date: ${album.releaseDate}</h4>
                    <p>Description: ${album.description}</p>
                </div>

                <!-- Only for registered user and creator of the album-->
                ${isOwner == true ? html`
                <div class="actionBtn">
                    <a href="/edit/${album._id}" class="edit">Edit</a>
                    <a click=${onDelete} class="remove">Delete</a>
                </div>` : ``}
            </div>
        </div>
    </section>`;

export async function detailsPage(ctx) {
    const userId = sessionStorage.getItem('userId'); 
    const albumId = ctx.params.id;
    const album = await getAlbumById(albumId);
    const isOwner = userId === album._ownerId; 

    ctx.render(detailsTemplate(album, isOwner, onDelete)); 

    async function onDelete(){
        const confirmed = confirm('Are you sure?');
        if (confirmed){
            await deleteAlbum(albumId);
            ctx.page.redirect('/catalog');
        }
    }
}