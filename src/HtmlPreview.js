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
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Remarkable } from 'remarkable';
import './css/olog.css';
import imageProcessor from './preview-image-processor';

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
    }

    getContent = (source) => {
        return {__html: this.remarkable.render(source)};
    }

    reset = (source) => {
        var allAttachedFiles = this.props.getAttachedFiles();
        this.remarkable.use(imageProcessor, {attachedFiles: allAttachedFiles});
        this.setState({commonmarkSrc: source})
    }

    
    render(){
        return(
            <Modal className="html-preview-modal" size="lg" show={this.props.showHtmlPreview}
                onHide={() => this.props.setShowHtmlPreview(false)}
                onShow={() => this.reset(this.props.getCommonmarkSrc())}>
                <Modal.Body>
                        <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                            dangerouslySetInnerHTML={this.getContent(this.state.commonmarkSrc)}>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="secondary" onClick={() => this.props.setShowHtmlPreview(false)}>OK</Button>
                </Modal.Footer> 
            </Modal>
        )
    }
}

export default HtmlPreview;
