import { html } from '../../node_modules/lit-html/lit-html.js';
import { searchAlbum } from '../api/data.js';

const searchTemplate = (albums, onSearch) => html`
<section id="searchPage">
    <h1>Search by Name</h1>

    <div class="search">
        <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name">
        <button class="button-list" @click=${onSearch} >Search</button>
    </div>

    <h2>Results:</h2>
    <div class="search-result">
        ${albums.length <= 0 ? html`<p class="no-result">No result.</p>` :
    albums.map(albumTemplate)}
    </div>
</section>`;

const albumTemplate = (album) => html`
    <div class="card-box">
        <img src="${album.imgUrl}">
        <div>
            <div class="text-center">
                <p class="name">Name: ${album.name}</p>
                <p class="artist">Artist: ${album.artist}</p>
                <p class="genre">Genre: ${album.genre}</p>
                <p class="price">Price: ${album.price}</p>
                <p class="date">Release Date: ${album.releaseDate}</p>
            </div>
            ${sessionStorage.getItem('email') == null ? ``
                 : html `<div class="btn-group">
                <a href="/details/${album._id}" id="details">Details</a>
            </div>` }
        </div>
    </div>`;

export async function searchPage(ctx) {
    let albums = [];
    ctx.render(searchTemplate(albums, onSearch));

    async function onSearch(event) {
        event.preventDefault();
        const query = event.target.parentNode.firstChild.value;
        console.log(query);
        albums = await searchAlbum(query);
        ctx.render(searchTemplate(albums, onSearch));
    }
}