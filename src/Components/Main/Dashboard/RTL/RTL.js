import React from 'react'
import axios from 'axios'
import './rtl.css'
import Select from 'react-select'
import { Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Modal } from 'antd'
import swal from 'sweetalert'
import logoInf from './exportLogo'

var url_base = process.env.REACT_APP_DB_HOST

class RTL extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      country: '',
      archivos: '',
      selectCountries: [],
      vendor: '',
      pais: '',
      percent: 0,
      tier: '',
      reCharge: false,
      money: '',
      dataCSV: [],
      file_path: '',
      trm: 0,
      destination: '',
      destinationGroup: [],
      initialBilling: 1,
      incrementalBilling: 1,
      modalVisible: false,
      valMin: 0.007,
      statusReTariff: false,
      columnDefsSuperAdmin: [
        {
          field: 'Dial Code',
          initialWidth: 100,
          minWidth: 82,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Destinationd Group',
          minWidth: 260,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'WHL $ USD',
          headerName: 'WHL USD',
          initialWidth: 140,
          minWidth: 80,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'WHL $ COP',
          headerName: 'WHL COP',
          initialWidth: 150,
          minWidth: 85,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Tier 1',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90,
          headerTooltip: '70%'
        },
        {
          field: 'Tier 2',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90,
          headerTooltip: '60%'
        },
        {
          field: 'Tier 3',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90,
          headerTooltip: '50%'
        },
        {
          field: 'Vendor',
          filter: 'agSetColumnFilter',
          initialWidth: 130,
          minWidth: 95
        },
        {
          field: 'Initial Billing',
          initialWidth: 130,
          minWidth: 89,
          filter: 'agSetColumnFilter',
          headerName: 'Initial Billing'
        },
        {
          field: 'Incremental Billing',
          initialWidth: 130,
          minWidth: 95,
          filter: 'agSetColumnFilter',
          headerName: 'Incremental Billing'
        }
      ],
      columnDefsDirector: [
        {
          field: 'Dial Code',
          initialWidth: 100,
          minWidth: 82,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Destinationd Group',
          minWidth: 260,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Tier 1',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Tier 2',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Tier 3',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Initial Billing',
          initialWidth: 130,
          minWidth: 89,
          filter: 'agSetColumnFilter',
          headerName: 'Initial Billing'
        },
        {
          field: 'Incremental Billing',
          initialWidth: 130,
          minWidth: 95,
          filter: 'agSetColumnFilter',
          headerName: 'Incremental Billing'
        }
      ],
      columnDefsRepresentatives: [
        {
          field: 'Dial Code',
          initialWidth: 100,
          minWidth: 82,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Destinationd Group',
          minWidth: 260,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Tier 1',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Initial Billing',
          initialWidth: 90,
          minWidth: 90,
          filter: 'agSetColumnFilter',
          headerName: 'Initial Billing'
        },
        {
          field: 'Incremental Billing',
          initialWidth: 130,
          minWidth: 95,
          filter: 'agSetColumnFilter',
          headerName: 'Incremental Billing'
        }
      ],
      columnDefsCoordinator: [
        {
          field: 'Dial Code',
          width: 100,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Destinationd Group',
          width: 300,
          minWidth: 260,
          filter: 'agSetColumnFilter'
        },
        {
          field: 'Tier 1',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Tier 2',
          filter: 'agSetColumnFilter',
          initialWidth: 150,
          minWidth: 90
        },
        {
          field: 'Initial Billing',
          initialWidth: 130,
          minWidth: 89,
          filter: 'agSetColumnFilter',
          headerName: 'Initial Billing'
        },
        {
          field: 'Incremental Billing',
          initialWidth: 130,
          minWidth: 95,
          filter: 'agSetColumnFilter',
          headerName: 'Incremental Billing'
        }
      ],
      defaultColDef: {
        flex: 1,
        //minWidth: 80,
        maxWidth: 380,
        sortable: true,
        resizable: true,
        menuTabs: ['filterMenuTab'],
        autoHeaderHeight: true,
        wrapHeaderText: true
      },
      excelStyles: [
        {
          id: 'header',
          interior: {
            color: '#002060',
            pattern: 'Solid'
          },
          font: {
            color: '#FFFFFF',
            fontName: 'Lato',
            bold: true
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'cell',
          font: {
            size: 10,
            fontName: 'Lato Light'
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'info',
          font: {
            fontName: 'Lato Light'
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'logo',
          alignment: {
            horizontal: 'Center',
            vertical: 'Center'
          }
        },
        {
          id: 'cliente',
          interior: {
            color: '#002060',
            pattern: 'Solid'
          },
          font: {
            color: '#FFFFFF',
            fontName: 'Lato',
            size: 11
          },
          alignment: {
            horizontal: 'Left',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'subHeader',
          interior: {
            color: '#AEAAAA',
            pattern: 'Solid'
          },
          font: {
            color: '#FFFFFF',
            fontName: 'Lato',
            size: 11
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'observaciones',
          interior: {
            color: '#AEAAAA',
            pattern: 'Solid'
          },
          font: {
            color: '#00000',
            fontName: 'Lato',
            size: 10
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        },
        {
          id: 'detalleObservacion',
          font: {
            color: '#00000',
            fontName: 'Lato',
            size: 10
          },
          alignment: {
            horizontal: 'Center',
            vertical: 'Center',
            wrapText: true
          }
        }
      ],
      defaultExcelExportParams: {
        author: 'Infinivirt',
        fileName: 'Cotizacion.xlsx',
        exportMode: 'xlsx',
        sheetName: 'Cotizacion',
        prependContent: [
          [
            {
              data: {
                type: 'String',
                value: logoInf
              },
              styleId: 'logo'
            },
            {
              data: {
                type: 'String',
                value: ''
              }
            },
            {
              data: {
                type: 'String',
                value: ''
              }
            },
            {
              data: {
                type: 'String',
                value:
                  'INFINIVIRT TECHNOLOGIES S.A.S \n' +
                  'NIT: 900.565.822-7 \n' +
                  'CRA   43A # 9 SUR - 91 Oficina 1107 Torre Sur \n' +
                  'Medellín - Colombia \n' +
                  'Tel: +57 4 2040664 \n' +
                  'www.infinivirt.com \n'
              },
              styleId: 'info',
              mergeAcross: 1
            }
          ],
          [],
          [],
          [
            {
              data: {
                type: 'String',
                value: 'Informacion del Cliente'
              },
              styleId: 'cliente',
              mergeAcross: 4
            }
          ],
          [
            {
              data: {
                type: 'String',
                value: 'NIT/ID'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Company Name'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Contact Name'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Country'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Phone Contact'
              },
              styleId: 'subHeader'
            }
          ],
          [],
          [
            {
              data: {
                type: 'String',
                value: 'Estimate date'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Expiration date'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Email'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Customer Type'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Quoted currency'
              },
              styleId: 'subHeader'
            }
          ],
          [],
          [],
          [
            {
              data: {
                type: 'String',
                value: 'Datos Comerciales'
              },
              styleId: 'cliente',
              mergeAcross: 4
            }
          ],
          [
            {
              data: {
                type: 'String',
                value: 'Sales Representative'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Phone Contact'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Email'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'N° Opportunity'
              },
              styleId: 'subHeader'
            },
            {
              data: {
                type: 'String',
                value: 'Quoted Status'
              },
              styleId: 'subHeader'
            }
          ],
          [],
          []
        ],
        appendContent: [
          [
            {
              data: {
                type: 'string',
                value: 'Observaciones: '
              },
              styleId: 'observaciones',
              mergeAcross: 3
            }
          ],
          [
            {
              data: {
                type: 'string',
                value: ''
              },
              styleId: 'detalleObservacion',
              mergeAcross: 3
            }
          ],
          []
        ],
        rowHeight: params => (params.rowIndex === 1 ? 201 : 29),
        addImageToCell: (rowIndex, col, value) => {
          if (rowIndex !== 1 || col.getColId() !== 'Dial Code') {
            return
          }
          return {
            image: {
              id: 'logo',
              base64: value,
              imageType: 'png',
              width: 250,
              height: 70,
              position: {
                colSpan: 2,
                offsetY: 20,
                offsetX: 20
              }
            }
          }
        }
      },
      sideBar: {
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel'
          }
        ]
      },
      rowData: null
    }
  }

  async getCountries () {
    const res = await axios.get(url_base + '/api/files/getCountries')
    const data = res.data

    if (data.fileExists !== false) {
      const countries = data.map(element => ({
        value: element,
        label: element
      }))
      this.setState({
        selectCountries: countries
      })
    }
  }

  async getDestinationGroups () {
    const res = await axios.get(url_base + '/api/files/getDestinationGroups')
    const data = res.data

    if (data.fileExists !== false) {
      const destinationsGroup = data.map(element => ({
        value: element,
        label: element
      }))
      this.setState({
        destinationGroup: destinationsGroup
      })
    }
  }

  componentDidMount () {
    this.getCountries()
    this.getDestinationGroups()
    axios.get(url_base + '/api/files/getRTLFile').then(res => {
      this.setState({
        trm: res.data.exchange_rate
      })
      var a = res.data.dataStream[0]['Tier 1']
      var aFormat = a.replace(/[$]/g, '')
      if (parseFloat(aFormat) > 3000) {
        this.setState(() => {
          return { money: 'COP' }
        })
      } else {
        this.setState(() => {
          return { money: 'USD' }
        })
      }
    })
  }

  componentWillUnmount () {
    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    var request = '/api/files/updateCurrency'
    var currency = 'USD'
    var trm = this.state.trm
    var file = 'original'
    var username = this.props.infoLogin.username

    axios
      .post(url_base + request, { currency, trm, file, username })
      .then(data => {
        if (data.fileExists === false) {
          swal(
            'Error',
            'No existe archivo RTL, por favor cargar el archivo',
            'error'
          )
        } else {
          this.gridApi.setRowData(data.data.csv_updated_currency)
        }
      })

    sleep(3000).then(() => {
      this.gridApi.refreshCells()
    })
    this.getCountries()
    this.getDestinationGroups()
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi

    fetch(url_base + '/api/files/getRTLFile')
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
      })
    this.gridApi.sizeColumnsToFit()
  }

  updateTable = () => {
    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    var request = '/api/files/updateCurrency'
    var currency = this.state.money
    var trm = this.state.trm
    var file = 'original'
    var username = this.props.infoLogin.username

    if (currency === '') {
      currency = 'USD'
    }

    axios
      .post(url_base + request, { currency, trm, file, username })
      .then(data => {
        if (data.fileExists === false) {
          swal(
            'Error',
            'No existe archivo RTL, por favor cargar el archivo',
            'error'
          )
        } else {
          this.gridApi.setRowData(data.data.csv_updated_currency)
        }
      })

    sleep(3000).then(() => {
      swal('', 'RTL actualizada correctamente', 'success')
      this.gridApi.refreshCells()
    })
    this.getCountries()
    this.getDestinationGroups()
  }

  onBtnExport = () => {
    var filePath = this.state.file_path
    var request = '/api/files/deleteFile'
    this.gridApi.exportDataAsExcel()
    axios.post(url_base + request, filePath).then(data => {})
  }

  onBtnUpdate = () => {
    document.querySelector('#csvResult').value = this.gridApi.getDataAsCsv()
  }

  handleChangeInput (event) {
    this.setState({
      country: event.target.value
    })
  }

  cambioPais (country) {
    this.setState({
      country: country
    })
  }

  uploadFiles = e => {
    this.setState({
      archivos: e
    })
  }

  handleChangeCountry (e) {
    this.setState({
      pais: e
    })
  }

  handleChangeVendors (e) {
    this.setState({
      vendor: e.value
    })
  }

  handleChangeDesGroup (e) {
    this.setState({
      destination: e
    })
  }

  handleChangeIniBilling (e) {
    this.setState({
      initialBilling: e.value
    })
  }

  handleChangeIncrBilling (e) {
    this.setState({
      incrementalBilling: e.value
    })
  }

  onChangeTRM (e) {
    this.setState({
      trm: e
    })
  }

  onChangePercent (e) {
    this.setState({
      percent: e
    })
  }

  onChangeValueMin (e) {
    this.setState({
      valMin: e
    })
  }

  onChangeTier (e) {
    this.setState({
      tier: e.value
    })
  }

  onChangeMoney (e) {
    this.setState({
      money: e.value
    })

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    var request = '/api/files/updateCurrency'
    var currency = e.value
    var trm = this.state.trm
    var file = 'original'
    var username = this.props.infoLogin.username

    if (currency === '') {
      currency = 'USD'
    }

    axios
      .post(url_base + request, { currency, trm, file, username })
      .then(data => {
        if (data.fileExists === false) {
          swal(
            'Error',
            'No existe archivo RTL, por favor cargar el archivo',
            'error'
          )
        } else {
          this.gridApi.setRowData(data.data.csv_updated_currency)
        }
      })

    sleep(2000).then(() => {
      this.gridApi.refreshCells()
    })
  }

  onReChargue () {
    this.setState({
      reCharge: true
    })
  }

  sendForChangePercent () {
    var tier = this.state.tier
    var pais = this.state.pais
    var percent = this.state.percent
    var min = this.state.valMin
    var currency = this.state.money
    var filePath = this.state.file_path
    var trm = this.state.trm
    var username = this.props.infoLogin.username
    var vendor = this.state.vendor

    if (currency === '') {
      currency = 'USD'
    }

    swal('Retarificando, por favor espere')

    var request = '/api/files/reRating'

    axios
      .post(url_base + request, {
        tier,
        pais,
        percent,
        min,
        currency,
        filePath,
        trm,
        username,
        vendor
      })
      .then(res => {
        swal('Retarificacion realizada con exito')
        this.setState({
          dataCSV: res.data.csv_data,
          file_path: res.data.file_path
        })
      })
  }

  sendForChangeBilling () {
    var destinationGroups = this.state.destination
    var initialBilling = this.state.initialBilling
    var incrementalBilling = this.state.incrementalBilling
    var filePath = this.state.file_path
    var username = this.props.infoLogin.username
    var vendor = this.state.vendor

    swal('Editando, por favor espere')

    var request = '/api/files/updateIncrement'

    axios
      .post(url_base + request, {
        destinationGroups,
        initialBilling,
        incrementalBilling,
        filePath,
        username,
        vendor
      })
      .then(res => {
        if (res.data.success === true) {
          swal('Se ha actualizado correctamente')
        }
        this.setState({
          dataCSV: res.data.csv_data,
          file_path: res.data.file_path
        })
      })
  }

  showModal () {
    this.setState({
      modalVisible: true
    })
  }

  handleOk () {
    this.setState({
      modalVisible: false
    })
  }

  handleCancel () {
    this.setState({
      modalVisible: false
    })
  }

  render () {
    var infoLogin = this.props.infoLogin
    var currency = this.state.money

    if (this.state.dataCSV.length > 0) {
      this.gridApi.setRowData(this.state.dataCSV)
      this.gridApi.refreshCells()
    }

    var showColumns = ''

    if (
      infoLogin.username === 'ingry.marquez' ||
      infoLogin.username === 'juanpablo.tejada' ||
      infoLogin.username === 'jacob.moritz' ||
      infoLogin.username === 'jesus.montoya' ||
      infoLogin.username === 'elkin.moreno'
    ) {
      showColumns = this.state.columnDefsSuperAdmin
    } else if (infoLogin.username === 'jorge.arango') {
      showColumns = this.state.columnDefsDirector
    } else if (infoLogin.username === 'maria.zapata') {
      showColumns = this.state.columnDefsCoordinator
    } else {
      showColumns = this.state.columnDefsRepresentatives
    }

    var username = this.props.infoLogin.username

    const props = {
      name: 'file',
      action: url_base + '/api/files/upload',
      headers: {
        authorization: 'authorization-text'
      },
      body: { username },
      onChange (info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} Cargado Correctamente`)
        } else if (info.file.status === 'error') {
          message.error(
            `${info.file.name} Fallo en el cargue, por favor notificar al area de desarrollo`
          )
        }
      }
    }

    const tiers = [
      { value: 'Tier 1', label: 'Tier 1' },
      { value: 'Tier 2', label: 'Tier 2' },
      { value: 'Tier 3', label: 'Tier 3' }
    ]

    const moneyChange = [
      { value: 'USD', label: 'USD' },
      { value: 'COP', label: 'COP' }
    ]

    const billing = [
      { value: 1, label: 1 },
      { value: 60, label: 60 }
    ]

    const vendors = [
      { value: 'Default', label: 'Default' },
      { value: 'Especial', label: 'Especial' }
    ]

    if (
      infoLogin.username === 'ingry.marquez' ||
      infoLogin.username === 'jacob.moritz' ||
      infoLogin.username === 'juanpablo.tejada' ||
      infoLogin.username === 'jorge.arango' ||
      /*   infoLogin.username === 'maria.zapata' ||
      infoLogin.username === 'leidy.tangarife' ||
      infoLogin.username === 'andres.mesa' ||
      infoLogin.username === 'sergio.munoz' ||
      infoLogin.username === 'sandra.ramos' ||
       infoLogin.username === 'carolina.posada' || */
      infoLogin.username === 'jesus.montoya' ||
      infoLogin.username === 'elkin.moreno'
    ) {
      return (
        <>
          <h3 id='title'>Cotizaciones</h3>
          <div className='contenedor row mb-3'>
            <div
              className='col-2'
              hidden={
                infoLogin.username === 'ingry.marquez' ||
                infoLogin.username === 'juanpablo.tejada' ||
                infoLogin.username === 'jacob.moritz' ||
                infoLogin.username === 'jesus.montoya' ||
                infoLogin.username === 'elkin.moreno'
                  ? false
                  : true
              }
            >
              <Button
                className='btn'
                id='btnEditar'
                onClick={this.showModal.bind(this)}
              >
                Editar
              </Button>
            </div>
            <Modal
              width={1000}
              centered
              visible={this.state.modalVisible}
              closable={true}
              onOk={this.handleOk.bind(this)}
              destroyOnClose={true}
              onCancel={this.handleCancel.bind(this)}
              okText='Guardar'
              okButtonProps={{
                style: {
                  backgroundColor: '#09294f',
                  color: 'white',
                  borderRadius: '10px'
                }
              }}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <div>
                <h5>Retarificacion</h5>
              </div>
              <div className='row mb-2'>
                <div className='col-5'>
                  <label htmlFor='selectCountries'>Pais</label>
                  <Select
                    id='selectCountries'
                    name='selectCountries'
                    defaultValue={this.state.pais}
                    closeMenuOnSelect={false}
                    onChange={this.handleChangeCountry.bind(this)}
                    options={this.state.selectCountries}
                    placeholder='Seleccione'
                    isMulti
                  />
                </div>
                <div className='col-2'>
                  <label htmlFor='selectTier'>Tier</label>
                  <Select
                    defaultValue={this.state.tier}
                    id='selectTier'
                    name='selectTier'
                    options={tiers}
                    onChange={this.onChangeTier.bind(this)}
                    placeholder='Seleccione'
                  />
                </div>
                <div className='col-2'>
                  <label htmlFor='inputPercent'>Porcentaje</label>
                  <input
                    className='form-control'
                    id='inputPercent'
                    name='inputPercent'
                    type='number'
                    max='100'
                    min='0'
                    onChange={ev => {
                      this.onChangePercent(ev.target.value)
                    }}
                    value={this.state.percent}
                  ></input>
                </div>
                <div className='col-2'>
                  <button
                    id='btnRetarifar'
                    className='btn btn-success mt-4'
                    hidden={
                      this.state.pais.length > 0 || this.state.valMin !== 0.007
                        ? false
                        : true
                    }
                    onClick={() =>
                      this.sendForChangePercent(
                        this.state.pais,
                        this.state.tier,
                        this.state.percent,
                        this.state.valMin,
                        this.state.vendor
                      )
                    }
                  >
                    Retarifar
                  </button>
                </div>
              </div>
              <div className='row'>
                <div className='col-2'>
                  <label htmlFor='inputMin'>Valor Minimo</label>
                  <input
                    className='form-control'
                    id='inputMin'
                    name='inputMin'
                    type='number'
                    max='1'
                    min='0'
                    step='0.001'
                    onChange={ev => {
                      this.onChangeValueMin(ev.target.value)
                    }}
                    value={this.state.valMin}
                  ></input>
                </div>
                <div className='col-3'>
                  <label htmlFor='selectVendors'>Vendor</label>
                  <Select
                    id='selectVendors'
                    name='selectVendors'
                    defaultValue={this.state.vendor}
                    onChange={this.handleChangeVendors.bind(this)}
                    options={vendors}
                    placeholder='Seleccione'
                  />
                </div>
              </div>
              <div className='mt-4'>
                <h5>Billing</h5>
              </div>
              <div className='row'>
                <div className='col-5'>
                  <label htmlFor='selectDesGroup'>Destination Group</label>
                  <Select
                    defaultValue={this.state.destination}
                    id='selectDesGroup'
                    name='selectDesGroup'
                    closeMenuOnSelect={false}
                    onChange={this.handleChangeDesGroup.bind(this)}
                    options={this.state.destinationGroup}
                    placeholder='Seleccione'
                    isMulti
                  />
                </div>
                <div className='col-2'>
                  <label htmlFor='selectDesGroup'>Initial Billing</label>
                  <Select
                    defaultValue={this.state.initialBilling}
                    id='selectIniBilling'
                    name='selectIniBilling'
                    onChange={this.handleChangeIniBilling.bind(this)}
                    options={billing}
                    placeholder='Seleccione'
                  />
                </div>
                <div className='col-2'>
                  <label htmlFor='selectDesGroup'>Incremental Billing</label>
                  <Select
                    defaultValue={this.state.incrementalBilling}
                    id='selectDesGroup'
                    name='selectDesGroup'
                    onChange={this.handleChangeIncrBilling.bind(this)}
                    options={billing}
                    placeholder='Seleccione'
                  />
                </div>
                <div className='col-2'>
                  <button
                    id='btnRetarifar'
                    className='btn btn-primary mt-4'
                    hidden={this.state.destination.length > 0 ? false : true}
                    onClick={() =>
                      this.sendForChangeBilling(
                        this.state.destination,
                        this.state.initialBilling,
                        this.state.incrementalBilling,
                        this.state.vendor
                      )
                    }
                  >
                    Editar Billing
                  </button>
                </div>
              </div>
            </Modal>
            <div className='col-2'>
              <Select
                id='selectMoney'
                name='selectMoney'
                placeholder='Seleccione Moneda'
                options={moneyChange}
                onChange={this.onChangeMoney.bind(this)}
              />
            </div>
            <div
              className='col-2'
              hidden={
                infoLogin.username === 'ingry.marquez' ||
                infoLogin.username === 'juanpablo.tejada' ||
                infoLogin.username === 'jacob.moritz' ||
                infoLogin.username === 'jesus.montoya' ||
                infoLogin.username === 'elkin.moreno'
                  ? false
                  : true
              }
            >
              <label>TRM</label>
              <input
                className='form-control border-0'
                id='inputtrm'
                name='inputtrm'
                type='number'
                aria-label='Sizing example input'
                aria-describedby='inputGroup-sizing-sm'
                min='0'
                onChange={ev => {
                  this.onChangeTRM(ev.target.value)
                }}
                value={this.state.trm}
              ></input>
            </div>
            <div
              className='col-2 RTL'
              hidden={
                infoLogin.username === 'ingry.marquez' ||
                infoLogin.username === 'juanpablo.tejada' ||
                infoLogin.username === 'jacob.moritz' ||
                infoLogin.username === 'jesus.montoya' ||
                infoLogin.username === 'elkin.moreno'
                  ? false
                  : true
              }
            >
              <Upload
                accept='.csv'
                {...props}
                maxCount={1}
                showUploadList={false}
              >
                <Button id='btnChargueRTL' icon={<UploadOutlined />}>
                  Cargar RTL
                </Button>
              </Upload>
            </div>
            <div className='col-2'>
              <Button
                className='btn'
                id='btnCSV'
                onClick={() => this.onBtnExport()}
              >
                Descargar
              </Button>
            </div>
            <div className='col-2'>
              <Button
                hidden={
                  infoLogin.username === 'ingry.marquez' ||
                  infoLogin.username === 'juanpablo.tejada' ||
                  infoLogin.username === 'jacob.moritz' ||
                  infoLogin.username === 'jesus.montoya' ||
                  infoLogin.username === 'elkin.moreno'
                    ? false
                    : true
                }
                className='btn'
                id='btnRecharge'
                onClick={() => this.updateTable()}
              >
                Recargar
              </Button>
            </div>
          </div>
          <div
            style={{
              height: '80%',
              width: '100%'
            }}
            className='ag-theme-alpine w-100 float-none'
          >
            <AgGridReact
              pagination={true}
              enableRangeSelection={true}
              copyHeadersToClipboard={true}
              excelStyles={this.state.excelStyles}
              columnDefs={showColumns}
              defaultColDef={this.state.defaultColDef}
              onGridReady={this.onGridReady}
              defaultExcelExportParams={this.state.defaultExcelExportParams}
            ></AgGridReact>
          </div>
        </>
      )
    } else {
      return (
        <p>
          No tienes acceso a esta Seccion, de ser necesario, por favor solicita
          acceso al area de desarrollo.
        </p>
      )
    }
  }
}

export default RTL
