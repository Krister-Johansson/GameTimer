import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

import { config } from '../config';

import logo from '../images/logo_web_big.svg'
import BackgroundImage from '../images/bg.png'

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
                    this.startTimer()
                    break
                case 'stopTimer':
                    this.stopTimer()
                    break
                case 'resetTimer':
                    this.resetTimer()
                    break;
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

    setUserTime() {
        const { time } = this.state
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
            this.resetTimer()
            this.getLeader()
        })
    }

    stopTimer() {
        this.setState({isOn: false})
        clearInterval(this.timer)
        this.setUserTime()
    }

    resetTimer() {
        this.sendStateToServer('gameTimer', false)
        this.setState({ time: 0, isOn: false })
        clearInterval(this.timer)
    }

    parsTime(time) {
        if (time > 1000) {
            return (time / 1000).toFixed(2)
        }
        return time
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
            backgroundImage: `url(${BackgroundImage})`,
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
                                <p>Designed with ♥ by Flexmatic</p>
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
                                                <h1>{leader.time / 1000}</h1>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="column center">
                                <img src={logo} alt="" />
                            </div>
                        </div>
                    </section>
                </footer>
            </main>
        )
    }
}
