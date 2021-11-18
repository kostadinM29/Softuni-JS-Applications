const host = 'http://localhost:3030/jsonstore/collections/books'

export async function getAllBooks() {

    const response = await fetch(host);
    const data = await response.json();

    return Object.entries(data).map(([k, v]) => Object.assign(v, { _id: k }));
}

export async function getBookById(id) {

    const response = await fetch(host + '/' + id);
    const data = await response.json();

    return data;
}

export async function createBook(book) {

    const response = await fetch(host, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(book)
    });

}

export async function editBook(id, book) {
    const response = await fetch(host + '/' + id, {
        method: 'put',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(book)
    });

}

export async function deleteBook(id) {
    await fetch(host + '/' + id, {
        method: 'delete',
    });
}