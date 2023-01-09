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
import { Remarkable } from 'remarkable';
import imageProcessor from 'utils/image-processor';
import Button from 'components/shared/Button';
import Modal, { Body, Footer, Header } from '../shared/Modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
    max-width: 90vw;
    max-height: 90vh;
`

class HtmlPreview extends Component{

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
        commonmarkSrc: "",
        innerHtml: {},
    }

    reset = () => {
        var source = this.props.getCommonmarkSrc();
        var allAttachedFiles = this.props.getAttachedFiles();
        this.remarkable.use(imageProcessor, {attachedFiles: allAttachedFiles, setHtmlPreview: true});
        this.setState({innerHtml:  this.remarkable.render(source)  });
    }

    
    render(){
        return(
            <StyledModal show={this.props.showHtmlPreview}
                onClose={() => this.props.setShowHtmlPreview(false)}
                onOpen={() => this.reset()}>
                <Header onClose={() => this.props.setShowHtmlPreview(false)}>
                    <h2>Description Preview</h2>
                </Header>
                <Body>
                        <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                            dangerouslySetInnerHTML={{ __html: this.state.innerHtml }}>
                        </div>
                </Body>
                <Footer>
                      <Button variant="secondary" onClick={() => this.props.setShowHtmlPreview(false)}>OK</Button>
                </Footer> 
            </StyledModal>
        )
    }
}

export default HtmlPreview;
