import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { config } from '../config';

const client = new W3CWebSocket(`ws://${config.server}`)

export default class Hiscore extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hiscore: null,
        }
        this.updateHiscore = this.updateHiscore.bind(this);
        this.generateCrown = this.generateCrown.bind(this)
        this.parsTime = this.parsTime.bind(this)
    }

    componentDidMount() {
        this.updateHiscore()

        client.onopen = () => {
            console.log('WebSocket Client Connected')
        }

        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data)

            switch (dataFromServer.eventType) {
                case 'update':
                    this.updateHiscore()
                    break;

                default:
                    break;
            }
        }
    }
    parsTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds + ":" + milliseconds;
    }
    updateHiscore = () => {
        fetch(`http://${config.server}/api/hiscore?top=10`)
            .then(response => response.json())
            .then(data => {
                this.setState({ hiscore: data })
            })
    }

    generateCrown = place => {
        if (place > 2) return place

        let crown = 'goldCrown'
        switch (place) {
            case 0:
                crown = 'goldCrown'
                break
            case 1:
                crown = 'silverCrown'
                break
            case 2:
                crown = 'bronzeCrown'
                break
            default:
                crown = 'goldCrown'
                break
        }
        return <FontAwesomeIcon className={crown} icon={faCrown} />
    }

    render() {
        const { hiscore } = this.state
        const { admin } = this.props

        if (hiscore == null) {
            return <div>Loading...</div>
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="column">
                        <table>
                            <thead>
                                {admin ? (
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Time</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Company</th>
                                    </tr>
                                ) : (
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Company</th>
                                            <th>Time</th>
                                        </tr>
                                    )}
                            </thead>
                            <tbody>
                                {admin
                                    ? hiscore.map((player, place) => (
                                        <tr key={place}>
                                            <td className="centerCrown">
                                                {this.generateCrown(place)}
                                            </td>
                                            <td>
                                                <strong>{player.name}</strong>
                                            </td>
                                            <td>{this.parsTime(player.time)}</td>
                                            <td>{player.email}</td>
                                            <td>{player.phone}</td>
                                            <td>{player.company}</td>
                                        </tr>
                                    ))
                                    : hiscore.map((player, place) => (
                                        <tr key={place}>
                                            <td className="centerCrown">
                                                {this.generateCrown(place)}
                                            </td>
                                            <td>
                                                <strong>{player.name}</strong>
                                            </td>
                                            <td>Company</td>
                                            <td>{this.parsTime(player.time)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
