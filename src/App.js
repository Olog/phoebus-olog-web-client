/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MainApp from './MainApp';
import Banner from './Banner';
import EntryEditor from './EntryEditor';

/**
 * Entry point component.
 */
class App extends Component{

    state = {
        logbooks: [],
        tags: []
    }

    componentDidMount() {
        // Logbooks and tags are public to read
        this.refreshLogbooks();
        this.refreshTags();
    }

    
    refreshLogbooks = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks`)
        .then(response => response.json())
        .then(data => this.setState({logbooks: data}))
        .catch(() => this.setState({logbooks: []}));
    }
    
    refreshTags = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/Olog/tags`)
        .then(response => response.json())
        .then(data => {
          if(data){
              this.setState({tags: data});
          }
        })
        .catch(() => this.setState({tags: []}));
    }

    render(){
        return(
            <>
                <Router>
                    <Banner userData={this.state.userData}
                            refreshLogbooks={this.refreshLogbooks}
                            refreshTags={this.refreshTags}
                            setShowLogin={this.setShowLogin}
                            setShowLogout={this.setShowLogout}/>
                    <Switch>
                        <Route exact path="/">
                            <MainApp logbooks={this.state.logbooks}
                                tags={this.state.tags}/>
                        </Route>
                        <Route path="/edit">
                            <EntryEditor 
                                logbooks={this.state.logbooks}
                                tags={this.state.tags}
                                setShowLogin={this.setShowLogin}
                                userData={this.state.userData}/>
                        </Route>
                    </Switch>
                </Router>
            </>
        );
    }
}

export default App;