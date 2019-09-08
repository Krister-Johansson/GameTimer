import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Hiscore from './components/hiscore'
import Timer from './components/timer'
import Player from './components/player'

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

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={HiscoreView} />
            <Route path="/player" exact component={PlayerView} />
            <Route path="/timer" exact component={TimerView} />
            <Route path="/hiscore" exact component={HiscoreView} />
            <Route path="/hiscore/admin" exact component={HiscoreAdminView} />
        </Router>
    )
}

export default App
