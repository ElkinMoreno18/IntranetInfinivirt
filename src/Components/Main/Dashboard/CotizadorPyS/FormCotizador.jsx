import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Slider, IconButton, ButtonToolbar, toaster, AutoComplete, InputGroup } from 'rsuite'
import { InputNumber } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import EditIcon from '@rsuite/icons/Edit';
import CloseIcon from '@rsuite/icons/Close';
import TrashIcon from '@rsuite/icons/Trash';
import SearchIcon from '@rsuite/icons/Search';
import Notifications from './Notifications/Notifications';
import { useRef } from 'react';
import axios from 'axios';


let baseURL = 'http://localhost:3001/GetItems'
let PrecioVentMxU_USD
let UtilidadxU
let PrecioVentxI_USD
let VTotal
let UtilidadTotal
let PrecioVentMxU_COP
let PrecioVentxItem_COP
let Porc_UtilidadVentTotal
let Porc_UtilidadMU
let TRM_base = 3704
let flag = false;
let flag2 = false

export default function FormCotizador({ setdata, data, tdata, ...props }) {
    const [validated, setValidated] = useState(false);
    const [value, setValue] = useState(10);
    const [items, setItems] = useState(null)
    const inputRef = useRef(null)
    /*  const [TRM_base, setTRM_base] = useState(3704) */
    const [isEdit, setIsEdit] = useState(false)
    const [datos, setDatos] = useState({
        SKU: '',
        Descripcion: '',
        Cantidad: '',
        Vunitario: '',
        Porc_UtilidadMU,
        VTotal: '',
        UtilidadxU: '',
        PrecioVentMxU_USD: '',
        PrecioVentxI_USD: '',
        Porc_UtilidadVentTotal: '',
        UtilidadTotal: '',
        TRM_base: 3704,
        PrecioVentMxU_COP: '',
        PrecioVentxItem_COP: '',

    })
    useEffect(() => {
        axios.get(baseURL).then((response) => {
            const res = response.data.response.result.map(x => { return x.SKU })
            setItems(res)
        })
    }, [])
    useEffect(() => {
        inputRef.current.dispatchEvent(
            new Event("change", {
                detail: {
                    newValue: datos
                },
                bubbles: true,
                cancelable: true
            })
        );
    }, [datos, tdata])

    const handleInputChange = (event) => {

        setDatos(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));

        flag = true
    }
    useEffect(() => {
        if (tdata.length > 0) {
            setIsEdit(true)
        }
    }, [tdata])



    useEffect(() => {

        PrecioVentMxU_USD = calculatePrecioVentMxU_USD(datos.Vunitario, value)
        UtilidadxU = calculateUtilidadxU(PrecioVentMxU_USD, datos.Vunitario)
        PrecioVentxI_USD = calculatePrecioVentxI_USD(PrecioVentMxU_USD, datos.Cantidad)
        VTotal = calculateVTotal(datos.Vunitario, datos.Cantidad)
        Porc_UtilidadVentTotal = calculatePorc_UtilidadVentTotal(PrecioVentxI_USD, VTotal)
        UtilidadTotal = calculateUtilidadTotal(PrecioVentxI_USD, VTotal)
        PrecioVentMxU_COP = calculatePrecioVentMxU_COP(datos.TRM_base, PrecioVentMxU_USD)
        PrecioVentxItem_COP = calculatePrecioVentxItem_COP(datos.Cantidad, PrecioVentMxU_COP)

        if (flag === true || flag2 === true) {
            setDatos(prevState => ({
                ...prevState,
                VTotal,
                Porc_UtilidadMU: value,
                UtilidadxU,
                PrecioVentMxU_USD,
                PrecioVentxI_USD,
                Porc_UtilidadVentTotal,
                UtilidadTotal,
                PrecioVentMxU_COP,
                PrecioVentxItem_COP,
            }));
            flag = false
            flag2 = false
        }
    }, [handleInputChange])

    const enviarDatos = (event) => {
        event.preventDefault();
        const SKUS = [datos].map(el => el.SKU)
        const SKUN = data.map(el => el.SKU)
        if (SKUN.includes(SKUS[0]) !== true) {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                toaster.push(messageError, { placement: 'topEnd' })

            } else {
                setValidated(true)
                setdata([...data, datos]);
                toaster.push(messageSuccess, { placement: 'topEnd' })
                event.target.reset()
            }

        } else {
            toaster.push(messageErrorD, { placement: 'topEnd' })
        };


    }
    const editarDatos = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            toaster.push(messageError, { placement: 'topEnd' })

        } else {
            setIsEdit(false)
            setValidated(true)
            setdata([...data, datos]);
            toaster.push(messageEdit, { placement: 'topEnd' })
            event.target.reset()
        }
    }


    function calculateVTotal(Vunitario, Cantidad) {
        const Vtotal = Vunitario * Cantidad
        return Vtotal
    }
    function calculateUtilidadxU(PrecioVentMxU_USD, Vunitario) {
        let utilidadxU = PrecioVentMxU_USD - Vunitario
        return utilidadxU
    }
    function calculatePrecioVentMxU_USD(Vunitario, Porc_UtilidadMU) {
        let PrecioVentMxU_USD = Vunitario / (1 - (Porc_UtilidadMU / 100))
        return PrecioVentMxU_USD.toFixed(0)
    }
    function calculatePrecioVentxI_USD(PrecioVentMxU_USD, Cantidad) {
        let PrecioVentxI_USD = PrecioVentMxU_USD * Cantidad
        return PrecioVentxI_USD
    }
    function calculatePorc_UtilidadVentTotal(PrecioVentxI_USD, Vtotal) {
        let Porc_UtilidadVentTotal = ((PrecioVentxI_USD / Vtotal) - 1) * 100
        return Porc_UtilidadVentTotal.toFixed(0)
    }
    function calculateUtilidadTotal(PrecioVentxI_USD, Vtotal) {
        let UtilidadTotal = PrecioVentxI_USD - Vtotal
        return UtilidadTotal
    }
    function calculatePrecioVentMxU_COP(TRM_base, PrecioVentMxU_USD) {
        let PrecioVentMxU_COP = TRM_base * PrecioVentMxU_USD
        return PrecioVentMxU_COP
    }
    function calculatePrecioVentxItem_COP(Cantidad, PrecioVentMxU_COP) {
        let PrecioVentxItem_COP = Cantidad * PrecioVentMxU_COP
        return PrecioVentxItem_COP
    }
    function activeflag2() {
        flag2 = true
    }
    const messageSuccess = (
        <Notifications type={'success'} header={'completado'}  >
            Se ha agregado exitosamente!
        </Notifications>
    );
    const messageError = (
        <Notifications type={'error'} header={'Complete todos los campos'}  >
            Hay algunos campos que no han sido completados
        </Notifications>
    );
    const messageErrorD = (
        <Notifications type={'error'} header={'Costeo Existente'}  >
            Ya hay un Costeo con ese nombre ingresado
        </Notifications>
    );
    const messageEdit = (
        <Notifications type={'success'} header={'Editado con Exito'}  >
            Se ha editado los campos con exito!
        </Notifications>
    );
    const messageDelete = (
        <Notifications type={'success'} header={'Eliminado con Exito'}  >
            Se ha eliminado  correctamente!
        </Notifications>
    );
    const deleteSku = () => {
        let deleteData = data.filter((item) => item.SKU !== datos.SKU)
        setdata(deleteData)
        tdata.length = 0
        toaster.push(messageDelete, { placement: 'topEnd' })
        setIsEdit(false)


    }
    const CancelEdit = () => {
        tdata.length = 0
        setIsEdit(false)

    }
    return (
        <Form noValidate validated={validated} className='m-4 ' onSubmit={isEdit == false ? enviarDatos : editarDatos}>

            <Row className='d-flex justify-content-end'>
                <Col xs={2} className='mb-3'>
                    <Form.Label>TRM Base: </Form.Label>
                    <Form.Control style={{ border: '1px solid #1A5C91' }} type='number' name='TRM_base' onChange={handleInputChange} placeholder='TRM' defaultValue={TRM_base}></Form.Control>
                </Col >
            </Row>


            {/*  <h5>Nuevo Costeo: </h5> */}
            <Row className='mb-3'>
                <Col xs='4'>
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                        disabled={isEdit ? true : false}
                        required
                        type='text'
                        placeholder="SKU"
                        onChange={handleInputChange}
                        name='SKU'
                        ref={inputRef}
                        defaultValue={tdata[0] ? tdata[0].SKU : ""}
                    />
                    <Form.Control.Feedback>Bien!</Form.Control.Feedback>
                </Col>
                <Col xs='8'>
                    <Form.Label>Descripción del Producto</Form.Label>
                    <Form.Control required as="textarea"
                        placeholder="Descripción del Producto"
                        name='Descripcion'
                        onChange={handleInputChange}
                        defaultValue={tdata[0] ? tdata[0].Descripcion : ""}
                    />
                </Col >

            </Row>
            <Row>
                <Col xs='2'>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control required min={1}
                        type='number'
                        placeholder={0}
                        name='Cantidad'
                        onChange={handleInputChange}
                        defaultValue={tdata[0] ? tdata[0].Cantidad : ""}
                    />
                </Col>
                <Col xs='auto'>
                    <Form.Label>V/Unitario</Form.Label>
                    <Form.Control required type='number'
                        placeholder="V/Unitario"
                        name='Vunitario'
                        onChange={handleInputChange}
                        defaultValue={tdata[0] ? tdata[0].Vunitario : ""}
                    />
                </Col>
                <Col xs='2'>
                    <Form.Label>% Utilidad Mínima Unidad</Form.Label>
                    <Slider
                        progress
                        required
                        style={{ marginTop: 16 }}
                        value={value}
                        onChange={value => {
                            setValue(value);
                            activeflag2()
                        }}
                    />

                </Col>
                <Col xs='2' >
                    <Form.Label></Form.Label>
                    <InputNumber
                        min={0}
                        max={100}
                        value={value}
                        onChange={value => {
                            setValue(value);
                            activeflag2()
                        }}
                        placeholder='porcentaje'
                        postfix="%"
                        required
                    />
                </Col>
                <Col className='mt-4 d-flex'>
                    <ButtonToolbar type='submit' hidden={isEdit == true ? true : false} >
                        <IconButton type='submit' style={{ backgroundColor: "#001529", color: "white" }} icon={<PlusIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Agregar</IconButton>
                    </ButtonToolbar>
                    <ButtonToolbar type='submit' hidden={isEdit == false ? true : false} style={{ paddingRight: '10px' }} >
                        <IconButton type='submit' style={{ backgroundColor: "#001529", color: "white" }} icon={<EditIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Editar</IconButton>
                    </ButtonToolbar>
                    <ButtonToolbar hidden={isEdit == false ? true : false} style={{ paddingRight: '10px' }} onClick={deleteSku}>
                        <IconButton style={{ backgroundColor: "#001529", color: "white" }} icon={<TrashIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Eliminar</IconButton>
                    </ButtonToolbar>
                    <ButtonToolbar hidden={isEdit == false ? true : false} onClick={CancelEdit}>
                        <IconButton style={{ backgroundColor: "#001529", color: "white" }} icon={<CloseIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Cancelar</IconButton>
                    </ButtonToolbar>


                </Col>



            </Row>

        </Form>
    )
}
