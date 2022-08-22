import React from 'react'
import Table from './TableData/tableData'
import axios from 'axios'
import CurrencyFormat from 'react-currency-format'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { Modal } from 'antd'
import './Comisiones.css'

var url_base = process.env.REACT_APP_DB_HOST

var rowDataA = [
  { initial: '10', final: '20', Actual: '10', Nuevo: '30' },
  { initial: '20', final: '30', Actual: '30', Nuevo: '50' },
  { initial: '30', final: '40', Actual: '50', Nuevo: '58' }
]

class Comisiones extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      salario: '',
      presupuesto: '',
      meses: 10,
      presupuestoMensual: '',
      mostrarTabla: false,
      representante: '',
      datos: [],
      activarCampos: false,
      activarButton: false,
      rol: '',
      modalVisible: true,
      modalEditar: false,
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          pinned: 'left',
          width: 50,
          field: 'checkboxBtn'
        },
        {
          headerName: '% Cumplimiento',
          children: [
            { field: 'initial', editable: true, width: 120 },
            { field: 'final', editable: true, width: 120 }
          ]
        },
        {
          headerName: '% Comision',
          children: [
            { field: 'Actual', editable: true, width: 120 },
            { field: 'Nuevo', editable: true, width: 120 }
          ]
        }
      ],
      rowData: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  cambioSalario (salario) {
    this.setState({
      salario: salario
    })
  }

  cambioPresupuesto (presupuesto) {
    this.setState({
      presupuesto: presupuesto,
      presupuestoMensual: presupuesto / 10
    })
  }

  submitForm = event => {
    var Presupuesto = this.state.presupuesto
    var Meses = this.state.meses
    event.preventDefault()
    this.setState({
      presupuestoMensual: Presupuesto / Meses,
      mostrarTabla: true
    })
  }

  componentDidMount () {
    this.setState({
      modalVisible: true
    })
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi

    if (this.state.rowData === undefined || this.state.rowData === null) {
      this.setState({
        rowData: rowDataA
      })
    }

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    sleep(1000).then(() => {
      this.gridApi.setRowData(this.state.rowData)
    })

    /* fetch(url_base + '/api/files/getRTLFile')
    .then(resp => resp.json())
    .then(data => {
      if (data.fileExists === false) {
        swal(
          'Error',
          'No existe archivo RTL, por favor cargar el archivo',
          'error'
        )
      } else {
        params.api.setRowData(data.dataStream)
        this.setState({
          trm: data.exchange_rate
        })
      }
    }) */
  }

  handleChange (event) {
    this.setState({
      salario: '',
      presupuesto: '',
      mostrarTabla: false,
      representante: event.target.value,
      activarCampos: true
    })

    var representative = event.target.value
    var request = '/api/tests/' + representative
    axios.get(url_base + request).then(res => {
      this.setState({
        datos: res.data
      })
    })
  }

  showModalEditar = () => {
    this.setState({
      modalEditar: true
    })
  }

  render () {
    const infoLogin = this.props.infoLogin
    var hidden = true
    var dataPercent = []

    const handleOk = () => {
      this.setState({
        modalVisible: false
      })
    }

    const handleOkEditar = () => {
      var request = ''

      this.gridApi.forEachNode(rowNode => {
        dataPercent.push(rowNode.data)
      })

      this.setState({
        modalEditar: false,
        rowData: dataPercent
      })

      axios.post(url_base + request, { dataPercent }).then(response => {
        console.log(response)
      })
    }

    const handleCancel = () => {
      this.setState({
        modalEditar: false
      })
    }

    if (
      infoLogin.username === 'leidy.tangarife' ||
      infoLogin.username === 'andres.mesa' ||
      infoLogin.username === 'sergio.munoz' ||
      infoLogin.username === 'sandra.ramos' ||
      infoLogin.username === 'maria.zapata' ||
      infoLogin.username === 'ingry.marquez' ||
      infoLogin.username === 'juanpablo.tejada' ||
      infoLogin.username === 'jorge.arango' ||
      infoLogin.username === 'jesus.montoya' ||
      infoLogin.username === 'carolina.posada' ||
      infoLogin.username === 'elkin.moreno'
    ) {
      hidden = false
    } else {
      hidden = true
    }

    var data = this.state.datos

    if (data.length > 0) {
      data.forEach(element => {
        this.state.salario = element.monthSalary
        this.state.presupuesto = element.pptoAnual
      })
    }

    if (this.state.salario > 0 && this.state.presupuesto > 0) {
      this.state.activarButton = true
    } else {
      this.state.activarButton = false
    }

    return (
      <>
        <div hidden={hidden}>
          <Modal
            centered='true'
            title='Mensaje Importante'
            okText='Aceptar'
            destroyOnClose={true}
            closable={false}
            visible={this.state.modalVisible}
            onOk={handleOk}
            cancelButtonProps={{ hidden: true }}
          >
            <p>
              Los porcentajes actualizados diariamente en esta plataforma son de
              seguimiento y meramente informativos, por lo cual no constituyen
              datos únicos y/o concluyentes para la realización de los pagos de
              comisiones, ya que estos están sujetos a las políticas de
              facturación, comisión y nómina de Infinivirt Technologies S.A.S.
            </p>
          </Modal>

          <div className='contenedor'>
            <button
              onClick={this.showModalEditar}
              hidden={
/*                 infoLogin.username === 'ingry.marquez' ||
                infoLogin.username === 'juanpablo.tejada' ||
                infoLogin.username === 'jacob.moritz' || */
                infoLogin.username === 'jesus.montoya' ||
                infoLogin.username === 'davison.canaveral' ||
                infoLogin.username === 'elkin.moreno'
                  ? false
                  : true
              }
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-custom-class='custom-tooltip'
              title='Editar Porcentajes'
              className='btn btn-success'
              style={{ float: 'left' }}
            >
              <i className='bi bi-percent'></i>
            </button>
            <Modal
              visible={this.state.modalEditar}
              onOk={handleOkEditar}
              onCancel={handleCancel}
              destroyOnClose={true}
              width={600}
            >
              <button
                className='btn btn-success me-3'
                onClick={() => this.gridApi.applyTransaction({ add: [{}] })}
              >
                Añadir Fila
              </button>
              <button
                className='btn btn-primary'
                onClick={() => {
                  const selectedRows = this.gridApi.getSelectedRows()
                  this.gridApi.applyTransaction({ remove: selectedRows })
                }}
              >
                Borrar Fila
              </button>
              <div className='ag-theme-balham mt-2' style={{ height: '250px' }}>
                <AgGridReact
                  rowHeight={30}
                  rowSelection='multiple'
                  headerHeight={30}
                  columnDefs={this.state.columnDefs}
                  onGridReady={this.onGridReady}
                  defaultColDef={this.state.columnDefs}
                ></AgGridReact>
              </div>

              {/*<button className='btn btn-success' id='btnCrear' onClick={() => addRow()}>Crear Fila</button>
              <div className='row'>
                <div className='col-6'>
                  <div className='row text-center'>
                    <p> % Cumplimiento</p>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row text-center'>
                    <p> % Comisiones</p>
                  </div>
                </div>
              </div>
              <div className='row text-center'>
                <div className='col-6'></div>
                <div className='col-6'>
                  <div className='row'>
                    <div className='col-6'>
                      <p>Actual</p>
                    </div>
                    <div className='col-6'>
                      <p>Nuevo</p>
                    </div>
                  </div>
                </div>
              </div>
               <div className='row mb-2'>
                <div className='col-6'>
                  <div className='row row-cols-3'>
                    <div className='col-5'>
                      <input className='col-12'></input>
                    </div>
                    <div className='col-2'> - </div>
                    <div className='col-5'>
                      <input className='col-12'></input>
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row row-cols-3'>
                    <div className='col-5'>
                      <input className='col-12'></input>
                    </div>
                    <div className='col-2'> - </div>
                    <div className='col-5'>
                      <input className='col-12'></input>
                    </div>
                  </div>
                </div>
              </div> 
              <div className='row mb-2'>
            <div className='col-6'>
              <div className='row row-cols-3'>
                <div className='col-5'>
                  <input className='col-12'></input>
                </div>
                <div className='col-2'> - </div>
                <div className='col-5'>
                  <input className='col-12'></input>
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='row row-cols-3'>
                <div className='col-5'>
                  <input className='col-12'></input>
                </div>
                <div className='col-2'> - </div>
                <div className='col-5'>
                  <input className='col-12'></input>
                </div>
              </div>
            </div>
          </div>*/}
            </Modal>
            <h3 style={{ float: 'center' }}>Reporte de Comisiones</h3>
            <div
              className='row w-100 align-items-end text-center'
              style={{ fontSize: '80%' }}
            >
              <div className='col-3'>
                <label
                  className='form-label'
                  htmlFor='selectRepresentante'
                  name='selectRepresentante'
                >
                  Representante
                </label>
                <br />
                <select
                  className='form-select form-select-sm'
                  value={this.state.representante}
                  onChange={this.handleChange}
                  onBlur={() => {
                    if (this.state.representante !== 'Daniela') {
                      this.state.rol = 'vendedor'
                    } else if (this.state.representante === 'general') {
                      this.state.rol = 'general'
                    } else {
                      this.state.rol = 'coordinador'
                    }
                  }}
                  name='selectRepresentante'
                >
                  <option hidden>
                    Seleccione
                  </option>
                  <option
                    hidden={
                      infoLogin.username === 'ingry.marquez' ||
                      infoLogin.username === 'jacob.moritz' ||
                      infoLogin.username === 'jorge.arango' ||
                      infoLogin.username === 'juanpablo.tejada' ||
                      infoLogin.username === 'jesus.montoya' ||
                      infoLogin.username === 'davison.canaveral' ||
                      infoLogin.username === 'elkin.moreno'
                        ? false
                        : true
                    }
                    value='general'
                  >
                    General
                  </option>
                  <optgroup label='Vendedores'>
                    <option
                      hidden={
                        (infoLogin.username === 'leidy.tangarife' ||
                          infoLogin.username === 'maria.zapata' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Leidy'
                    >
                      Leidy tangarife
                    </option>
                    <option
                      hidden={
                        (infoLogin.username === 'andres.mesa' ||
                          infoLogin.username === 'maria.zapata' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Andres'
                    >
                      Andres Mesa
                    </option>
                    <option
                      hidden={
                        (infoLogin.username === 'sergio.munoz' ||
                          infoLogin.username === 'maria.zapata' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Sergio'
                    >
                      Sergio Muñoz
                    </option>
                    <option
                      hidden={
                        (infoLogin.username === 'sandra.ramos' ||
                          infoLogin.username === 'maria.zapata' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Sandra'
                    >
                      Sandra Ramos
                    </option>
                    <option
                      hidden={
                        (infoLogin.username === 'carolina.posada' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Carolina'
                    >
                      Carolina Posada
                    </option>
                  </optgroup>
                  <optgroup
                    hidden={
                      infoLogin.username === 'ingry.marquez' ||
                      infoLogin.username === 'jacob.moritz' ||
                      infoLogin.username === 'jorge.arango' ||
                      infoLogin.username === 'elkin.moreno' ||
                      infoLogin.username === 'juanpablo.tejada' ||
                      infoLogin.username === 'jesus.montoya' ||
                      infoLogin.username === 'davison.canaveral' ||
                      (infoLogin.username === 'maria.zapata' &&
                        hidden === false)
                        ? false
                        : true
                    }
                    label='Coordinadores'
                  >
                    <option
                      hidden={
                        (infoLogin.username === 'maria.zapata' ||
                          infoLogin.username === 'ingry.marquez' ||
                          infoLogin.username === 'jacob.moritz' ||
                          infoLogin.username === 'elkin.moreno' ||
                          infoLogin.username === 'juanpablo.tejada' ||
                          infoLogin.username === 'jesus.montoya' ||
                          infoLogin.username === 'davison.canaveral' ||
                          infoLogin.username === 'jorge.arango') &&
                        hidden === false
                          ? false
                          : true
                      }
                      value='Daniela'
                    >
                      Daniela Zapata
                    </option>
                  </optgroup>
                </select>
              </div>
              <div className='col'>
                <label
                  className='form-label'
                  htmlFor='inputMonthSalary'
                  name='monthSalary'
                >
                  Salario Mensual
                </label>
                <CurrencyFormat
                  className='form-control form-control-sm CurrencyInput'
                  type='text'
                  id='inputMonthSalary'
                  name='monthSalary'
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={0}
                  value={this.state.salario}
                  onChange={ev => {
                    this.cambioSalario(ev.target.value)
                  }}
                  disabled={this.state.activarCampos ? false : true}
                />
              </div>
              <div className='col'>
                <label
                  className='form-label'
                  htmlFor='pptoAnual'
                  name='pptoAnual'
                >
                  Presupuesto Anual
                </label>
                <br />
                <CurrencyFormat
                  className='form-control form-control-sm CurrencyInput'
                  type='text'
                  id='inputPptoAnual'
                  name='pptoAnual'
                  value={this.state.presupuesto}
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={0}
                  onChange={ev => {
                    this.cambioPresupuesto(ev.target.value)
                  }}
                  disabled={this.state.activarCampos ? false : true}
                />
              </div>
              <div className='col-1'>
                <label className='form-label' htmlFor='months' name='months'>
                  Meses
                </label>
                <br />
                <input
                  className='form-control form-control-sm'
                  type='number'
                  id='inputMonths'
                  name='months'
                  value={this.state.meses}
                  disabled
                />
              </div>
              <div className='col-2'>
                <label
                  className='form-label'
                  htmlFor='pptoMonth'
                  name='pptoMonth'
                >
                  Presupuesto Mensual
                </label>
                <br />
                <CurrencyFormat
                  className='form-control form-control-sm CurrencyInput'
                  type='text'
                  id='inputPptoMonth'
                  name='pptoMonth'
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={0}
                  value={this.state.presupuesto / this.state.meses}
                  disabled
                />
              </div>
              <div className='col'>
                <br />
                <button
                  className='btn w-100'
                  id='calcular'
                  onClick={this.submitForm}
                  disabled={this.state.activarButton ? false : true}
                >
                  Calcular
                </button>
              </div>
            </div>

            {this.state.mostrarTabla ? (
              <Table data={this.state} infoLogin={this.props.infoLogin} />
            ) : null}
          </div>
        </div>
      </>
    )
  }
}

export default Comisiones
