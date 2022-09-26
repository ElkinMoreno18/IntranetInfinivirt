import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import { ButtonToolbar, IconButton } from 'rsuite';
function FormFactura({ setOpen, ...props }) {

    const guardarDatos = () => {
        setOpen(false)
    }

    return (
        <Form className='m-4 '>
            <h5>Datos Factura: </h5>
            <Row className='d-flex justify-content'>
                <Col>
                    <Form.Label>Numero Factura</Form.Label>
                    <Form.Control type='text' />
                </Col>
                <Col>
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control type='text' />
                </Col>
                <Col>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type='date' />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label>Referencia</Form.Label>
                    <Form.Control type='text' />
                </Col>
                <Col>
                    <Form.Label>Proyecto</Form.Label>
                    <Form.Control type='text' />
                </Col>
                <Col>
                    <Form.Label>Proveedor</Form.Label>
                    <Form.Control type='text' />
                </Col>
            </Row>
            <Row>
                <ButtonToolbar className='mt-2' onClick={guardarDatos} >
                    <IconButton style={{ backgroundColor: "#001529", color: "white" }} icon={<AddOutlineIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Guardar</IconButton>
                </ButtonToolbar>
            </Row>
        </Form>

    )
}

export default FormFactura