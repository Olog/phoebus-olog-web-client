/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { FaRegQuestionCircle} from "react-icons/fa";
import SearchStringHelpDialog from './SearchStringHelpDialog';
import SearchResultGroup from './SearchResultGroup';
import LoadingOverlay from 'react-loading-overlay';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

/**
 * Pane showing search query input and a the list of log entries 
 * matching the query. 
 */
class SearchResultList extends Component{

    state = {
        showSearchStringHelpDialogVisible: false,
    }

    componentDidMount = () => {
        this.props.search();
    }

    search = (event) => {
        event.preventDefault();
        this.props.search();
    }

    setSearchString = (event) => {
        this.props.setSearchString(event.target.value, false);
    }

    setShowSearchStringHelpDialog = (show) => {
        this.setState({showSearchStringHelpDialogVisible: show});
    }

    render(){

        var tree = this.props.logs.map((element, index) => {
            return <SearchResultGroup 
                            key={index}
                            logEntries={element}
                            setCurrentLogEntry={this.props.setCurrentLogEntry}
                            selectedLogEntryId={this.props.selectedLogEntryId}/>
        });
        
        return(
            <Container className="grid-item full-height" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <h6>Search results</h6>
                <Form onSubmit={this.search}>
                    <Form.Row>
                        <Col style={{paddingLeft: "0px"}}>
                            <Form.Label style={{marginBottom: "0px"}}>Search string</Form.Label>
                                <FaRegQuestionCircle style={{cursor:'pointer', marginLeft: '5px'}}
                                    onClick={() => this.setShowSearchStringHelpDialog(true)}/>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col style={{paddingLeft: "0px"}}>
                            <Form.Control size="sm" 
                                type="input" 
                                placeholder="No search string"
                                value={this.props.searchString}
                                style={{fontSize: "12px"}}
                                onChange={this.setSearchString}> 
                            </Form.Control>
                        </Col>
                        <Col style={{flexGrow: "0"}}>
                            <Button type="submit" size="sm">Search</Button>
                        </Col>
                        <Col style={{flexGrow: "0"}}>
                            <ButtonGroup toggle >
                                <ToggleButton 
                                    size="sm"
                                    type="checkbox"
                                    checked={this.state.showGroup}
                                    onChange={(e) => this.toggleShowMerged(e.currentTarget.checked)}> 
                                </ToggleButton>
                        </ButtonGroup>
                        </Col>
                    </Form.Row>
                </Form>
                <LoadingOverlay
                    active={this.props.searchInProgress}
                    spinner
                    styles={{
                        overlay: (base) => ({
                          ...base,
                          background: 'rgba(97, 97, 97, 0.3)',
                          '& svg circle': {stroke: 'rgba(19, 68, 83, 0.9) !important'}
                        })
                      }}>
                <div style={{overflowY: 'scroll', height: 'calc(100vh)'}}>
                    {this.props.logs.length > 0 ? 
                        tree :
                        "No search results"}
                </div>
                </LoadingOverlay>

                <SearchStringHelpDialog
                    showSearchStringHelpDialogVisible={this.state.showSearchStringHelpDialogVisible}
                    setShowSearchStringHelpDialog={this.setShowSearchStringHelpDialog}/>
            </Container>
        )
    }
}

export default SearchResultList;