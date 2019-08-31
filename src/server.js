const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
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
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
 });
app.listen(3000)
