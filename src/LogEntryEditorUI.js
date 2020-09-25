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
import Banner from './Banner';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EntryEditor from './EntryEditor';

class LogEntryEditorUI extends Component{
    render(){
        return(
            <>
                <Container fluid className="full-height">
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} style={{padding: "0px"}}>
                            <Banner userData={this.props.userData}  
                                setUserData={this.props.setUserData} 
                                refreshLogbooks={this.props.refreshLogbooks}
                                refreshTags={this.props.refreshTags}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} style={{padding: "0px"}}>
                            <EntryEditor 
                                logbooks={this.props.logbooks}
                                tags={this.props.tags}/>
                        </Col>
                    </Row>
                </Container>
          </>
        )
    }
}

export default LogEntryEditorUI;