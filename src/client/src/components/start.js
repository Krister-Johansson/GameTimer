import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Hiscore extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.newWindow = this.newWindow.bind(this)
    }
    newWindow = path => {
        window.open(path, '_blank')
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="column">
                        <button
                            onClick={() => {
                                this.newWindow('/hiscore')
                            }}
                        >
                            Hiscore
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <button
                            onClick={() => {
                                this.newWindow('/hiscore/admin')
                            }}
                        >
                            Hiscore Admin
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <button
                            onClick={() => {
                                this.newWindow('/timer')
                            }}
                        >
                            Tid
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <button
                            onClick={() => {
                                this.newWindow('/player')
                            }}
                        >
                            Admin
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
