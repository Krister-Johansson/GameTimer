import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

import { config } from '../config'

const client = new W3CWebSocket(`ws://${config.server}`)

export default class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            player: null,
            leader: null,
            isOn: false,
            start: 0,
        }

        this.timer = null
        this.reloadTimer = null

        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
        this.getNextPlayer = this.getNextPlayer.bind(this)
        this.parsTime = this.parsTime.bind(this)
        this.getLeader = this.getLeader.bind(this)
        this.setUserTime = this.setUserTime.bind(this)
        this.sendStateToServer = this.sendStateToServer.bind(this)
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected')
            this.sendStateToServer('gameTimer', false)
            this.sendStateToServer('newPlayer', true)
        }

        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data)

            switch (dataFromServer.eventType) {
                case 'startTimer':
                    if (this.state.player != null) {
                        this.startTimer()
                    }
                    console.log(this.timer)
                    break
                case 'stopTimer':
                    if (this.state.player != null) {
                        this.stopTimer()
                    }
                    console.log(this.timer)
                    break
                case 'resetTimer':
                    if (this.state.player != null) {
                        this.resetTimer()
                    }
                    console.log(this.timer)
                    break
                default:
                    break
            }
        }

        this.getNextPlayer()
        this.getLeader()
    }

    sendStateToServer(eventType, data) {
        client.send(JSON.stringify({ eventType, data }))
    }

    startTimer() {
        this.setState({
            isOn: true,
            time: this.state.time,
            start: Date.now() - this.state.time,
        })

        this.sendStateToServer('gameTimer', true)

        this.timer = setInterval(
            () =>
                this.setState({
                    time: Date.now() - this.state.start,
                }),
            1
        )
    }

    setUserTime(time) {
        fetch(`http://${config.server}/api/user/${this.state.player.id}/time`, {
            method: 'POST',
            body: JSON.stringify({
                time,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(x => {
            this.getNextPlayer()
            this.getLeader()
        })
    }

    stopTimer() {
        const { time } = this.state
        this.resetTimer()
        this.setUserTime(time)
    }

    resetTimer() {
        this.sendStateToServer('gameTimer', false)
        this.setState({ isOn: false })
        this.setState({ time: 0 })
        
        clearInterval(this.timer)
    }

    parsTime(duration) {
            var milliseconds = parseInt((duration%1000)/10)
                , seconds = parseInt((duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);
        
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
        
            return minutes + ":" + seconds + ":" + milliseconds;
    }

    getNextPlayer() {
        this.setState({
            player: null,
        })
        clearInterval(this.reloadTimer)
        fetch(`http://${config.server}/api/nextplayer`)
            .then(response => response.json())
            .then(player => {
                if (player == null) {
                    this.reloadTimer = setInterval(
                        () => this.getNextPlayer(),
                        3000
                    )
                } else {
                    this.setState({
                        player,
                    })
                }
            })
    }

    getLeader() {
        fetch(`http://${config.server}/api/leader`)
            .then(response => response.json())
            .then(leader => {
                this.setState({
                    leader,
                })
            })
    }

    render() {
        const { player, leader, time } = this.state

        const sectionStyle = {
            backgroundImage: `url('/images/background.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }

        return (
            <main style={sectionStyle}>
                <section className="container">
                    <div className="row row-center timer">
                        <div className="column whiteBackground">
                            {player === null ? (
                                <h1>Väntar på spelare!</h1>
                            ) : (
                                <div>
                                    <div className="row">
                                        <div className="column">
                                            <h1>{this.parsTime(time)}</h1>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="column">
                                            <h2>
                                                {player.name} ({player.company})
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <footer className="footer">
                    <section className="container">
                        <div className="row row-center ">
                            <div className="column center">
                                <p>Designed with ♥ by LEDtec</p>
                            </div>
                            <div className="column center">
                                {leader !== null ? (
                                    <div>
                                        <div className="row">
                                            <div className="column">
                                                <FontAwesomeIcon
                                                    className="goldCrown"
                                                    icon={faCrown}
                                                />
                                                <h3>{leader.name}</h3>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="column">
                                                <h1>{this.parsTime(leader.time)}</h1>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="column center">
                                <img src="/images/logo.png" alt="" />
                            </div>
                        </div>
                    </section>
                </footer>
            </main>
        )
    }
}
