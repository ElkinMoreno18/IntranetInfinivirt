import React, { useEffect, useState } from 'react'
import FormCotizador from './FormCotizador'
import TableCotizadorPyS from './TableCotizadorPyS'
import { Container } from 'react-bootstrap'
import logoInf from '../RTL/exportLogo'
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import FormFactura from './FormFactura'
import { ButtonToolbar, IconButton, Panel, PanelGroup } from 'rsuite'

export default function CotizadorPyS() {
  let [data, setdata] = useState([])
  const [datafilter, setDatafilter] = useState([])
  const [tdata, setTdata] = useState([])
  const [open, setOpen] = useState(false)


  const dataEdit = data.at(-1)
  useEffect(() => {
    //evitar duplicados
    let hash = {}
    data = data.filter(o => hash[o.SKU] ? false : hash[o.SKU] = true)
    //editar
    if (tdata.length > 0) {
      const editData = data.map(obj => [dataEdit].find(o => o.SKU === obj.SKU) || obj);
      /* setDatafilter(editData) */
      setdata(editData)
      tdata.length = 0
    }
    else {
      setdata(data)
    }
  }, [dataEdit])
  return (
    <>
      <h4 className='text-center'>Consolidado Costeo de Productos y Soluciones </h4>
      {/* {open === true ? <FormFactura setOpen={setOpen} /> :
        <ButtonToolbar onClick={openForm} >
          <IconButton style={{ backgroundColor: "#001529", color: "white" }} icon={<ArrowDownIcon style={{ backgroundColor: "#002C57", color: "white" }} />}>Datos Factura</IconButton>
        </ButtonToolbar>

      } */}
      <PanelGroup accordion bordered className='m-3'>
        <Panel header='Datos Factura' collapsible hidden>
          <FormFactura />
        </Panel>
        <Panel header='Nuevo Costeo' defaultExpanded >
          <FormCotizador /* passchildData={setChildData} */ setdata={setdata} data={data} tdata={tdata}></FormCotizador>
        </Panel>
      </PanelGroup>
      <TableCotizadorPyS data={data} setTdata={setTdata} />
    </>
  )
}
