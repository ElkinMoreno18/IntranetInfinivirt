// link Lbreria -> https://www.doubango.org/sipml5/docgen/symbols/_global_.html
//Link Ejemplo -> view-source:https://www.doubango.org/sipml5/call.htm?svn=252
//Link Demo -> https://www.doubango.org/sipml5/call.htm?svn=252#

import calling from './calling.mp3'
import ringing from './ringing.mp3'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Modal } from 'antd'
import userIcon from '../InCall/userIcon.png'
import React, { useEffect, useRef, useState } from 'react'
import 'rsuite/dist/rsuite.min.css'
import Timer from './Timer'
import swal from 'sweetalert'
import Icono from '../../../../../Resources/phoneIcon.png'
import './initiated.css'
import settings from '../../../../../Resources/config.ico'

const SIPml = window.SIPml //se llama a la API asi para poder importarla, se importa en el index.html
export let sipStack, registerSession, callSession //Variables Globales
//sipStack guarda todos los datos necesarios para poder iniciar cualquier evento.
//registerSession guardar el register de la sesion
//callSession guarda los datos al crearse una sesion como una llamada

function Initiated ({ getDataCall }) {
  //variables de estado que guardan y cargan desde el locastorage la informacion de registro
  const [txtRealm, setTxtRealm] = useState(
    localStorage.getItem('org.doubango.identity.realm')
  ) //Dominio
  const [txtPrivateId, setTxtPrivateId] = useState(
    localStorage.getItem('org.doubango.identity.impi')
  ) //usuario
  const [txtPublicId, setTxtPublicId] = useState(
    localStorage.getItem('org.doubango.identity.impu')
  ) //sip
  const [txtPassword, setTxtPassword] = useState(
    localStorage.getItem('org.doubango.identity.password')
  ) //contraseña
  const [txtDisplayName, setTxtDisplayName] = useState(
    localStorage.getItem('org.doubango.identity.display_name')
  ) // usuario
  //
  const [audioDom, setAudioDom] = useState() //variable de estado para acceder  a la etiqueta audio del DOM
  const [showTimer, setShowTimer] = useState(false) // controla el estado del tiempo de la llamada, para mostrarlo o ocultarlo
  const [modalModify, setModalModify] = useState(false)
  const [numberPhone, setNumberPhone] = useState('')
  const [txtCallIn, setTxtCallIn] = useState('WebRTC Infinivirt')
  const [txtInButton, setTxtInButton] = useState('Call')
  const [answeredCall, setAnsweredCall] = useState('init')
  const [mute, setMute] = useState(false)

  //funciones para los modales
  const handleOk = () => setModalModify(false)
  const handleCancel = () => setModalModify(false)

  const audio = new Audio(calling) // audio para llamar
  const audioIn = new Audio(ringing) //audio entrante
  const remote_stream_audio = useRef(null) // captura la etiqueta audio del DOM
  audio.loop = true
  audioIn.loop = true

  useEffect(() => {
    setAudioDom(remote_stream_audio.current) // captura una sola vez el id de la equita audio para poder usarse
  }, [])

  //funcion que registrar en el localstorage el registro, para no volver a registrarse cada vez, que se cargue la pagina (es molesto)
  function saveCredentials () {
    if (localStorage) {
      localStorage.setItem('org.doubango.identity.display_name', txtDisplayName)
      localStorage.setItem('org.doubango.identity.impi', txtPrivateId)
      localStorage.setItem('org.doubango.identity.impu', txtPublicId)
      localStorage.setItem('org.doubango.identity.password', txtPassword)
      localStorage.setItem('org.doubango.identity.realm', txtRealm)
    }
  }

  // funcion para iniciar el register, se llama en el button login

  function init () {
    if (!SIPml.isInitialized()) {
      SIPml.init(engineReadyCb, engineErrorCb) // 1. init
    }
    saveCredentials()
  }

  function logout () {
    sipStack.stop()
  }

  function engineReadyCb (e) {
    createSipStack() //2. iniciar stack
  }

  function engineErrorCb (e) {
    console.log(e) //control de errores
  }

  //funcion que registra eventos
  function sipEventsListener (e) {
    console.log('- sip event: ' + e.type)
    //si el stack es started hace el register
    if (e.type === 'started') {
      Register() //3. register
    }
    //EVENTO QUE DETECTA UNA LLAMADA ENTRANTE
    else if (e.type === 'i_new_call') {
      setTxtCallIn('Incoming Call')
      callSession = e.newSession
      console.log(callSession)
      callSession.setConfiguration({
        audio_remote: audioDom,
        events_listener: {
          events: '*',
          listener: callEventsListener
        }
      })
      audioIn.play()
      var sRemoteNumber = callSession.getRemoteFriendlyName() || 'unknown' //obtiene el numero remoto
      setNumberPhone(sRemoteNumber)
      setTxtInButton('Answer')
    } else if (e.type === 'm_permission_refused') {
      console.log('Permisos revocados')
    } else if (e.type === 'failed_to_start') {
      console.log('Fallo al iniciar el Stack')
    } else if (e.type === 'stopped') {
      console.log('Stack detenido')
    }
  }

  function createSipStack () {
    sipStack = new SIPml.Stack({
      realm: txtRealm,
      impi: txtPrivateId,
      impu: txtPublicId,
      password: txtPassword,
      display_name: txtDisplayName,
      enable_rtcweb_breaker: true,
      ice_servers: [{ urls: 'stun:stun.l.google.com:19302' }],
      websocket_proxy_url: 'wss://mybilling.infinivirt.com/webrtc/',
      events_listener: {
        events: '*',
        listener: sipEventsListener
      },
      sip_headers: [
        { name: 'User-Agent', value: 'WebRTC-Phone sipML Infinivirt-2022' }
      ]
    })
    if (sipStack.start() !== 0) {
      console.log(<i>FALLA AL INICIAR EL SIP STACK</i>)
    } else return
  }
  function registerEventsListener (e) {
    console.log('- register session event: ' + e.type)
  }

  function Register () {
    registerSession = sipStack.newSession('register', {
      events_listener: {
        events: '*',
        listener: registerEventsListener
      }
    })
    registerSession.register()
  }

  function callEventsListener (e) {
    console.log('- call session event: ' + e.type)
    if (
      e.type === 'terminating' ||
      e.type === 'terminated' ||
      e.type === 'connected'
    ) {
      audio.pause()
      audioIn.pause()
      setShowTimer(true)

      /* calling.pause(); */
    }
    if (e.type === 'terminated') {
      setNumberPhone('')
      setTxtCallIn('WebRTC Infinivirt')
      setShowTimer(false)
      setTxtInButton('Call')
      setAnsweredCall('init')
    }
    if (e.type === 'media_added') {
      console.log('Media añadido')
    }
    if (e.type === 'media_removed') {
      console.log('Media removido')
    }
    if (e.type === 'm_local_hold_ok') {
      callSession.bHeld = true
    }
    if (e.type === 'm_local_hold_nok') {
      console.log('Not Hold')
      console.log(e)
    }
    if (e.type === 'm_local_resume_ok') {
      callSession.bHeld = false
    }
    if (e.type === 'm_local_resume_nok') {
      console.log('Not Resume')
      console.log(e)
    }
  }

  //Hacer una llamada
  function call () {
    if (numberPhone !== '' && numberPhone.length >= 3) {
      if (sipStack) {
        callSession = sipStack.newSession('call-audio', {
          audio_remote: audioDom,
          events_listener: {
            events: '*',
            listener: callEventsListener
          }
        })
        // audio.play()
        callSession.call('sip:' + numberPhone + '@' + '208.89.104.141')
        audio.play()
      }
      setAnsweredCall('calling')
      // getDataCall('initiated', numberPhone, callSession, audioDom)
    } else {
      swal('Error', 'Por favor digite un numero valido', 'error')
    }
  }

  function hangUp () {
    if (callSession) {
      callSession.hangup()
      console.log('**********LLAMADA TERMINADA*********')
    }
    setAnsweredCall('init')
  }

  function rejectCall () {
    if (callSession) {
      callSession.reject()
    }
    setAnsweredCall('init')
  }

  //contestar llamada
  function answer (e) {
    if (callSession) {
      callSession.accept()
    }
    setAnsweredCall('calling')
    // getDataCall('initiated', numberPhone, callSession, audioDom)
  }

  function holdResume () {
    if (callSession) {
      var i_ret
      console.log('Resume call')
      i_ret = callSession.bHeld ? callSession.resume() : callSession.hold()
      if (i_ret != 0) {
        console.log('ERROR RESUME CALL')
        return
      }
    }
  }

  function muted () {
    setMute(mute)
    callSession.mute('audio', mute)
  }

  function acceptTransfer () {
    if (callSession) {
      callSession.acceptTransfer()
    }
  }

  function rejectTransfer () {
    if (callSession) {
      callSession.rejectTransfer()
    }
  }

  function transferCall () {
    if (callSession) {
      if (callSession.transfer('1115') != 0) {
        console.log('Transferencia Fallida')
        return
      }
      console.log('Transfiriendo la llamada ....')
    }
  }

  function getNumber (number) {
    var telephone = numberPhone + number
    setNumberPhone(telephone)
  }

  function deleteLastNumber () {
    var telephone = numberPhone
    var subst = telephone.substring(0, telephone.length - 1)
    setNumberPhone(subst)
  }

  function detectKeyPress (event) {
    var keyValue = event.key
    var telephone = numberPhone
    var keyString
    switch (keyValue) {
      case '1':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '2':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '3':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '4':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '5':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '6':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '7':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '8':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '9':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '0':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '+':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '*':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case '#':
        keyString = telephone + keyValue
        setNumberPhone(keyString)
        break
      case 'Backspace':
        keyString = telephone.substring(0, telephone.length - 1)
        setNumberPhone(keyString)
        break
      default:
        break
    }
  }

  // var state = this.state.callState

  return (
    <>
      <div tabIndex='0' onKeyDown={e => detectKeyPress(e)}>
        {console.log(answeredCall)}
        {answeredCall === 'init' ? (
          <>
            <div className='row headPhone'>
              <div className='icono'>
                <img id='iconoPhone' src={Icono}></img>
              </div>
              <div className='col-7 col-md-8 col-lg-8 textCall text-center'>
                <p style={{ fontSize: '12pt' }} id='textCalls'>
                  {txtCallIn}
                </p>
              </div>
              <div
                className='col-2 col-md-2 col-lg-2'
                onClick={() => setModalModify(true)}
              >
                <img
                  id='iconoSetting'
                  src={settings}
                  className='mx-lg-2 mx-2'
                ></img>
              </div>
            </div>

            <div className='row row-cols-1 phoneNumber mt-3'>
              <div className='input-group mb-3'>
                <input
                  className='form-control number '
                  placeholder='Type a number'
                  value={numberPhone}
                  onChange={() => {}}
                  type='tel'
                />
                <button
                  onClick={() => deleteLastNumber()}
                  className='btn btnDelete'
                  type='button'
                  id='button-addon2'
                >
                  <i className='bi bi-backspace'></i>
                </button>
              </div>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <div
                  onClick={() => getNumber('1')}
                  className='button digit no-sub'
                >
                  1
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('2')}>
                  2<div className='sub-digit'>ABC</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('3')}>
                  3<div className='sub-digit'>DEF</div>
                </div>
              </div>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('4')}>
                  4<div className='sub-digit'>GHI</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('5')}>
                  5<div className='sub-digit'>JKL</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('6')}>
                  6<div className='sub-digit'>MNO</div>
                </div>
              </div>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('7')}>
                  7<div className='sub-digit'>PQRS</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('8')}>
                  8<div className='sub-digit'>TUV</div>
                </div>
              </div>
              <div className='col-4' onClick={() => getNumber('9')}>
                <div className='button digit'>
                  9<div className='sub-digit'>WXYZ</div>
                </div>
              </div>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <div
                  className='button digit no-sub'
                  onClick={() => getNumber('*')}
                >
                  *
                </div>
              </div>
              <div className='col-4'>
                <div className='row'>
                  <div className='button digit' onClick={() => getNumber('0')}>
                    0
                  </div>
                </div>
                <div className='row'>
                  <div className='sub-digit' onClick={() => getNumber('+')}>
                    +
                  </div>
                </div>
              </div>
              <div className='col-4'>
                <div className='button digit' onClick={() => getNumber('#')}>
                  #
                </div>
              </div>
            </div>
            <div className='row row-cols-1 mt-3'>
              {txtInButton === 'Call' ? (
                <div className='col-12'>
                  <button
                    type='button'
                    id='btnCall'
                    className='btn btn-success w-100'
                    onClick={call}
                  >
                    {txtInButton}
                  </button>
                </div>
              ) : (
                <>
                  <div className='col-5'>
                    <button
                      type='button'
                      id='btnAnswer'
                      className='btn btn-success w-100'
                      onClick={answer}
                      style={{ textAlign: 'center' }}
                    >
                      {txtInButton}
                    </button>
                  </div>
                  <div className='col-2'></div>
                  <div className='col-5'>
                    <button
                      type='button'
                      id='btnReject'
                      className='btn btn-danger w-100'
                      onClick={rejectCall}
                      style={{ textAlign: 'center' }}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className='row headPhone'>
              <div className='icono'>
                <img id='iconoPhone' src={Icono}></img>
              </div>
              <div className=' col-2 col-md-2 col-lg-1 textCall'>
                <p id='textCalls'>Calls</p>
              </div>
            </div>
            <div className='row row-cols-1 subHeadPhone mt-3 '>
              <img className='mx-auto' src={userIcon} id='iconUserRTC'></img>
              <h5 className='mt-2' id='numberPhone'>
                {numberPhone}
              </h5>
              <p>Calling</p>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <button
                  className='btn acciones h-100'
                  id='btnPause'
                  onClick={holdResume}
                >
                  <i className='bi bi-pause-fill'></i>
                  <p>Pause</p>
                </button>
              </div>
              <div className='col-4 '>
                <button
                  className='btn acciones h-100'
                  id='btnMute'
                  onClick={muted}
                >
                  {mute === false ? (
                    <>
                      <i className='bi bi-mic-mute-fill'></i> <p> Mute </p>
                    </>
                  ) : (
                    <>
                      <i className='bi bi-mic-fill'></i> <p>Unmute</p>
                    </>
                  )}
                </button>
              </div>
              <div className='col-4'>
                <button className='btn acciones h-100' id='btnRecord'>
                  <i className='bi bi-record-circle'></i>
                  <p>Record</p>
                </button>
              </div>
            </div>
            <div className='row row-cols-3 mt-3'>
              <div className='col-4'>
                <button
                  className='btn acciones h-100'
                  id='btnPause'
                  onClick={transferCall}
                >
                  <i className='bi bi-arrow-up-circle'></i>
                  <p>Transfer</p>
                </button>
              </div>
              <div className='col-4'>
                <button className='btn acciones h-100' id='btnMute'>
                  <i className='bi bi-grid-3x3-gap-fill'></i>
                  <p>Dialpad</p>
                </button>
              </div>
              <div className='col-4'>
                <button className='btn acciones h-100' id='btnRecord'>
                  <i className='bi bi-record-circle'></i>
                  <p>Pause</p>
                </button>
              </div>
            </div>
            <div className='row row-cols-1 mt-4'>
              <div className='col-12'>
                <button
                  type='button'
                  id='btnHang'
                  className='btn btn-danger w-100'
                  onClick={hangUp}
                >
                  Hang Up
                </button>
              </div>
            </div>
          </>
        )}
        <audio
          id='audio_remote'
          autoPlay
          controls
          hidden
          ref={remote_stream_audio}
        ></audio>
      </div>
      <Modal
        centered
        className='modifyWebRTC'
        title='Modificar Informacion'
        visible={modalModify}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Guardar'
        cancelText='Cancelar'
      >
        <Container id='container'>
          <Row>
            <Col>
              <h4 className='fw-bold'>Register</h4>
              <br></br>
              <Form>
                <Form.Group>
                  <div className='float-start me-5'>
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      placeholder='Nombre Usuario'
                      onChange={event => setTxtDisplayName(event.target.value)}
                      defaultValue={txtDisplayName}
                    />
                    <Form.Label className='mt-4'>Private Identity</Form.Label>
                    <Form.Control
                      placeholder='Identidad privada'
                      onChange={event => setTxtPrivateId(event.target.value)}
                      defaultValue={txtPrivateId}
                    />
                  </div>
                  <div className='float-start me-5'>
                    <Form.Label>Public Identity</Form.Label>
                    <Form.Control
                      placeholder='Direccion Sip'
                      onChange={event => setTxtPublicId(event.target.value)}
                      defaultValue={txtPublicId}
                    />
                    <Form.Label className='mt-4'>Password</Form.Label>
                    <Form.Control
                      onChange={event => setTxtPassword(event.target.value)}
                      defaultValue={txtPassword}
                    />
                  </div>
                  <div className='float-start me-5'>
                    <Form.Label>Domain</Form.Label>
                    <Form.Control
                      placeholder='Dominio(realm)'
                      onChange={event => setTxtRealm(event.target.value)}
                      defaultValue={txtRealm}
                    />
                    <div className='mt-1'>
                      <Button className='mt-5 float-start' onClick={init}>
                        LogIn
                      </Button>
                      <Button
                        className='mt-5 float-end btn-danger'
                        onClick={logout}
                      >
                        LogOut
                      </Button>
                    </div>
                  </div>
                </Form.Group>
              </Form>
            </Col>
            {/* <Col className='mt-3'>
              <h2>Call control</h2>
              <Container className='mt-3'>
                <Form.Label>Phone number: </Form.Label>
                <audio
                  hidden
                  autoPlay
                  controls
                  ref={remote_stream_audio}
                ></audio>
                <Form.Control
                  placeholder='Number'
                  onChange={event => setTxtNumber(event.target.value)}
                  defaultValue={txtNumber}
                />
                <Button className='m-3 btn-success' onClick={call}>
                  <CallIcon></CallIcon>
                </Button>
                <Button onClick={handleOpenIcall}>open</Button>
              </Container>
            </Col> */}
          </Row>
        </Container>
      </Modal>
      {/* WINDOW CALLING */}
      {/* <Modal open={open} onClose={handleClose}>
            <Modal.Header>
              <Modal.Title className='text-center'>
                <h5>Calling to {txtNumber}</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className='d-flex justify-content-center'></Container>
              <Container fluid className='d-flex justify-content-center '>
                <Button
                  style={{ width: '60%' }}
                  className='btn-danger m-3 me-5 ms-5'
                  onClick={HangUp}
                >
                  <CallEndIcon></CallEndIcon>
                </Button>
              </Container>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
          {/* WINDOW Incoming CALL }
      <Modal
        centered
        className='callIn w-50'
        style={{ height: '250px' }}
        title='Llamada Entrante'
        //visible={openIncall}
        visible={false}
        onOk={handleCloseIncall}
        onCancel={handleCloseIncall}
        okText='Guardar'
        cancelText='Cancelar'
      >
        <h3>Llamada Entrante</h3>
        <div>
          <p>
            Llamada entrante de: <strong>{RemoteNumber}</strong>
          </p>
        </div>
        {showTimer === true && <Timer />}
        <Container className='d-flex justify-content-center bg-dark h-25'>
          {showTimer === true && (
            <Button className='btn-light btn-sm m-2'>
              <MicOffIcon />
            </Button>
          )}
          {/* silenciar 
          {showTimer === true && (
            <Button className='btn-light btn-sm m-2'>
              <PhonePausedIcon />
            </Button>
          )}
          {/* Pausar Hold 
          {showTimer === true && (
            <Button className='btn-light btn-sm m-2'>
              <PhoneForwardedIcon />
            </Button>
          )}
          {/* Transferir 
        </Container>
        <Container fluid className='d-flex justify-content-center '>
          <Button className='btn btn-success w-25' onClick={answer}>
            <CallIcon></CallIcon>
          </Button>
          <Button className='btn-danger m-3 ' onClick={HangUp}>
            <CallEndIcon></CallEndIcon>
          </Button>
        </Container>
      </Modal> */}
    </>
  )
}

