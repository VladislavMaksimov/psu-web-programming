const { Client } = require('pg');
const client = new Client();

;(async () => {
    await client.connect()
    const res = await client.query('SELECT COUNT(0) FROM test_table')
    console.log(res.rows[0].message) // Hello world!
    await client.end()
  })()