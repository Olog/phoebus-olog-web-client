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
import Container from 'react-bootstrap/Container';
import { Remarkable } from 'remarkable';
import imageProcessor from './image-processor';
import './css/olog.css';
import customization from './customization';
import {getLogEntryGroupId} from './utils';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import LogEntryGroupView from './LogEntryGroupView';
import LogEntrySingleView from './LogEntrySingleView';
import {Link} from "react-router-dom";
import NavigationButtons from './NavigationButtons';


/**
 * A view show all details of a log entry. Images are renderd, if such are
 * present. Other types of attachments are rendered as links.
 */
class LogDetails extends Component{

    remarkable = new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        // Enable some language-neutral replacements + quotes beautification
        typographer:  false,
      });
    
    state = {
        openInfo: false,
        attachmentVisible: false,
    };

    componentDidMount = () => {
        this.remarkable.use(imageProcessor, {urlPrefix: customization.urlPrefix});
    }

    getContent = (source) => {
        return {__html: this.remarkable.render(source)};
    }

    toggleShowMerged = (e) => {
        this.props.setShowGroup(e);
    }

    render(){
        return(
            <>
            
            {/* Render only if currentLogRecord is defined, i.e. when user has selected from search result list,
            or if the route is of the type /logs/:id */}
            {this.props.currentLogEntry &&
                <Container className="grid-item full-height">
                    <NavigationButtons selectedLogEntryId={this.props.currentLogEntry.id}
                        setCurrentLogEntry={this.props.setCurrentLogEntry}/>
                    {/* Site may choose to not support log entry groups */}
                    {customization.log_entry_groups_support && 
                        <Link to="/edit">
                            <Button size="sm" 
                                    disabled={!this.props.userData || !this.props.userData.userName}
                                    style={{marginTop: "10px", marginRight: "5px"}} 
                                    onClick={() => this.props.setReplyAction(true)}>
                                Reply
                            </Button>
                        </Link>
                    }
                    <span style={{float: "right"}}>
                        <Button type="button" size="sm" style={{marginTop: "10px"}} onClick={() => {navigator.clipboard.writeText(
                            document.baseURI.endsWith('logs/' + this.props.currentLogEntry.id)
                                ? document.baseURI
                                : document.baseURI + 'logs/' + this.props.currentLogEntry.id
                        )}}>Copy URL</Button>
                    </span>
                    {getLogEntryGroupId(this.props.currentLogEntry.properties) &&
                        <ButtonGroup toggle style={{marginTop: "10px"}}>
                            <ToggleButton 
                                size="sm"
                                type="checkbox"
                                checked={this.props.showGroup}
                                onChange={(e) => this.toggleShowMerged(e.currentTarget.checked)}>Show/hide group
                            </ToggleButton>
                        </ButtonGroup>
                    }
                    {!this.props.showGroup &&
                        <LogEntrySingleView currentLogEntry={this.props.currentLogEntry} remarkable={this.remarkable}/>
                    }
                    {this.props.showGroup &&
                        <LogEntryGroupView {...this.props}
                            setCurrentLogEntry={this.props.setCurrentLogEntry}
                            setLogGroupRecords={this.props.setLogGroupRecords}
                            logGroupRecords={this.props.logGroupRecords}
                            remarkable={this.remarkable}/>
                    }
                </Container>
            }
            </>
        )
    }
}

export default LogDetails;
