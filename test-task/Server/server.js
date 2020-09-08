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

const pgInsert = (response) => {
    const client = getClient();

    client.connect();

    const text = 'INSERT INTO test_table VALUES (DEFAULT, $1, $2, $3 || 900 + (SELECT max(id) from test_table) || $4)';
    const values = ['Lorem Ipsum', 'Ipsum lorem', 'https://picsum.photos/id/', '/300/200'];

    client
        .query(text, values)
        .catch(e => console.error(e.stack))
        .then(() => client.end())
        .then(() => response.end());
}

const getId = (url) => {
    const urlArray = url.split('/');
    return urlArray[urlArray.length - 1];
}

const pgDelete = (url, response) => {
    const client = getClient();
    const id = getId(url);

    const text = 'DELETE FROM test_table WHERE id = $1';
    const values = [id];

    client.connect();   

    client
        .query(text, values)
        .catch(e => console.error(e.stack))
        .then(() => client.end())
        .then(() => response.end());
}

const pgGetCard = (url, response) => {
    const client = getClient();
    const id = getId(url);

    const text = 'SELECT id, name, description, image FROM test_table WHERE id = $1';
    const values = [id];

    client.connect();   

    client
        .query(text, values)
        .catch(e => console.error(e.stack))
        .then((res) => response.end(JSON.stringify(res.rows[0])))
        .then(() => client.end());
}

const pgUpdate = (url, data, response) => {
    const client = getClient();
    const id = getId(url);
    const text = 'UPDATE test_table SET (name, description) = ($1, $2) WHERE id = $3';
    const values = [data[0], data[1], id];

    client.connect();   

    client
        .query(text, values)
        .catch(e => console.error(e.stack))
        .then(() => response.end())
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

        if (request.url.match('/id/') !== null) {
            pgGetCard(request.url, response); console.log(request) }
    }

    if (request.method == 'POST') {
        if (request.url == '/add/random') {
            pgInsert(response);
        }
    }

    if (request.method == 'PUT') {
        if (request.url.match('/id/') !== null) {
            pgUpdate(request.url, request.data, response);
        }
    }

    if (request.method == 'DELETE') {
        if (request.url.match('/id/') !== null) {
            pgDelete(request.url, response)
        }
    }
}).listen(3002);

