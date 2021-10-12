/**
 * Copyright (C) 2021 European Spallation Source ERIC.
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
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

class NavigationButtons extends Component {

    step = (amount) => {
        const {history} = this.props;
        let id = this.props.selectedLogEntryId + amount;
        fetch(`${process.env.REACT_APP_BASE_URL}/logs/` + id)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else if(response.status === 404){
                alert("Unable to step further.");
            }
        })
        .then(data => {
            if(data){
                history.push('/logs/' + data.id);
                this.props.setCurrentLogEntry(data);
            }
        })
        .catch(err => {
            alert("Server encountered error.")
        });
    }

    render (){
        return (
            <>
                <OverlayTrigger delay={{ hide: 450, show: 300 }}
                     overlay={(props) => (
                        <Tooltip {...props}>Previous log entry</Tooltip>
                    )}
                    rootClose
                    placement="bottom">
                    <Button size="sm" 
                        style={{marginTop: "10px", marginRight: "5px"}}
                        onClick={() => this.step(-1)}><FaArrowLeft/></Button>
                </OverlayTrigger>
                <OverlayTrigger delay={{ hide: 450, show: 300 }}
                     overlay={(props) => (
                        <Tooltip {...props}>Next log entry</Tooltip>
                    )}
                    rootClose
                    placement="bottom">
                    <Button size="sm" 
                        style={{marginTop: "10px", marginRight: "10px"}}
                        onClick={() => this.step(1)}><FaArrowRight/></Button>
                </OverlayTrigger>
            </>
        )
    }
}

export default withRouter(NavigationButtons);

