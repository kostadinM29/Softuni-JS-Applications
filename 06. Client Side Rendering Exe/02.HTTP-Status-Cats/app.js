import { html, render } from '../node_modules/lit-html/lit-html.js';
import { styleMap } from '../node_modules/lit-html/directives/style-map.js';
import { cats } from './catSeeder.js';

const template = (cat) => html`
        <li>
            <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
            <div class="info">
                <button class="showBtn">${cat.info ? 'Show' : 'Hide'}</button>
                <div class="status" style=${styleMap(cat.info ?  {display: 'none'} :{} )} id=${cat.id}>
                    <h4>Status Code: ${cat.statusCode}</h4>
                    <p>${cat.statusMessage}</p>
                </div>
            </div>
        </li>`;

const section = document.getElementById('allCats');
cats.forEach(c => c.info = true);
update();

function update(){
    const result = html`
    <ul @click=${onClick}>
        ${cats.map(template)}
    </ul>
`;
render(result, section);
}

function onClick(event){
    const elementId = event.target.parentNode.querySelector('.status').id;
    const cat = cats.find(x => x.id == elementId);
    cat.info = !cat.info;
    update();
}