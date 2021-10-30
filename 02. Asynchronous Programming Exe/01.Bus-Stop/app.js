async function getInfo() {
    const input = document.getElementById('stopId');
    const id = input.value;
    const url = `http://localhost:3030/jsonstore/bus/businfo/${id}`;
   
    try {
        const ul = document.getElementById('buses');
        ul.innerHTML = '';
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById('stopName').textContent = data.name;

        Object.entries(data.buses).map(([bus, time]) => {
            const result = document.createElement('li');
            result.textContent = `Bus ${bus} arrives in ${time} minutes`;
            ul.appendChild(result);
        });
        input.value = '';

    } catch (error) {
        document.getElementById('stopName').textContent = 'Error';
    }
}