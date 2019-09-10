import React, { Component } from 'react'
import { config } from '../config';

export default class Hiscore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedLogoFile: null,
            selectedBackgroundFile: null,
            loadedLogo: 0,
            loadedBackground: 0,
        }
        this.onChangeLogoHandler = this.onChangeLogoHandler.bind(this)
        this.onChangeBackgroundHandler = this.onChangeBackgroundHandler.bind(this)
        this.onClickUpload = this.onClickUpload.bind(this)
    }

    componentDidMount() {
        this.newWindow = this.newWindow.bind(this)
    }

    newWindow = path => {
        window.open(path, '_blank')
    }

    onClickUpload = (type) => {
        const { selectedLogoFile, selectedBackgroundFile, loadedLogo, loadedBackground } = this.state
        const data = new FormData() 

        if(type == 'logo'){
            data.append('file', selectedLogoFile)
        }else{
            data.append('file', selectedBackgroundFile)
        }

        fetch(`http://${config.server}/api/upload/${type}`, {
            method: 'POST',
            body: data,
        })
        .then(x=>{
            alert('Klart')
        });
    }
    onChangeLogoHandler = event => {
        this.setState({
            selectedLogoFile: event.target.files[0],
            loadedLogo: 0,
        })
    }
    onChangeBackgroundHandler = event => {
        this.setState({
            selectedBackgroundFile: event.target.files[0],
            loadedBackground: 0,
        })
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
                <div className="row">
                    <div className="column">
                        <fieldset>
                            <label htmlFor="fileLogo">
                                Logo
                                        </label>
                            <input type="file" name="fileLogo" onChange={this.onChangeLogoHandler} />
                            <button
                                className="button button-outline"
                                onClick={() => {
                                    this.onClickUpload('logo')
                                }}
                            >
                                Upload
                            </button>

                            <label htmlFor="fileBackground">
                                Bakgrund
                                        </label>
                            <input type="file" name="fileBackground" onChange={this.onChangeBackgroundHandler} />
                            <button
                                className="button button-outline"
                                onClick={() => {
                                    this.onClickUpload('background')
                                }}
                            >
                                Upload
                            </button>
                        </fieldset>
                    </div>
                </div>
            </div>
        )
    }
}
