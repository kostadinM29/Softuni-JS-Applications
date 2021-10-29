function loadCommits() {
    const username = document.getElementById('username').value;

    const repo = document.getElementById('repo').value;

    const url = `https://api.github.com/repos/${username}/${repo}/commits`;

    let result = document.getElementById('commits');


    function _createLi(_text) {
        let li = document.createElement('li');
        li.textContent = _text;
        result.appendChild(li);
    }
    let status;
    fetch(url)
        .then(promise => {

            if (!promise.status.ok) {
                status = promise.status;
            }
            return promise.json();
        })
        .then(data => {
            result.innerHTML = '';
            if (data.message === 'Not Found') {
                _createLi(`Error:${status} (${data.message})`);
                return;
            }
            data.forEach(e => {
                _createLi(`${e.commit.author.name}: ${e.commit.message}`);
            });
        });

        username = '';
        repo = '';

}