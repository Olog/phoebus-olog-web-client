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

import React, {useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Banner = (props) =>{

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [what, setWhat] = useState("");

  const handleCreate = () => {
    setShow(false);
    props.create(what, name);
  };

  const handleClose = () => {
    setShow(false);
  };

  const showAddModal = (event) => {
    setWhat(event.target.name);
    setShow(true);
  }

  const handleNameInput = (event) => {
    setName(event.target.value);
  };
  
  return (
    <>
      <Navbar bg="dark" variant="dark" expanded="true">
        <Navbar.Brand href="#home">Olog ES</Navbar.Brand>
        <Button variant="primary">New Log Entry</Button>{' '}
        <Dropdown>
          <Dropdown.Toggle>
            <span className="caret"></span>
          </Dropdown.Toggle>
          <DropdownMenu>
            <Dropdown.Item onClick={showAddModal} name="Logbook">New Logbook</Dropdown.Item>
            <Dropdown.Item onClick={showAddModal} name="Tag">New Tag</Dropdown.Item>
          </DropdownMenu>
        </Dropdown>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{'New ' + what}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder={what + ' name'} onChange={handleNameInput} /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Banner