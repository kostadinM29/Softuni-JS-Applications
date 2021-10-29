function loadRepos() {
	const nameField = document.getElementById(`username`);
	const resultEl = document.getElementById(`repos`);

	const url = `https://api.github.com/users/${nameField.value}/repos`;
	fetch(url)
		.then(res => {
			if (res.ok == false) {
				throw new Error(`${res.status} - ${res.statusText}`);
			}
			return res.json();
		})
		.then(handleResponse)
		.catch(error => console.log(error));




	resultEl.innerHTML = '';

	function handleResponse(data) {
		data.forEach(({ full_name, html_url }) => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.innerHTML = full_name;
			a.href = html_url;

			li.appendChild(a);
			resultEl.appendChild(li);
		});
	}
}