export default Initiated

/* 
  

  


  componentDidMount () {
    /*  const servers = null
    pc1 = new RTCPeerConnection(servers)
    console.log('Created local peer connection object pc1')
    pc1.onicecandidate = e => this.onIceCandidate(pc1, e)
    console.log(pc1)
    pc2 = new RTCPeerConnection(servers)
    console.log('Created remote peer connection object pc2')
    pc2.onicecandidate = e => this.onIceCandidate(pc2, e)
    pc2.ontrack = this.gotRemoteStream
    console.log(pc2) 
    const [txtRealm, setTxtRealm] = useState(localStorage.getItem('org.doubango.identity.realm')) //Dominio
  const [txtPrivateId, setTxtPrivateId] = useState(localStorage.getItem('org.doubango.identity.impi')) //usuario
  const [txtPublicId, setTxtPublicId] = useState(localStorage.getItem('org.doubango.identity.impu')) //sip
  const [txtPassword, setTxtPassword] = useState(localStorage.getItem('org.doubango.identity.password')) //contraseña
  const [txtDisplayName, setTxtDisplayName] = useState(localStorage.getItem('org.doubango.identity.display_name')) // usuario
  //
  const [txtNumber, setTxtNumber] = useState('+573226447871') // variable de estado para el numero tel
  const [audioDom, setAudioDom] = useState() //variable de estado para acceder  a la etiqueta audio del DOM
  const [RemoteNumber, setRemoteNumber] = useState(''); // Variable de estado para recibir el numero remoto
  const [open, setOpen] = React.useState(false); // abre el modal para llamar
  const [openIcall, setOpenIcall] = useState(false); //abre el modal para llamada entrante
  const [showTimer, setShowTimer] = useState(false); // controla el estado del tiempo de la llamada, para mostrarlo o ocultarlo
  //funciones para los modales
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenIcall = () => setOpenIcall(true);
  const handleCloseIcall = () => setOpenIcall(false);


  const audio = new Audio(calling) // audio para llamar 
  const audioIn = new Audio(ringing) //audio entrante
  const remote_stream_audio = useRef(null) // captura la etiqueta audio del DOM
  audio.loop = true
  audioIn.loop = true

  useEffect(() => {
      setAudioDom(remote_stream_audio.current) // captura una sola vez el id de la equita audio para poder usarse

  }, []);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.handleSuccess)
      .catch(this.handleError)
    this.setState({
      callState: 'initiated'
    })
  }

  ///////////////// SIP JS ///////

  /* callRTC () {
    const options = (Web.SimpleUserOptions = {
      aor: 'sip:Test_Jesus_WebRTC@208.89.104.141',
      media: {
        constraints: { audio: true, video: false },
        remote: { audio: audio }
      }
    })


    const server = 'wss://mybilling.infinivirt.com/webrtc/'

    const simpleUser = new SIP.Web.SimpleUser(server, options)

    simpleUser
      .connect()
      .then(() => simpleUser.call('sip:3125087580@208.89.104.141'))
      .catch((error = Error) => {
        console.log(error)
      })
  } 

  ///////////// JS SIP /////////////

  callRTC () {
    var session = null

    var socket = new JsSIP.WebSocketInterface(
      'wss://mybilling.infinivirt.com/webrtc/'
    )

    //socket.via_transport = 'udp'

    var configuration = {
      sockets: [socket],
      uri: 'sip:Test_Jesus_WebRTC@208.89.104.141:5060',
      password: 'xochswv6',
      realm: '208.89.104.141',
      contact_uri: 'sip:Test_Jesus_WebRTC@181.143.18.50',
      authorization_user: 'Test_Jesus_WebRTC'
    }

    var ua = new JsSIP.UA(configuration)

    ua.start()
    ua.register()
    var call_duration_timer = 0

    // Register callbacks to desired call events
    var eventHandlers = {
      progress: function (e) {
        console.log('call is in progress')
        alert(e.data.response_code)
      },
      failed: function (e) {
        console.log(e)
        console.log('call failed with cause: ' + e.cause)
      },
      ended: function (e) {
        console.log('call ended with cause: ' + e.cause)
      },
      addstream: function (e) {
        var stream = e.stream
        var call_start_date, update_call_duration
        var audio_remote = audio
        call_start_date = new Date()
        call_duration_timer = setInterval(update_call_duration, 1000)
        $('#call_info span.call_status').text('Established')
        audio_remote.src = window.URL.createObjectURL(stream)
      },
      ended: function (e) {
        console.debug('Ended event')
        window.clearInterval(call_duration_timer)
        $('#call_info span.call_status').text('Ended')
      }
    }

    var options = {
      mediaConstraints: { audio: true, video: false },
      iceServers: { urls: ['stun:stun.l.google.com:19302'] }
    }

    ua.on('connecting', ev => {
      console.log('UA "connecting" event')
      console.log(ev)
    })

    ua.on('connected', function (e) {
      console.log('UA is connected')
      console.log(e)
    })
    ua.on('disconnected', ev => {
      console.log('UA "disconnected" event')
      console.log(ev)
    })
    ua.on('registered', data => {
      console.log('UA "registered" event', data)
      try {
        var call = ua.call('sip:573125087580@208.89.104.141', options)

        call.on('ring', e => {
          console.log('Ringing' + e)
        })
        call.on('progress', e => {
          console.log('Progress')
          console.log(e)
        })
        call.on('accepted', e => {
          console.log('accepted', e)
        })
        call.on('reject', e => {
          console.log('Rejected' + e)
        })
        call.on('answer', e => {
          console.log('Answered' + e)
        })
        call.on('failure', e => {
          console.log('Failured' + e)
        })
      } catch (e) {
        console.log(e)
      }
    })
    ua.on('unregistered', data => {
      console.log('UA "unregistered" event')
      console.log(data)
    })
    ua.on('registrationFailed', data => {
      console.log('UA "registrationFailed" event')
      console.log(data)
    })
    ua.on('registrationExpiring', data => {
      console.log('Expirando Registro')
      console.log(data)
    })
    ua.on('newRTCSession', function (e) {
      console.trace('new rtc session created - incoming or outgoing call')
      session = e.session

      if (e.originator === 'local') {
        console.trace(e.request + ' outgoing session')
      } else {
        console.trace(e.request + ' incoming session answering a call')
        e.session.answer()
      }

      console.log(session)
      console.log(e)

      session.on('peerconnection', function (data) {
        data = data.peerconnection.createDataChannel('call')
        console.log(data)
      })
      session.on('connecting', function (data) {
        console.log(data)
      })
      session.on('sending', function (data) {
        console.log(data)
      })
      session.on('progress', function (data) {
        console.log(data)
      })
      session.on('accepted', function (data) {
        console.log(data)
      })
      session.on('icecandidate', function (event) {
        event.ready()
      })
      session.on('confirmed', function (data) {
        console.log(data)
      })
      session.on('ended', function (data) {
        console.log(data)
      })
      session.on('failed', function (data) {
        console.log(data)
      })
      session.on('hold', function (data) {
        console.log(data)
      })
      session.on('reinvite', function (data) {
        console.log(data)
      })
      session.on('update', function (data) {
        console.log(data)
      })
      session.on('sdp', function (data) {
        var ip
        try {
          //      ip = axios.get('https://api.ipify.org?format=json')
          /* console.log(ip)

          console.log('sdp', data)
          console.log(ip) 

          data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/AVP')
          data.sdp = data.sdp.replace('10.10.104.155', '181.143.18.50')
          data.sdp = data.sdp.replace('a=rtpmap:109 opus/48000/2', '')
          data.sdp = data.sdp.replace('a=rtpmap:9 G722/8000/1', '')
          data.sdp =
            'v=0 \n' +
            'o=Z 1983 678902 IN IP4 ' +
            '181.143.18.50 \n' +
            's=Z \n' +
            'c=IN IP4 ' +
            '181.143.18.50 \n' +
            't=0 0 \n' +
            'm=audio 38038 RTP/SAVPF 9 8 101 0 \n' +
            'a=rtpmap:9 G722/8000/1 \n' +
            'a=rtpmap:8 PCMA/8000/1 \n' +
            'a=rtpmap:0 PCMU/8000/1 \n' +
            'a=rtpmap:101 telephone-event/8000/1 \n' +
            'a=fmtp:101 0-16 \n' +
            'a=sendrecv \n'

          // data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/AVP')
        } catch (error) {
          console.error(error)
        }
      })
      session.on('peerconnection:setremotedescriptionfailed', function (e) {
        console.log(e)
      })
    })

    ua.on('newMessage', function (e) {
      if (e.originator === 'local')
        console.trace(' outgoing MESSAGE request ', e)
      else console.trace(' incoming MESSAGE request ', e)
    })
    ua.on('sipEvent', data => {
      console.log('Evento SIP')
      console.log(data)
    })
    ua.on('newOptions', data => {
      console.log('Nuevo Options')
      console.log(data)
    })
  } 

  render () {
    var state = this.state.callState

    return (
      <>
        <div tabIndex='0' onKeyDown={e => this.detectKeyPress(e)}>
          <div className='row headPhone'>
            <div className='icono'>
              <img id='iconoPhone' src={Icono}></img>
            </div>
            <div className=' col-2 col-md-2 col-lg-1 textCall'>
              <p id='textCalls'>Calls</p>
            </div>
          </div>
          <div className='row row-cols-1 phoneNumber mt-3'>
            <div className='input-group mb-3'>
              <input
                className='form-control number '
                placeholder='Type a number'
                value={this.state.numberPhone}
                onChange={() => {}}
                type='tel'
              />
              <button
                onClick={() => this.deleteLastNumber()}
                className='btn btnDelete'
                type='button'
                id='button-addon2'
              >
                <i className='bi bi-backspace'></i>
              </button>
            </div>
          </div>
          <div className='row row-cols-3 mt-3'>
            <div className='col-4'>
              <div
                onClick={() => this.getNumber('1')}
                className='button digit no-sub'
              >
                1
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('2')}>
                2<div className='sub-digit'>ABC</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('3')}>
                3<div className='sub-digit'>DEF</div>
              </div>
            </div>
          </div>
          <div className='row row-cols-3 mt-3'>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('4')}>
                4<div className='sub-digit'>GHI</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('5')}>
                5<div className='sub-digit'>JKL</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('6')}>
                6<div className='sub-digit'>MNO</div>
              </div>
            </div>
          </div>
          <div className='row row-cols-3 mt-3'>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('7')}>
                7<div className='sub-digit'>PQRS</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('8')}>
                8<div className='sub-digit'>TUV</div>
              </div>
            </div>
            <div className='col-4' onClick={() => this.getNumber('9')}>
              <div className='button digit'>
                9<div className='sub-digit'>WXYZ</div>
              </div>
            </div>
          </div>
          <div className='row row-cols-3 mt-3'>
            <div className='col-4'>
              <div
                className='button digit no-sub'
                onClick={() => this.getNumber('*')}
              >
                *
              </div>
            </div>
            <div className='col-4'>
              <div className='row'>
                <div
                  className='button digit'
                  onClick={() => this.getNumber('0')}
                >
                  0
                </div>
              </div>
              <div className='row'>
                <div className='sub-digit' onClick={() => this.getNumber('+')}>
                  +
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digit' onClick={() => this.getNumber('#')}>
                #
              </div>
            </div>
          </div>
          <div className='row row-cols-1 mt-3'>
            <div className='col-12'>
              <button
                type='button'
                id='btnCall'
                className='btn btn-success w-100'
                onClick={
                  this.callRTC
                  /* this.onCall('initiated', this.state.numberPhone)
                }
              >
                Call
              </button>
            </div>
          </div>
        </div>
        <audio id='gum-local' className='mt-4' controls autoPlay></audio>
      </>
    )
  }
}
*/
