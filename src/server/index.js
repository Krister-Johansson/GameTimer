const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')

const users = require('./model/users')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(
    session({
        secret: 'helloWorld',
        resave: true,
        saveUninitialized: false,
    })
)

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.get('/api/user', (req, res) => {
    console.log('user')
    users.list().then(x=>{
        console.log(x)
        res.json(x)
    })
})

app.post('/api/user', (req, res) => {
    const {name, email, phone, company} = req.body
    users.create(name, email, phone, company).then(x=>{
        console.log(x)
        res.json(x)
    })
})

app.get('/api/hiscore', (req, res) => {
    res.json([{
        place: 1,
        avatar: null,
        name: 'Krister Johansson',
        time: 123456,
        email: 'krister.johansson86@outlook.com',
        phone: '0704562745',
        company: 'Flexmatic',
    },{
        place: 2,
        avatar: null,
        name: 'Gert Johansson',
        time: 123456,
        email: 'gert.johansson86@outlook.com',
        phone: '0704562745',
        company: 'Flexmatic',
    },{
        place: 3,
        avatar: null,
        name: 'Anne Johansson',
        time: 123456,
        email: 'anne.johansson86@outlook.com',
        phone: '0704562745',
        company: 'Flexmatic',
    },{
        place: 4,
        avatar: null,
        name: 'Åsa Johansson',
        time: 123456,
        email: 'asa.johansson86@outlook.com',
        phone: '0704562745',
        company: 'Flexmatic',
    }])
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
