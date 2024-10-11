document.getElementById('title').innerHTML = MESSAGES.title
document.getElementById('header').innerHTML = MESSAGES.title
document.getElementById('insert-button').innerHTML = MESSAGES.insertButton
document.getElementById('query-button').innerHTML = MESSAGES.queryButton

const serverAddress = 'https://nbartyuk.site/lab5'

document.getElementById('insert-button').addEventListener('click', () => {
    const data = 'INSERT INTO Patient (name, dateOfBirth) VALUES ("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01")'

    const xhr = new XMLHttpRequest();
    xhr.open('POST', serverAddress, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            document.getElementById('response').innerHTML = responseData;
        }
    };
    xhr.send(data);
})

document.getElementById('query-button').addEventListener('click', () => {
    const query = document.getElementById('query-box').value;


    if (query.startsWith('SELECT')) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', serverAddress + `/?query=` + query, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                document.getElementById('response').innerHTML = data;
            }
        };
        xhr.send();
    }

    if (query.startsWith('INSERT')) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', serverAddress + '/insert', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                document.getElementById('response').innerHTML = responseData;
            }
        };
        xhr.send(query);
    }
})
