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
import './css/olog.css';
import LogDetails from './LogDetails';

/**
 * A view show all details of a log entry. The purpose of this is
 * to render the log entry details only, i.e. in a "detached" view mode.
 */
class LogDetailsDetached extends Component{

    state = {
        showError: false
    }

    componentDidMount = () => {
        this.loadLogEntry(this.props.match.params.id);
    }

    loadLogEntry = (id) => {
        if(id < 1){
            return;
        }
        this.setState({showError: false});
        fetch(`${process.env.REACT_APP_BASE_URL}/logs/` + id)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                throw Error("Server returned error.");
            }
        })
        .then(data => {
          if(data){
              this.props.setCurrentLogEntry(data);
          }
        })
        .catch(() => {
            this.props.setCurrentLogEntry(null);
            this.setState({showError: true});
        });
    }

    render(){
        return(
            <>
            {!this.state.showError && 
                <LogDetails currentLogEntry={this.props.currentLogEntry}
                    setCurrentLogEntry={this.props.setCurrentLogEntry}
                    setShowGroup={this.props.setShowGroup}/>}
            {this.state.showError &&
                <h5>Log record id {this.props.match.params.id} not found</h5>}
            </>
        );     
    }

}

export default LogDetailsDetached;
