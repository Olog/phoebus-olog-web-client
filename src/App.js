import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MainApp from './MainApp';
import LogEntryEditor from './LogEntryEditor'

export default function App() {
    return(
        <Router>
            <Switch>
                <Route exact path="/">
                    <MainApp />
                </Route>
                <Route path="/edit">
                    <LogEntryEditor/>
                </Route>
            </Switch>
        </Router>
    );
}