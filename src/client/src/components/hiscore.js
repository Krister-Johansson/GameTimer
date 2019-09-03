import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

export default class Hiscore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hiscore: null,
        }
    }
    componentDidMount() {
        fetch('http://localhost:3000/api/hiscore?top=10')
            .then(response => response.json())
            .then(data => {
                this.setState({ hiscore: data })
            })
    }

    generateCrown = place => {
        if (place > 3) return place

        let crown = 'goldCrown'
        switch (place) {
            case 1:
                crown = 'goldCrown'
                break
            case 2:
                crown = 'silverCrown'
                break
            case 3:
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
                                        <th align="center"></th>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Time</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Company</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th align="center"></th>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Time</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {admin
                                    ? hiscore.map(player => (
                                          <tr key={player.place}>
                                              <td align="center">
                                                  {this.generateCrown(
                                                      player.place
                                                  )}
                                              </td>
                                              <td>{player.avatar}</td>
                                              <td>
                                                  <strong>{player.name}</strong>
                                              </td>
                                              <td>{player.time}</td>
                                              <td>{player.email}</td>
                                              <td>{player.phone}</td>
                                              <td>{player.company}</td>
                                          </tr>
                                      ))
                                    : hiscore.map(player => (
                                          <tr key={player.place}>
                                              <td align="center">
                                                  {this.generateCrown(
                                                      player.place
                                                  )}
                                              </td>
                                              <td>{player.avatar}</td>
                                              <td>
                                                  <strong>{player.name}</strong>
                                              </td>
                                              <td>{player.time}</td>
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
