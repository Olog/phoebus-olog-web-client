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
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormFile from 'react-bootstrap/FormFile';

class EmbedImageDialog extends Component{

    state = {
        imageAttachment: null,
        imageWidth: "",
        imageHeight: "",
        fileName: "",
        originalImageWidth: 0,
        originalImageHeight: 0,
        scalingFactor: "1.0",
        scaleValid: true,
    }

    nameRef = React.createRef();
    fileInputRef = React.createRef();

    addEmbeddedImage = (event) => {
        event.preventDefault();
        this.props.addEmbeddedImage(this.state.imageAttachment, 
            this.state.imageWidth, 
            this.state.imageHeight);
    }

    onFileChanged = (event) => {
        if(event.target.files){
            this.setState({imageAttachment: event.target.files[0]}, 
                () => {
                    this.checkImageSize(this.state.imageAttachment, this.setSize);
                });
        }
        
        this.fileInputRef.current.value = null;
    }

    setSize = (w, h) => {
        this.setState({scalingFactor: "1.0", 
            originalImageWidth: w, 
            originalImageHeight: h,
            imageWidth: w,
            imageHeight: h})
    }

    checkImageSize(image, setSize){
        //check whether browser fully supports all File API
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var fr = new FileReader();
            fr.onload = function() { // file is loaded
                var img = new Image();
                img.onload = function() { // image is loaded; sizes are available
                    setSize(img.width, img.height);
                };
                img.src = fr.result; // is the data URL because called with readAsDataURL
            };
            fr.readAsDataURL(image);
        }
    }    

    onBrowse = () => {
        this.fileInputRef.current.click();
    }

    reset = () => {
        this.setState({scalingFactor: "1.0", 
            imageAttachment: null,
            scaleValid: true,
            originalImageWidth: 0, 
            originalImageHeight: 0,
            imageWidth: "",
            imageHeight: ""})
    }

    scalingFactorChanged = (event) => {
        this.setState({scalingFactor: event.target.value});
        if(event.target.value){
            if(parseFloat(event.target.value) > 0 && parseFloat(event.target.value) <= 1){
                this.setState({scaleValid: true});
                var newImageWidth = Math.round(parseFloat(event.target.value) * this.state.originalImageWidth);
                var newImageHeight = Math.round(parseFloat(event.target.value) * this.state.originalImageHeight);
                this.setState({imageWidth: newImageWidth, imageHeight: newImageHeight});
            }
            else{
                this.setState({scaleValid: false});
            }
        }    
    }
    
    render(){
        return(
            <Modal show={this.props.showEmbedImageDialog} 
                onHide={() => this.props.setShowEmbedImageDialog(false)}
                onShow={() => this.reset()}>
                <Form onSubmit={this.addEmbeddedImage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Embedded Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                        <Form.Row>
                            <Form.Label style={{marginTop: "0.5rem"}}>File</Form.Label>
                            <Form.Control readOnly
                                type="text" as={Col} style={{marginLeft: "5px", marginRight:"5px"}}>{this.state.imageAttachment ? this.state.imageAttachment.name : ""}</Form.Control>
                            <Button onClick={this.onBrowse}>Browse</Button>
                            <FormFile.Input
                                        hidden
                                        ref={ this.fileInputRef }
                                        onChange={ this.onFileChanged } />
                        </Form.Row>
                        <Form.Row>
                            <Form.Label style={{marginTop: "0.5rem"}}>Scaling Factor</Form.Label>
                            <Form.Control as="input" style={{marginLeft: "5px", width: "60px"}}
                                    value={this.state.scalingFactor} onChange={this.scalingFactorChanged}/>
                                <Form.Control.Feedback type="invalid">
                                            Scaling factor must be &gt; 0 and &lt;= 1.0
                                </Form.Control.Feedback>
                            <Form.Label as={Col} style={{marginTop: "0.5rem", textAlign: "right"}}>Width</Form.Label>
                            <Form.Control readOnly as={Col}>{this.state.imageWidth}</Form.Control>
                            <Form.Label as={Col} style={{marginTop: "0.5rem", textAlign: "right"}}>Height</Form.Label>
                            <Form.Control readOnly as={Col}>{this.state.imageHeight}</Form.Control>
                        </Form.Row>
                        <Form.Row>
                            {this.state.scaleValid ? null : <Form.Label className="form-error-label" column={true}>Scaling Factor must be &gt;0 and &lt;=1.</Form.Label>}
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.setShowEmbedImageDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={this.state.imageAttachment === null}>OK</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default EmbedImageDialog;