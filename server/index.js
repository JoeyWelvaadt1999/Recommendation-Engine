require('dotenv').config()
const { Client } = require('pg')
const { QueryUtil } = require('./utils/queries.util')
const { Recommendation } = require('./utils/recommendation.util')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'recommendation',
    password: 'Joeydanilo1!',
    port: 5420
})
const util = new QueryUtil(client)
const rec = new Recommendation(client)

app.listen(process.env.PORT, async () => {
    await client.connect()
    console.log('listening on port ' + process.env.PORT)
    
})

app.get('/', async (req, res, next) => {
    
    const rows = await util.GetSelectProps('products', ['*'])
    // const item = rows[Math.floor(Math.random() * rows.length)]
    res.send(rows)
    // 
    // 
    // res.send(recommendations)
})

app.get('/profiles', async (req, res, next) => {
    const rows = await util.GetSelectProps('profiles', ['*'])
    console.log(rows)
    res.send(rows)

})

app.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const item = (await util.GetSelectProps('products', ['*'], {"id": id}))[0]
    
    const recommendations = await rec.GetContentRecommendation('products', item, 4)
    res.send(recommendations)
})


// console.log(res)
