document.getElementById('title').innerHTML = MESSAGES.title
document.getElementById('header').innerHTML = MESSAGES.title
document.getElementById('insert-button').innerHTML = MESSAGES.insertButton
document.getElementById('query-button').innerHTML = MESSAGES.queryButton

const serverAddress = 'https://nbartyuk.site/lab5'


class Query {
    constructor() {
        document.getElementById('insert-button').addEventListener('click', () => {
            this.insertButton();
        })

        document.getElementById('query-button').addEventListener('click', () => {
            this.queryButton();
        })
    }

    insertButton() {
        const text = "INSERT INTO Patient (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')";

        const xhr = new XMLHttpRequest();
        xhr.open('POST', serverAddress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                const result = JSON.parse(responseData).result;
                
                document.getElementById('response').innerHTML = '';

                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';

                const pre = document.createElement('pre');
                pre.className = 'json-pretty';

                let jsonStr = '';
                for (const [key, value] of Object.entries(result)) {
                    jsonStr += `${key}: ${value}\n`;
                }

                pre.textContent = jsonStr.trim();
                resultElement.appendChild(pre);
                document.getElementById('response').appendChild(resultElement);
            }
        };
        xhr.send(JSON.stringify({ query: text }));
    }

    queryButton() {
        const text = document.getElementById('query-box').value;


        if (text.startsWith('SELECT')) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', serverAddress + `/?query=` + text, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    let result = JSON.parse(data).result;
                    
                    document.getElementById('response').innerHTML = '';

                    for (let i = 0; i < result.length; i++) {
                        const resultElement = document.createElement('div');
                        resultElement.className = 'result-item';

                        const pre = document.createElement('pre');
                        pre.className = 'json-pretty';

                        let jsonStr = '';
                        for (const [key, value] of Object.entries(result[i])) {
                            jsonStr += `${key}: ${JSON.stringify(value, null, 2)}\n`;
                        }

                        pre.textContent = jsonStr.trim();
                        resultElement.appendChild(pre);
                        document.getElementById('response').appendChild(resultElement);
                    }


                }

                if (xhr.status === 405 || xhr.status === 400) {
                    const responseData = JSON.parse(xhr.responseText);
                    document.getElementById('response').innerHTML = responseData.message;
                }
            };
            xhr.send();
        }
        else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', serverAddress, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    const result = JSON.parse(responseData).result;
                    
                    document.getElementById('response').innerHTML = '';

                    const resultElement = document.createElement('div');
                    resultElement.className = 'result-item';

                    const pre = document.createElement('pre');
                    pre.className = 'json-pretty';

                    let jsonStr = '';
                    for (const [key, value] of Object.entries(result)) {
                        jsonStr += `${key}: ${value}\n`;
                    }

                    pre.textContent = jsonStr.trim();
                    resultElement.appendChild(pre);
                    document.getElementById('response').appendChild(resultElement);

                }

                if (xhr.status === 405 || xhr.status === 400) {
                    const responseData = JSON.parse(xhr.responseText);
                    document.getElementById('response').innerHTML = responseData.message;
                }
            };
            xhr.send(JSON.stringify({ query: text }));
        }
    }

}

new Query();
