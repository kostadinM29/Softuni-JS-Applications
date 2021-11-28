import { html } from '../../node_modules/lit-html/lit-html.js';

import { getMemeById, updateMeme } from '../api/data.js';
import { notify } from '../notification.js';

const editTemplate = (meme, onSubmit) => html`
<section id="edit-meme">
    <form @submit=${onSubmit} id="edit-form">
        <h1>Edit Meme</h1>
        <div class="container">
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" name="title" .value=${meme.title}>
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter Description" name="description" .value=${meme.description}>
                        </textarea>
            <label for="imageUrl">Image Url</label>
            <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" .value=${meme.imageUrl}>
            <input type="submit" class="registerbtn button" value="Edit Meme">
        </div>
    </form>
</section>`;

export async function editPage(ctx) {
    const memeId = ctx.params.id;
    const meme = await getMemeById(memeId);

    async function onSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const imageUrl = formData.get('imageUrl');

        try {
            if (!title || !description || !imageUrl) {
                throw new Error('All fields are required');
            }
    
            const meme = {
                title,
                description,
                imageUrl
            };
    
            await updateMeme(memeId, meme);
            ctx.page.redirect('/details/' + memeId);
        } catch (err) {
            notify(err.message);
        }

    }

    ctx.render(editTemplate(meme, onSubmit));
}