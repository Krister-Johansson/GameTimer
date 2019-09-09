import React, { Component } from 'react'
import logo from '../images/logo_web_big.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { config } from '../config';

export default class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            companyField: '',
            nameField: '',
            emailField: '',
            phoneField: '',
            players: null,
            edit: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.fetchUsers = this.fetchUsers.bind(this)
        this.exportUsers = this.exportUsers.bind(this)
        this.fetchUser = this.fetchUser.bind(this)
        this.cancelEdit = this.cancelEdit.bind(this)
        this.removeUser = this.removeUser.bind(this)
    }

    componentDidMount() {
        this.fetchUsers()
    }

    cancelEdit() {
        this.setState({
            userId: '',
            companyField: '',
            nameField: '',
            emailField: '',
            phoneField: '',
            edit: false,
        })
    }

    exportUsers() {
        const to = prompt('Ange en E-post för att expotera listan till')
        if (to != null) {
            fetch('api/export', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify({
                    to,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    if (res.status > 300) {
                        res.json().then(b => {
                            alert(b.message)
                        })
                    } else {
                        alert('Den är nu skickad!')
                    }
                })
                .catch(error => console.log(error))
        } else {
            alert('Du måste ange en E-post')
        }
    }

    removeUser(id, name) {
        const confirm = window.confirm(`Vill du radera spelare: ${name}?`)
        if (confirm) {
            fetch(`http://${config.server}/api/user/${id}`, {
                method: 'DELETE',
            }).then(res => this.fetchUsers())
        }
    }

    fetchUser(id) {
        fetch(`http://${config.server}/api/user/${id}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    userId: data.id,
                    companyField: data.company,
                    nameField: data.name,
                    emailField: data.email,
                    phoneField: data.phone,
                    edit: true,
                })
            })
    }

    fetchUsers() {
        fetch(`http://${config.server}/api/user`)
            .then(response => response.json())
            .then(data => {
                this.setState({ players: data })
            })
    }

    handleSubmit(event) {
        event.preventDefault()
        const {
            userId,
            companyField,
            nameField,
            emailField,
            phoneField,
            edit,
        } = this.state

        fetch(`api/user${edit ? `/${userId}` : ''}`, {
            method: edit ? 'PUT' : 'POST',
            body: JSON.stringify({
                company: companyField,
                name: nameField,
                email: emailField,
                phone: phoneField,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status > 300) {
                    res.json().then(b => {
                        alert(b.message)
                    })
                } else {
                    return res.json()
                }
            })
            .then(response => {
                this.setState({
                    userId: '',
                    companyField: '',
                    nameField: '',
                    emailField: '',
                    phoneField: '',
                    edit: false,
                })
                this.fetchUsers()
            })
            .catch(error => console.log(error))
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const centerStyle = {
            textAlign: 'center',
        }
        const { players, edit } = this.state
        return (
            <main className="container-full">
                <div className="row row-center" style={centerStyle}>
                    <div className="column">
                        <img src={logo} alt="" />
                    </div>
                    <div className="column">
                        <div className="row">
                            <div className="column">
                                <h1>Support</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <h2>054-24 07 90</h2>
                            </div>
                        </div>
                    </div>
                    <div className="column center">
                        <button
                            className="button button-outline"
                            onClick={this.exportUsers}
                        >
                            Export
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="column column-25">
                        <div className="row">
                            <div className="column">
                                <h2>Lägg till spelare</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <form onSubmit={this.handleSubmit}>
                                    <fieldset>
                                        <label htmlFor="companyField">
                                            Företag
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Företag"
                                            id="companyField"
                                            name="companyField"
                                            value={this.state.companyField}
                                            onChange={this.handleChange}
                                        />
                                        <label htmlFor="nameField">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Namn"
                                            id="nameField"
                                            name="nameField"
                                            value={this.state.nameField}
                                            onChange={this.handleChange}
                                        />
                                        <label htmlFor="emailField">
                                            E-Post
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="E-Post"
                                            id="emailField"
                                            name="emailField"
                                            disabled={edit}
                                            value={this.state.emailField}
                                            onChange={this.handleChange}
                                        />
                                        <label htmlFor="phoneField">
                                            Telefon
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Telefon"
                                            id="phoneField"
                                            name="phoneField"
                                            value={this.state.phoneField}
                                            onChange={this.handleChange}
                                        />

                                        {/* <div className="float-right">
                                            <input
                                                type="checkbox"
                                                id="confirmField"
                                                name="confirmField"
                                            />
                                            <label
                                                className="label-inline"
                                                htmlFor="confirmField"
                                            >
                                                Send a SMS
                                            </label>
                                        </div> */}
                                        <div className="row">
                                            <div className="column">
                                                <input
                                                    className="button-primary"
                                                    type="submit"
                                                    value={
                                                        edit
                                                            ? 'Ändra'
                                                            : 'Lägg till'
                                                    }
                                                />
                                            </div>
                                            {edit ? (
                                                <div className="column">
                                                    <button
                                                        className="button button-outline"
                                                        onClick={() => {
                                                            this.cancelEdit()
                                                        }}
                                                    >
                                                        Avbryt
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="column column-75">
                        <table>
                            <thead>
                                <tr>
                                    <th>Företag</th>
                                    <th>Namn</th>
                                    <th>Tid</th>
                                    <th>E-Post</th>
                                    <th>Telefon</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {players
                                    ? players.map(player => (
                                          <tr key={player.id}>
                                              <td>{player.company}</td>
                                              <td>{player.name}</td>
                                              <td>{player.time}</td>
                                              <td>{player.email}</td>
                                              <td>{player.phone}</td>
                                              <td>
                                                  <button
                                                      className="button button-clear"
                                                      onClick={() => {
                                                          this.fetchUser(
                                                              player.id
                                                          )
                                                      }}
                                                  >
                                                      <FontAwesomeIcon
                                                          icon={faEdit}
                                                      />
                                                  </button>
                                              </td>
                                              <td>
                                                  <button
                                                      className="button button-clear"
                                                      onClick={() => {
                                                          this.removeUser(
                                                              player.id,
                                                              player.name
                                                          )
                                                      }}
                                                  >
                                                      <FontAwesomeIcon
                                                          icon={faTrash}
                                                      />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        )
    }
}
