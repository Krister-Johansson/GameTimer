const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const boom = require('boom')
const Excel = require('exceljs')
const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const http = require('http')
const WebSocket = require('ws')
const Gpio = require('onoff').Gpio

let isTimerStarted = false

const ledStart = new Gpio(22, 'out')
const buttonStart = new Gpio(23, 'in', 'both')

const ledStop = new Gpio(24, 'out')
const buttonStop = new Gpio(25, 'in', 'both')

const ledReset = new Gpio(26, 'out')
const buttonReset = new Gpio(27, 'in', 'both')

sgMail.setApiKey('')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const user = require('./util/user')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
    session({
        secret: 'helloWorld',
        resave: true,
        saveUninitialized: false,
    })
)
let iv = null

const updateLedStatus = () => {
    if (isTimerStarted) {
        clearInterval(iv)
        ledStart.writeSync(0)
        ledStop.writeSync(1)
        ledReset.writeSync(1)
    } else {
        ledStop.writeSync(0)
        ledReset.writeSync(0)
        iv = setInterval(_ => ledStart.writeSync(led.readSync() ^ 1), 200)
    }
}

wss.on('connection', ws => {
    console.log('New connection!')

    ws.on('message', message => {
        const { eventType, data } = JSON.parse(message)
        switch (eventType) {
            case 'gameTimer':
                if (data) {
                    console.log('Timer startade')
                    isTimerStarted = true
                } else {
                    console.log('Timer stopad!')
                    isTimerStarted = false
                }
                break
            case 'newPlayer':
                isTimerStarted = false
                break
            default:
                break
        }
        updateLedStatus()
    })
})

const sendStatus = (eventType, data) => {
    return new Promise((resolve, reject) => {
        wss.clients.forEach(client => {
            client.send(JSON.stringify({ eventType, data }))
        })
        resolve()
    })
}

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.get('/api/user', (req, res, next) => {
    user.list()
        .then(x => {
            res.json(x)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.get('/api/user/:id', (req, res, next) => {
    const { id } = req.params
    user.get(id)
        .then(x => {
            res.json(x)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.get('/api/timer/start', (req, res, next) => {
    sendStatus('startTimer', true).then(z => {
        res.sendStatus(200)
    })
})

app.get('/api/timer/reset', (req, res, next) => {
    sendStatus('resetTimer', true).then(z => {
        res.sendStatus(200)
    })
})

app.get('/api/timer/stop', (req, res, next) => {
    sendStatus('stopTimer', true).then(z => {
        res.sendStatus(200)
    })
})

app.post('/api/user', (req, res, next) => {
    const { name, email, phone, company } = req.body

    user.create(name, email, phone, company)
        .then(x => {
            res.sendStatus(200)
        })
        .catch(err => {
            if (err.code === 11000) {
                return next(boom.badData('Användaren finns redan!'))
            }
            return next(boom.badRequest(err))
        })
})

app.put('/api/user/:id', (req, res, next) => {
    const { id } = req.params
    const { name, email, phone, company } = req.body

    user.update(id, { name, email, phone, company })
        .then(x => {
            if (x === null) {
                return next(boom.notFound('Kan inte hitta användaren'))
            }
            res.sendStatus(200)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.delete('/api/user/:id', (req, res, next) => {
    const { id } = req.params

    user.remove(id)
        .then(x => {
            if (x === null) {
                return next(boom.notFound('Kan inte hitta användaren'))
            } else {
                res.sendStatus(200)
            }
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.post('/api/user/:id/time', (req, res, next) => {
    const { id } = req.params
    const { time } = req.body

    user.setTime(id, time)
        .then(x => {
            if (x === null) {
                return next(boom.notFound('Kan inte hitta användaren'))
            } else {
                sendStatus('update', true).then(z => {
                    res.sendStatus(200)
                })
            }
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.get('/api/hiscore', (req, res, next) => {
    user.hiscore()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.get('/api/nextplayer', (req, res, next) => {
    user.nextPlayer()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.get('/api/leader', (req, res, next) => {
    user.leader()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.post('/api/export', (req, res, next) => {
    const { to } = req.body

    user.export()
        .then(users => {
            const workbook = new Excel.Workbook()
            const worksheet = workbook.addWorksheet('Hiscore')
            worksheet.columns = [
                { header: 'Namn', key: 'name' },
                { header: 'E-post', key: 'email' },
                { header: 'Telefon', key: 'phone' },
                { header: 'Företag', key: 'company' },
                { header: 'Tid', key: 'time' },
            ]

            const result = users.map(data => {
                return {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    company: data.company,
                    time: data.time,
                }
            })
            worksheet.addRows(result)

            workbook.xlsx
                .writeFile('hiscore.xlsx')
                .then(() => {
                    const file = fs.readFileSync('hiscore.xlsx')
                    const content = Buffer.from(file).toString('base64')
                    const msg = {
                        to,
                        from: 'krister.johansson86@outlook.com',
                        subject: 'Resultat från GameTime',
                        text: 'Se bifogad fil',
                        attachments: [
                            {
                                content,
                                filename: 'hiscore.xlsx',
                                type: 'plain/text',
                                disposition: 'attachment',
                                contentId: 'hiscore',
                            },
                        ],
                    }
                    sgMail
                        .send(msg)
                        .then(x => {
                            res.sendStatus(200)
                        })
                        .catch(err => {
                            return next(boom.badRequest(err))
                        })
                })
                .catch(err => {
                    return next(boom.badRequest(err))
                })
        })
        .catch(err => {
            return next(boom.badRequest(err))
        })
})

app.use((err, req, res, next) => {
    if (err.isServer) {
        // log the error...
        // probably you don't want to log unauthorized access
        // or do you?
    }
    return res.status(err.output.statusCode).json(err.output.payload)
})

server.listen(process.env.PORT || 5001, () => {
    console.log(`Server started on port ${server.address().port} :)`)
    updateLedStatus()
})

buttonStart.watch((err, value) => {
    if (err) {
        throw err
    }

    sendStatus('startTimer', true).then(z => {})
})

buttonReset.watch((err, value) => {
    if (err) {
        throw err
    }

    sendStatus('resetTimer', true).then(z => {})
})

buttonStop.watch((err, value) => {
    if (err) {
        throw err
    }

    sendStatus('stopTimer', true).then(z => {})
})

process.on('SIGINT', () => {
    ledStart.unexport()
    buttonStart.unexport()
    ledStop.unexport()
    buttonStop.unexport()
    ledReset.unexport()
    buttonReset.unexport()
})
