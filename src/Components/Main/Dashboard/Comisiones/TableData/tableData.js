import React from 'react'
import TableRow from './tableRow/tableRow'
import axios from 'axios'
import { CSVLink } from 'react-csv'

var url_base = process.env.REACT_APP_DB_HOST

class tableData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      datos: [],
      method: 'consult',
      firstSale: ''
    }
    this.updateItems = this.updateItems.bind(this)
  }

  MonthPresupuesto = this.props.data.presupuestoMensual

  consultFila (data) {
    return {
      month: data.months,
      pptoVenta: data.pptoVenta,
      VentaEjecutada: data.VentaEjecutada,
      porcCumplimiento: data.Cumplimiento,
      ClienteActual: data.VentaActual,
      Porcentaje: data.PorcentajeVentaActual,
      ClienteNuevo: data.VentaNueva,
      PorcentajeNuevo: data.PorcentaVentaNuevo,
      PresupuestoAcumulado: data.PresupuestoAcumulado,
      ComisionAct: data.ComisionAct,
      ComisionNue: data.ComisionNue,
      salarioTotal: data.salarioTotal
    }
  }

  updateItems (item, index) {
    const items = this.state.items
    items[index] = item
    this.setState({
      items: items
    })
  }

  SetFirstSale (firstSale) {
    this.setState({
      firstSale: firstSale
    })
  }

  // METODO DE CONSUMO API PARA CONSULTAR INFORMACION

  consultData () {
    var representative = this.props.data.representante
    var request = '/api/tests/' + representative
    axios.get(url_base + request).then(res => {
      res.data.forEach(element => {
        if (element.VentaEjecutada === null) {
          element.VentaEjecutada = 0
        }
        if (element.VentaActual === null) {
          element.VentaActual = 0
        }
      })
      this.setState({
        datos: res.data
      })
    })
  }

  componentDidMount () {
    this.consultData()
  }

  render () {
    var monthPpto = this.props.data.presupuestoMensual
    var monthSalary = this.props.data.salario
    var representative = this.props.data.representante
    var pptoAnual = this.props.data.presupuesto
    var rol = this.props.data.rol
    var data = this.state.datos
    var infoLogin = this.props.infoLogin

    if (representative === 'general') {
      rol = 'general'
    }

    if (
      this.state.method === 'consult' &&
      this.state.items.length === 0 &&
      data.length > 0
    ) {
      data.forEach(element => {
        this.state.items.push(this.consultFila(element))
      })
    }

    let itemAnterior = null

    const body = this.state.items.map((item, index) => {
      if (index > 1) {
        itemAnterior = this.state.items[index - 1]
      }

      return (
        <>
          <TableRow
            item={item}
            itemAnterior={itemAnterior}
            itemIndex={index}
            key={index}
            salarioMensual={monthSalary}
            updateItems={this.updateItems}
            representative={representative}
            pptoAnual={pptoAnual}
            pptoMensual={monthPpto}
            rol={rol}
            infoLogin={infoLogin}
          />
        </>
      )
    })

    const headerStyle = { backgroundColor: '#09294F', color: 'White' }
    const tableStyle = {
      marginTop: '0.5%',
      fontSize: '80%',
      whiteSpace: 'nowrap',
      overflowX: 'auto'
    }
    const auxHeadStyle = { backgroundColor: '#f0f2f5', lineHeight: '100%' }
    const auxStyle = {
      backgroundColor: '#808080',
      borderLeft: '2px solid white'
    }

    return (
      <>
        <div style={tableStyle} className='table-responsive'>
          <table id='table' className='table table-hover table-sm'>
            <thead style={headerStyle}>
              <tr key={1} style={auxHeadStyle}>
                <td></td>
                <td></td>
                <td> </td>
                <td> </td>
                <td style={auxStyle} colSpan={2}>
                  Venta Actual
                </td>
                <td style={auxStyle} colSpan={2}>
                  Venta Nueva
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr key={2}>
                <td>Mes</td>
                <td>PPTO Ventas</td>
                <td>ㅤㅤㅤVENTASㅤㅤㅤ</td>
                <td>% Cumplimiento</td>
                <td>Fact. Acumulada</td>
                <td>%</td>
                <td>Fact. Crecimiento</td>
                <td>%</td>
                <td>PPTO Acumulado</td>
                <td>
                  Comisión <br /> Acumulada
                </td>
                <td>
                  Comisión <br /> Crecimiento
                </td>
                <td>
                  Básico + <br /> Comisión
                </td>
              </tr>
            </thead>
            <tbody>{body}</tbody>
          </table>
          <CSVLink
            className='btn btn-success'
            filename={'Comisiones ' + representative + '.csv'}
            style={{ fontSize: '12pt', float: 'right' }}
            data={this.state.items}
          >
            Descargar Excel
          </CSVLink>
        </div>
      </>
    )
  }
}

export default tableData
