require('dotenv').config()
const { Client } = require('pg')
const QueryUtil = require('./utils/queries.util')
const express = require('express')
const app = express()

const pool = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'recommendation',
    password: 'Joeydanilo1!',
    port: 5420
})
const util = new QueryUtil(pool)

app.listen(process.env.PORT, async () => {
    await pool.connect()
    const res = await util.GetSelectProps('products', null, '*')
    console.log(res)
})


// console.log(res)
