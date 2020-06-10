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

import React, { Component } from 'react'
import Banner from './Banner'
import Logbooks from './Logbooks'

class App extends Component {

  state = {
    logbooks: []
  }

  create = (what, name) => {
    if(what === 'Logbook'){
      this.createLogbook(name);
    }
    else if(what === 'Tag'){
      this.createTag(name);
    }
  };

  createLogbook = (name) => {
    

  };

  createTag = (name) => {

  };

  componentDidMount() {

    const url = `${process.env.REACT_APP_BASE_URL}/logbooks`;

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState({
          logbooks: result,
        },(error) => {
          this.setState({
            isLoaded: true,
            error
          });
        })
      })
  }

  render() {
    return (
      <div>
        <Banner create={this.create}/>
        <Logbooks logbooks={this.state.logbooks}/>
      </div>
    )
  }
}

export default App