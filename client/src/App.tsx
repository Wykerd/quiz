import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Game from './views/Game';

export default function App () {
    return <BrowserRouter>
        <Switch>
            <Route exact path="/:id">
                <Game/>
            </Route>
        </Switch>
    </BrowserRouter>
}