import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './components/game/Game';
import Lobby from './components/lobby/Lobby';

const App = () => (
    <Router>
        <Switch>
            <Route path="/play">
                <Game />
            </Route>
            <Route path="/">
                <Lobby />
            </Route>
        </Switch>
    </Router>
);

export default App;
