const http = require("http");
const { Client } = require('pg')

const getClient = () => {
    return new Client({
        host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'web-test-db'
    });
}

const pgGet = (response) => {
    const client = getClient();

    client.connect();   

    client
        .query('SELECT id, name, description, image FROM test_table')
        .then(res => response.end(JSON.stringify(res.rows)))
        .catch(e => console.error(e.stack))
        .then(() => client.end());
}

const pgDelete = (url) => {
    const client = getClient();
    const urlArray = url.split('/');
    const id = urlArray[urlArray.length - 1]

    const text = 'DELETE FROM test_table WHERE id = $1';
    const values = [id];

    client.connect();   

    client
        .query(text, values)
        .catch(e => console.error(e.stack))
        .then(() => client.end());
}

http.createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (request.method == 'OPTIONS') {
        response.end();
    }

    if (request.method == 'GET') {
        if (request.url == '/')
            pgGet(response);
    }

    if (request.method == 'POST') {
        if (request.url == '/\/id/') {
            
        }
    }

    if (request.method == 'DELETE') {
        if (request.url.match('/id/') !== null) {
            pgDelete(request.url)
        }
    }
}).listen(3002);

