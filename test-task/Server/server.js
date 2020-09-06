const http = require("http");
const { Client } = require('pg')

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'web-test-db',
    port: '57443'
});

const N = 10;
const cards = Array(N).fill().map((_, i) => ({
    "id": i,
    "name": 'Lorem ipsum',
    "description": 'Lorem ipsum',
    "image": `https://picsum.photos/id/${900 + i}/300/200`
}));

http.createServer((request, response) => {
    if (request.method == 'GET') {
        if (request.url == '/') {
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.end(JSON.stringify(cards));
        }
    }
}).listen(3002);

client.connect();
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))