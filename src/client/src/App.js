import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Hiscore from './components/hiscore'

const HiscoreView = () => {
    return <Hiscore admin={false} />
}
const HiscoreAdminView = () => {
    return <Hiscore admin={true} />
}

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={HiscoreView} />
            <Route path="/hiscore/" exact component={HiscoreView} />
            <Route path="/hiscore/admin" exact component={HiscoreAdminView} />
        </Router>
    )
}

export default App
