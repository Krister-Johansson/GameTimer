import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Hiscore from './components/hiscore'
import Timer from './components/timer'
import Player from './components/player'
import Start from './components/start'

const HiscoreView = () => {
    return <Hiscore admin={false} />
}

const HiscoreAdminView = () => {
    return <Hiscore admin={true} />
}

const TimerView = () => {
    return <Timer />
}

const PlayerView = () => {
    return <Player />
}

const StartView = () => {
    return <Start />
}

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={StartView} />
            <Route path="/player" exact component={PlayerView} />
            <Route path="/timer" exact component={TimerView} />
            <Route path="/hiscore" exact component={HiscoreView} />
            <Route path="/hiscore/admin" exact component={HiscoreAdminView} />
        </Router>
    )
}

export default App
