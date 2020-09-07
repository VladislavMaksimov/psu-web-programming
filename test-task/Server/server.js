const http = require("http");
const { Client } = require('pg')

const N = 10;
const cards = Array(N).fill().map((_, i) => ({
    "id": i,
    "name": 'Lorem ipsum',
    "description": 'Ipsum Lorem',
    "image": `https://picsum.photos/id/${900 + i}/300/200`
}));

const pgGet = (response) => {
    const client = new Client({
        host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'web-test-db'
    });

    client.connect();   

    client
        .query('SELECT id, name, description, image FROM test_table')
        .then(res => response.end(JSON.stringify(res.rows)))
        .catch(e => console.error(e.stack))
}

http.createServer((request, response) => {
    if (request.method == 'GET') {
        if (request.url == '/') {
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', '*');
            pgGet(response);
        }
    }
}).listen(3002);

