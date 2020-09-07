const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'web-test-db'
});

const N = 10;
const cards = Array(N).fill().map((_, i) => ({
    "id": i,
    "name": 'Lorem ipsum',
    "description": 'Ipsum Lorem',
    "image": `https://picsum.photos/id/${900 + i}/300/200`
}));

client.connect();
const text = 'INSERT INTO test_table VALUES (DEFAULT, $1, $2, $3)';
Object.values(cards).map(card => {
    const values = [card.name, card.description, card.image];
    client
        .query(text, values);
});