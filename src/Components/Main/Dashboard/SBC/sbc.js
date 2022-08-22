import React from 'react'
import LiquidFillGauge from 'react-liquid-gauge'
import axios from 'axios'
import Select from 'react-select'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { Checkbox, Row, Col } from 'antd'
import './sbc.css'
import { Modal, Button } from 'antd'

var url_base = process.env.REACT_APP_DB_HOST
var checkedValueSBC = ''
var checkedValueMedia = ''
var checkedValueSystem = ''
var checkedValueNetwork = ''

export default class SBC extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      datosDPBXMain: [],
      datosDPBXSystem: [],
      datosDPBXMedia: [],
      datosConsult: [],
      datosEDMain: [],
      datosEDSystem: [],
      datosEDMedia: [],
      datosEDNetwork: [],
      template: '',
      selectedIndex: 0,
      selectedIndexSub: 0,
      modalVisible: false,
      modalTemplate: false,
      nameTemplate: '',
      checked: '',
      forAllUsers: false,
      templates: []
    }
  }

  showModal () {
    this.setState({
      modalVisible: true
    })
  }

  showModalTemplate () {
    this.setState({
      modalTemplate: true
    })
  }

  handleOk () {
    this.setState({
      modalVisible: false
    })
    this.consultAPI()

    this.interval2 = setInterval(() => {
      this.consultAPI()
    }, 2000)
  }

  consultAPI () {
    var request = '/api/sbc/kpi/sendChecks'
    if (
      checkedValueSBC.length > 0 ||
      checkedValueMedia.length > 0 ||
      checkedValueSystem.length > 0 ||
      checkedValueNetwork.length > 0
    ) {
      axios
        .put(url_base + request, {
          checkedValueSBC,
          checkedValueMedia,
          checkedValueSystem,
          checkedValueNetwork
        })
        .then(res => {
          this.setState({
            datosConsult: res.data
          })
        })
    }
  }

  handleCancel () {
    this.setState({
      modalVisible: false
    })
  }

  // CLARO DPBX SBC //

  consultDataDPBXSBC = async () => {
    var request = '/api/sbc/kpi/claroDPBX/SBC'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosDPBXMain: res.data
      })
    })
  }

  consultDataDPBXMedia = async () => {
    var request = '/api/sbc/kpi/claroDPBX/Media'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosDPBXMedia: res.data
      })
    })
  }

  consultDataDPBXSystem = async () => {
    var request = '/api/sbc/kpi/claroDPBX/System'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosDPBXSystem: res.data
      })
    })
  }

  // CLARO ED //

  consultDataEDSBC = async () => {
    var request = '/api/sbc/kpi/claroED/SBC'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosEDMain: res.data
      })
    })
  }

  consultDataEDMedia = async () => {
    var request = '/api/sbc/kpi/claroED/Media'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosEDMedia: res.data
      })
    })
  }

  consultDataEDSystem = async () => {
    var request = '/api/sbc/kpi/claroED/System'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosEDSystem: res.data
      })
    })
  }

  consultDataEDNetwork = async () => {
    var request = '/api/sbc/kpi/claroED/Network'
    await axios.get(url_base + request).then(res => {
      this.setState({
        datosEDNetwork: res.data
      })
    })
  }

  componentDidMount () {
    this.consultDataDPBXSBC()
    this.consultDataDPBXMedia()
    this.consultDataDPBXSystem()
    this.consultDataEDNetwork()
    this.consultDataEDSBC()
    this.consultDataEDMedia()
    this.consultDataEDSystem()
    this.consultNameTemplates()
  }

  consultNameTemplates () {
    var username = this.props.infoLogin.username
    var request = '/api/sbc/kpi/getTemplateListSBC'
    axios
      .post(url_base + request, {
        username
      })
      .then(res => {
        this.setState({
          templates: res.data
        })
      })
  }

  consultDataTemplates () {
    var request = '/api/sbc/kpi/getTemplateSBC'
    var nameTemplate = this.state.template
    axios
      .post(url_base + request, {
        nameTemplate
      })
      .then(res => {
        checkedValueSBC = res.data
        checkedValueMedia = res.data
        checkedValueNetwork = res.data
        checkedValueSystem = res.data
      })
  }

  deleteTemplates () {
    var request = '/api/sbc/kpi/deleteTemplateSBC'
    var nameTemplate = this.state.template
    axios
      .post(url_base + request, {
        nameTemplate
      })
      .then(res => {
        console.log(res)
      })
  }

  componentWillUnmount () {
    clearInterval(this.interval2)
  }

  onChangeSBC (checkedValuesSBC) {
    checkedValueSBC = checkedValuesSBC
  }

  onChangeMedia (checkedValuesMedia) {
    checkedValueMedia = checkedValuesMedia
  }

  onChangeSystem (checkedValuesSystem) {
    checkedValueSystem = checkedValuesSystem
  }

  onChangeNetwork (checkedValuesNetwork) {
    checkedValueNetwork = checkedValuesNetwork
  }

  onChangeTemplate (e) {
    this.setState({
      template: e.value
    })
  }

  allowAllUsers (e) {
    this.setState({
      allowAllUsers: e.value
    })
  }

  handleOkTemplate () {
    var dataChecked = []
    var request = '/api/sbc/kpi/saveTemplateSBC'
    var nameTemplate = this.state.nameTemplate
    var allowAllUsers = this.state.forAllUsers
    var username = this.props.infoLogin.username

    this.setState({
      modalTemplate: false
    })

    dataChecked.push(checkedValueSBC)
    dataChecked.push(checkedValueMedia)
    dataChecked.push(checkedValueSystem)
    dataChecked.push(checkedValueNetwork)

    // Enviar datos template

    axios
      .post(url_base + request, {
        username,
        allowAllUsers,
        nameTemplate,
        dataChecked
      })
      .then(res => {
        console.log(res)
      })
  }

  handleCancelTemplate () {
    this.setState({
      modalTemplate: false
    })
  }

  onChangeNameTemplate (e) {
    this.setState({
      nameTemplate: e
    })
  }

  render () {
    // DPBX SBC
    var titlesDPBXSBC = []
    var objectsDataDPBX = this.state.datosDPBXMain[0]
    if (objectsDataDPBX !== undefined) {
      objectsDataDPBX.forEach(element => {
        titlesDPBXSBC.push(element.id)
      })
    }

    // DPBX MEDIA
    var titlesDPBXMedia = []
    var objectsDataDPBXMedia = this.state.datosDPBXMedia[0]
    if (objectsDataDPBXMedia !== undefined) {
      objectsDataDPBXMedia.forEach(element => {
        titlesDPBXMedia.push(element.id)
      })
    }

    // DPBX SYSTEM
    var titlesDPBXSystem = []
    var objectsDataDPBXSystem = this.state.datosDPBXSystem
    if (objectsDataDPBXSystem !== undefined) {
      objectsDataDPBXSystem.forEach(element => {
        titlesDPBXSystem.push(element.id)
      })
    }

    var titlesEDNetwork = []
    var objectsDataEDNetwork = this.state.datosEDNetwork
    if (objectsDataEDNetwork !== undefined) {
      objectsDataEDNetwork.forEach(element => {
        titlesEDNetwork.push(element.id)
      })
    }

    const gaugesSBCDPBX = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueSBC.length > 0) {
        if (item[0] === 'sbcDPBX') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.7}
                  percent={id === 'answerSeizureRatio' ? '%' : ''}
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesMediaDPBX = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueMedia.length > 0) {
        if (item[0] === 'mediaDPBX') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='media'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.55}
                  percent=''
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesSystemDPBX = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueSystem.length > 0) {
        if (item[0] === 'systemDPBX') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.7}
                  percent=''
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesSBCED = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueSBC.length > 0) {
        if (item[0] === 'sbcED') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.7}
                  percent={id === 'answerSeizureRatio' ? '%' : ''}
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesMediaED = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueMedia.length > 0) {
        if (item[0] === 'mediaED') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.55}
                  percent=''
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesSystemED = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueSystem.length > 0) {
        if (item[0] === 'systemED') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.7}
                  percent=''
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    const gaugesNetworkED = this.state.datosConsult.map(item => {
      var id = item[1]
      var value = item[2]
      if (checkedValueNetwork.length > 0) {
        if (item[0] === 'networkED') {
          return (
            <>
              <div style={{ width: '20%', textAlign: 'center' }}>
                <LiquidFillGauge
                  id='activeCalls'
                  style={{ margin: '0 auto' }}
                  value={value}
                  textSize={0.6}
                  percent=''
                  width={100}
                  height={100}
                  gradient
                ></LiquidFillGauge>
                <p style={{ fontSize: '8pt' }}>{id}</p>
              </div>
            </>
          )
        }
      }
      return ''
    })

    /*     const templates = [
      { value: 'principal', label: 'Plantilla Inicial' },
      { value: 'sbc', label: 'SBC' },
      { value: 'media', label: 'Media' }
    ] */

    // Styles Interpolate Liquid Gauge

    return (
      <>
        <div className='container'>
          <div className='row text-center'>
            <h3>Monitor SBC</h3>
          </div>
          <Button
            className='btn mb-3 w-25'
            id='btnMetricas'
            onClick={this.showModal.bind(this)}
          >
            Añadir Metricas
          </Button>
          <Modal
            visible={this.state.modalVisible}
            width={1000}
            id='principalModal'
            style={{ height: '80%' }}
            centered
            className='modalMetricas'
            destroyOnClose={true}
            title='Visualizacion de Metricas SBC'
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            okText='Guardar'
            cancelText='Cerrar'
          >
            <div className='row'>
              <Select
                className='col-4'
                id='selectTemplate'
                name='selectTemplate'
                options={this.state.templates}
                onChange={this.onChangeTemplate.bind(this)}
                placeholder='Seleccione'
              />

              <Button
                className='col-2 ms-1'
                id='btnTemplate'
                onClick={this.consultDataTemplates.bind(this)}
              >
                Cargar
              </Button>
              <Button
                onClick={() => {
                  this.setState({ modalTemplate: true })
                }}
                className='col-2 ms-2'
                id='btnNuevo'
              >
                Nuevo
              </Button>
              <Modal
                width={500}
                centered
                className='newTemplate'
                title='Nuevo Template'
                visible={this.state.modalTemplate}
                onOk={this.handleOkTemplate.bind(this)}
                onCancel={this.handleCancelTemplate.bind(this)}
                okText='Guardar'
                cancelText='Cerrar'
              >
                <div className='col-8'>
                  <label htmlFor='inputNameTemplate' className='mb-1'>
                    Nombre
                  </label>
                  <input
                    className='form-control'
                    id='inputNameTemplate'
                    name='inputNameTemplate'
                    type='text'
                    onChange={ev => {
                      this.onChangeNameTemplate(ev.target.value)
                    }}
                    value={this.state.nameTemplate}
                  ></input>
                </div>
                <div className='col-9'>
                  <div className='form-check mt-2'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value={this.state.forAllUsers}
                      id='flexCheckDefault'
                      onChange={() => {
                        this.setState({ forAllUsers: !this.state.forAllUsers })
                      }}
                    />
                    <label
                      className='form-check-label'
                      htmlFor='flexCheckDefault'
                    >
                      Permitir acceso al template a todos los usuarios?
                    </label>
                  </div>
                </div>
              </Modal>
              <Button
                className='col-2 ms-1'
                id='btnTemplate'
                onClick={this.deleteTemplates.bind(this)}
              >
                Eliminar
              </Button>
            </div>
            <Checkbox.Group
              defaultValue={checkedValueSBC}
              style={{ width: '100%' }}
              onChange={this.onChangeSBC}
            >
              <h4 className='mt-2'>SBC</h4>
              <Row>
                {titlesDPBXSBC.map(item => (
                  <>
                    <Col span={8}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  </>
                ))}
              </Row>
            </Checkbox.Group>

            <Checkbox.Group
              defaultValue={checkedValueMedia}
              style={{ width: '100%' }}
              onChange={this.onChangeMedia}
            >
              <h4 className='mt-3'>Media</h4>
              <Row>
                {titlesDPBXMedia.map(item => (
                  <>
                    <Col span={8}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  </>
                ))}
              </Row>
            </Checkbox.Group>

            <Checkbox.Group
              defaultValue={checkedValueSystem}
              style={{ width: '100%' }}
              onChange={this.onChangeSystem}
            >
              <h4 className='mt-3'>System</h4>
              <Row>
                {titlesDPBXSystem.map(item => (
                  <>
                    <Col span={8}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  </>
                ))}
              </Row>
            </Checkbox.Group>

            <Checkbox.Group
              defaultValue={checkedValueNetwork}
              style={{ width: '100%' }}
              onChange={this.onChangeNetwork}
            >
              <h4 className='mt-3'>Network</h4>
              <Row>
                {titlesEDNetwork.map(item => (
                  <>
                    <Col span={8}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  </>
                ))}
              </Row>
            </Checkbox.Group>
          </Modal>
          <Tabs
            selectedIndex={this.state.selectedIndex}
            onSelect={selectedIndex => this.setState({ selectedIndex })}
            id='tabs'
          >
            <TabList>
              <Tab>Claro DPBX</Tab>
              <Tab>Claro ED</Tab>
            </TabList>
            <TabPanel>
              <Tabs
                selectedIndex={this.state.selectedIndexSub}
                onSelect={selectedIndexSub =>
                  this.setState({ selectedIndexSub })
                }
              >
                <TabList>
                  <Tab>Main</Tab>
                  <Tab>Media</Tab>
                  <Tab>System</Tab>
                  {/* <Tab>Network</Tab>
                   <Tab>Status</Tab>
                  <Tab>SNMP</Tab> */}
                </TabList>
                <TabPanel
                  style={{
                    height: '100vh',
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                  }}
                >
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesSBCDPBX}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesMediaDPBX}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesSystemDPBX}
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </TabPanel>

            <TabPanel>
              <Tabs
                selectedIndex={this.state.selectedIndexSub}
                onSelect={selectedIndexSub =>
                  this.setState({ selectedIndexSub })
                }
              >
                <TabList>
                  <Tab>Main</Tab>
                  <Tab>Media</Tab>
                  <Tab>System</Tab>
                  <Tab>Network</Tab>
                  {/* <Tab>Status</Tab>
                  <Tab>SNMP</Tab> */}
                </TabList>
                <TabPanel
                  style={{
                    height: '100vh',
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                  }}
                >
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesSBCED}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesMediaED}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesSystemED}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className='ClaroDPBX'>
                    <div className='d-flex align-content-start flex-wrap justify-content-between'>
                      {gaugesNetworkED}
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </TabPanel>
          </Tabs>
        </div>
      </>
    )
  }
}
