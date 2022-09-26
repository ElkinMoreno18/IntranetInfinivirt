/* eslint-disable no-undef */
import VoicemailIcon from '@mui/icons-material/Voicemail'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import MergeIcon from '@mui/icons-material/Merge'
import SocialDistanceIcon from '@mui/icons-material/SocialDistance'
import DialpadIcon from '@mui/icons-material/Dialpad'
import PauseIcon from '@mui/icons-material/Pause'
import MicOffIcon from '@mui/icons-material/MicOff'
import MicIcon from '@mui/icons-material/Mic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CallEndIcon from '@mui/icons-material/CallEnd'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'
import calling from './calling.mp3'
import ringing from './ringing.mp3'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import 'rsuite/dist/rsuite.min.css'
import Timer from './Timer'
import swal from 'sweetalert'
import Icono from '../../../../Resources/phoneIcon.png'
import './initiated.css'
import settings from '../../../../Resources/config.ico'
import './webRTC.css'

const SIPml = window.SIPml //se llama a la API asi para poder importarla, se importa en el index.html
export let sipStack, registerSession, callSession, timeDiff //Variables Globales
//sipStack guarda todos los datos necesarios para poder iniciar cualquier evento.
//registerSession guardar el register de la sesion
//callSession guarda los datos al crearse una sesion como una llamada
var primaryColor = process.env.REACT_APP_PRIMARY_COLOR
var secondaryColor = process.env.REACT_APP_SECONDARY_COLOR

function Initiated ({ getDataCall }) {
  //variables de estado que guardan y cargan desde el locastorage la informacion de registro
  const [txtPublicId, setTxtPublicId] = useState(
    localStorage.getItem('infinivirt.webRTC.sip')
  ) //sip
  const [txtPassword, setTxtPassword] = useState(
    localStorage.getItem('infinivirt.webRTC.password')
  ) //contraseña
  const [txtDisplayName, setTxtDisplayName] = useState(
    localStorage.getItem('infinivirt.webRTC.display_name')
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
  const [hold, setHold] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const [idBtn, setIdBtn] = useState()

  //funciones para los modales
  const [stateRegister, setStateRegister] = useState(false)
  const [stateCall, setStateCall] = useState('')
  const [showDialPad, setShowDialPad] = useState(true)
  const [numberDialPad, setNumberDialPad] = useState()
  const [numberTransfer, setNumberTransfer] = useState('')
  const [visibleNumberTransfer, setVisibleNumberTransfer] = useState(false)
  const [viewNumberAttendedTransfer, setViewNumberAttendedTransfer] = useState(
    false
  )
  const [viewBtnConfirmTransfer, setViewBtnConfirmTransfer] = useState(false)

  /*   const audio = new Audio(calling) // audio para llamar
  audio.loop = true */

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
      localStorage.setItem('infinivirt.webRTC.display_name', txtDisplayName)
      localStorage.setItem('infinivirt.webRTC.sip', txtPublicId)
      localStorage.setItem('infinivirt.webRTC.password', txtPassword)
      localStorage.setItem('webRTC.primaryColor', '')
      localStorage.setItem('webRTC.secondaryColor', '')
    }
  }

  // funcion para iniciar el register, se llama en el button login

  function init () {
    if (!SIPml.isInitialized()) {
      SIPml.init(engineReadyCb, engineErrorCb) // 1. init
    } else {
      toast.success('Register Successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
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
      realm: '208.89.104.141',
      impi: txtPublicId,
      impu: 'sip:' + txtPublicId + '@208.89.104.141',
      password: txtPassword,
      display_name: txtPublicId,
      enable_rtcweb_breaker: true,
      ice_servers: [{ urls: 'stun:stun.l.google.com:19302' }],
      websocket_proxy_url: 'wss://mybilling.infinivirt.com/webrtc/',
      events_listener: {
        events: '*',
        listener: sipEventsListener
      },
      sip_headers: [{ name: 'User-Agent', value: 'WebRTC Infinivirt - 2022' }]
    })
    if (sipStack.start() !== 0) {
      console.log(<i>FALLA AL INICIAR EL SIP STACK</i>)
    } else return
  }
  function registerEventsListener (e) {
    console.log('- register session event: ' + e.type)
   /*  if (e.type == 'connected') {
      setStateRegister(true)
    }
    if (e.type == 'terminated') {
      setStateRegister(false)
    } */
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
      setShowDialPad(false)
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

  function ShowDialPad () {
    setShowDialPad(!showDialPad)
  }

  function SendDTMF (number) {
    console.log('DTMF')
    /* if (session) {
      session.sendDTMF(number)
    } */
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

  function sipToggleHoldResume () {
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
    if (callSession) {
      var i_ret
      var bMute = !callSession.bMute
      //txtCallStatus.innerHTML = bMute ? '<i>Mute the call...</i>' : '<i>Unmute the call...</i>';
      i_ret = callSession.mute('audio' /*could be 'video'*/, bMute)
      if (i_ret != 0) {
        //txtCallStatus.innerHTML = '<i>Mute / Unmute failed</i>';
        console.log('Mute/ Unmute Failed')
        return
      }
      callSession.bMute = bMute
      //btnMute.value = bMute ? "Unmute" : "Mute";
      if (stateMute == false) {
        setStateMute(true)
      } else {
        setStateMute(false)
      }
    }
    /*  setMute(mute)
    callSession.mute('audio', mute) */
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

  function handleChangeHoverIn (idbtn) {
    setBtnHover(true)
    setIdBtn(idbtn)
  }

  function handleChangeHoverOut (idbtn) {
    setBtnHover(false)
    setIdBtn(idbtn)
  }

  function getNumber (number) {
    var telephone = numberPhone + number
    setNumberPhone(telephone)
  }

  function getNumberDialPad (number) {
    setNumberDialPad(number)
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
      <div className='container-fluid'>
        <div
          className='mx-auto mt-2 text-center contenedor col-10 col-sm-8 col-md-8 col-lg-6 col-xl-5 col-xxl-4'
          id='contenedor'
        >
          <div tabIndex='0' onKeyDown={e => detectKeyPress(e)}>
            {answeredCall === 'init' ? (
              <>
                <div
                  className='row headPhone'
                  style={{ borderBottom: '2px solid' + primaryColor }}
                >
                  <div
                    className='icono'
                    style={{ backgroundColor: primaryColor }}
                  >
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
                      style={{ borderBottom: '3px solid ' + primaryColor }}
                    />
                    <button
                      onClick={() => deleteLastNumber()}
                      className='btn btnDelete'
                      type='button'
                      id='button-addon2'
                      style={{ borderBottom: '3px solid ' + primaryColor }}
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
                      id='voiceMailIcon'
                      onMouseDown={() => {
                        timeDiff = window.setTimeout(function () {
                          call = ua.call('sip:*97@181.143.18.50', options)
                          if (call) {
                            call.connection.addEventListener('addstream', e => {
                              var audio = document.createElement('audio')
                              audio.srcObject = e.stream
                              audio.play()
                            })
                            setAnsweredCall('calling')
                            setNumberPhone('Buzon de Voz')
                            setShowDialPad(false)
                          }
                        }, 1000)
                        return false
                      }}
                      onMouseUp={() => {
                        clearTimeout(timeDiff)
                        return false
                      }}
                    >
                      1
                      <div className='sub-digit'>
                        <VoicemailIcon fontSize='12pt' />
                      </div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('2')}
                    >
                      2<div className='sub-digit'>ABC</div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('3')}
                    >
                      3<div className='sub-digit'>DEF</div>
                    </div>
                  </div>
                </div>
                <div className='row row-cols-3 mt-3'>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('4')}
                    >
                      4<div className='sub-digit'>GHI</div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('5')}
                    >
                      5<div className='sub-digit'>JKL</div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('6')}
                    >
                      6<div className='sub-digit'>MNO</div>
                    </div>
                  </div>
                </div>
                <div className='row row-cols-3 mt-3'>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('7')}
                    >
                      7<div className='sub-digit'>PQRS</div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div
                      className='button digit'
                      onClick={() => getNumber('8')}
                    >
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
                      <div
                        className='button digit'
                        onClick={() => getNumber('0')}
                      >
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
                    <div
                      className='button digit'
                      onClick={() => getNumber('#')}
                    >
                      #
                    </div>
                  </div>
                </div>
                <ToastContainer />
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
                <div
                  className='row headPhone'
                  style={{ borderBottom: '2px solid' + primaryColor }}
                >
                  <div
                    className='icono'
                    style={{ backgroundColor: primaryColor }}
                  >
                    <img id='iconoPhone' src={Icono}></img>
                  </div>
                  <div className=' col-2 col-md-2 col-lg-1 textCall'>
                    <p id='textCalls'>Calls</p>
                  </div>
                </div>
                <div className='row row-cols-1 subHeadPhone mt-3 '>
                  <img className='mx-auto' src='' id='iconUserRTC'></img>
                  <h5 className='mt-2' id='numberPhone'>
                    {numberPhone}
                  </h5>
                  {showTimer === true ? <Timer></Timer> : ''}
                </div>
                <div className='row row-cols-3 mt-3'>
                  <div className='col-4'>
                    <button
                      className='btn acciones h-100'
                      id='btnPause'
                      onClick={sipToggleHoldResume}
                      onMouseEnter={() => handleChangeHoverIn(1)}
                      onMouseLeave={() => handleChangeHoverOut(1)}
                      style={
                        btnHover && idBtn === 1
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                    >
                      {hold ? <PlayArrowIcon /> : <PauseIcon />}
                      <p>Pause</p>
                    </button>
                  </div>
                  <div className='col-4 '>
                    <button
                      className='btn acciones h-100'
                      id='btnMute'
                      onClick={muted}
                      onMouseEnter={() => handleChangeHoverIn(2)}
                      onMouseLeave={() => handleChangeHoverOut(2)}
                      style={
                        btnHover && idBtn === 2
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                    >
                      {mute ? <MicOffIcon /> : <MicIcon />}
                      <p>Mute</p>
                    </button>
                  </div>
                  <div className='col-4'>
                    <button
                      className='btn acciones h-100'
                      /* onClick={() =>
                        conference(allSessionsActive, 'audioIncoming')
                      } */
                      onMouseEnter={() => handleChangeHoverIn(3)}
                      onMouseLeave={() => handleChangeHoverOut(3)}
                      style={
                        btnHover && idBtn === 3
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                      id='btnRecord'
                    >
                      <RadioButtonCheckedIcon />
                      <p>Record</p>
                    </button>
                  </div>
                </div>
                <div className='row row-cols-3 mt-3'>
                  <div className='col-4'>
                    <button
                      className='btn acciones h-100'
                      id='btnPause'
                      onClick={() => setVisibleNumberTransfer(true)}
                      onMouseEnter={() => handleChangeHoverIn(4)}
                      onMouseLeave={() => handleChangeHoverOut(4)}
                      style={
                        btnHover && idBtn === 4
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                    >
                      <MergeIcon />
                      <p>Transfer</p>
                    </button>
                  </div>
                  <div className='col-4'>
                    <button
                      className='btn acciones h-100'
                      id='btnMute'
                      onClick={ShowDialPad}
                      onMouseEnter={() => handleChangeHoverIn(5)}
                      onMouseLeave={() => handleChangeHoverOut(5)}
                      style={
                        btnHover && idBtn === 5
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                    >
                      <DialpadIcon />
                      <p>Dialpad</p>
                    </button>
                  </div>
                  <div className='col-4'>
                    <button
                      className='btn acciones h-100'
                      id='btnRecord'
                      //onClick={attendedTransfer}
                      onMouseEnter={() => handleChangeHoverIn(6)}
                      onMouseLeave={() => handleChangeHoverOut(6)}
                      style={
                        btnHover && idBtn === 6
                          ? {
                              border: '1px solid ' + primaryColor,
                              color: primaryColor
                            }
                          : {}
                      }
                    >
                      <SocialDistanceIcon />
                      <p style={{ fontSize: '10pt' }}>Transfer att.</p>
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
            onCancel={() => setModalModify(false)}
            footer={[
              <Button
                className='btn btn-light me-2'
                key={'back'}
                onClick={() => setModalModify(false)}
              >
                Cancel
              </Button>,
              <Button
                className='btn btn-primary me-2'
                key={'unregisterbtn'}
                onClick={logout}
              >
                Unregister
              </Button>,
              <Button
                className='btn btn-success'
                key={'registerbtn'}
                onClick={init}
              >
                Register
              </Button>
            ]}
            okText='Register'
            cancelText='Unregister'
          >
            <Container id='containerModal'>
              <Row>
                <Col>
                  <Form>
                    <Form.Group>
                      <div className='float-start me-4'>
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control
                          placeholder='Nombre Usuario'
                          onChange={event =>
                            setTxtDisplayName(event.target.value)
                          }
                          defaultValue={txtDisplayName}
                        />
                        {/* <Form.Label className='mt-4'>Private Identity</Form.Label>
                    <Form.Control
                      placeholder='Identidad privada'
                      onChange={event => setTxtPrivateId(event.target.value)}
                      defaultValue={txtPrivateId}
                    /> */}
                      </div>
                      <div className='float-start me-4'>
                        <Form.Label>Public Identity</Form.Label>
                        <Form.Control
                          placeholder='Direccion Sip'
                          onChange={event => setTxtPublicId(event.target.value)}
                          defaultValue={txtPublicId}
                        />
                      </div>
                      <div className='float-start me-4'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          onChange={event => setTxtPassword(event.target.value)}
                          defaultValue={txtPassword}
                        />
                        {/*  <Form.Label>Domain</Form.Label>
                    <Form.Control
                      placeholder='Dominio(realm)'
                      onChange={event => setTxtRealm(event.target.value)}
                      defaultValue={txtRealm}
                    /> 
                    <div className='mt-1'>
                      <Button className='mt-5 float-start' onClick={register}>
                        LogIn
                      </Button>
                      <Button
                        className='mt-5 float-end btn-danger'
                        onClick={unregister}
                      >
                        LogOut
                      </Button>
                    </div>*/}
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
          <div
            id='dialpad'
            style={{ backgroundColor: secondaryColor }}
            hidden={
              answeredCall === 'init' || showDialPad === false ? true : false
            }
          >
            <div>
              <div className='row row-cols-3 mt-3'>
                <div className='col-4'>
                  <div
                    onClick={() => SendDTMF(1)}
                    className='button digitdial no-sub'
                  >
                    1
                  </div>
                </div>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(2)}>
                    2
                  </div>
                </div>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(3)}>
                    3
                  </div>
                </div>
              </div>
              <div className='row row-cols-3'>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(4)}>
                    4
                  </div>
                </div>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(5)}>
                    5
                  </div>
                </div>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(6)}>
                    6
                  </div>
                </div>
              </div>
              <div className='row row-cols-3'>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(7)}>
                    7
                  </div>
                </div>
                <div className='col-4'>
                  <div className='button digitdial' onClick={() => SendDTMF(8)}>
                    8
                  </div>
                </div>
                <div className='col-4' onClick={() => SendDTMF(9)}>
                  <div className='button digitdial'>9</div>
                </div>
              </div>
              <div className='row row-cols-3'>
                <div className='col-4'>
                  <div
                    className='button digitdial no-sub'
                    onClick={() => SendDTMF('*')}
                  >
                    *
                  </div>
                </div>
                <div className='col-4'>
                  <div className='row'>
                    <div
                      className='button digitdial'
                      onClick={() => SendDTMF(0)}
                    >
                      0
                    </div>
                  </div>
                </div>
                <div className='col-4'>
                  <div
                    className='button digitdial'
                    onClick={() => SendDTMF('#')}
                  >
                    #
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            hidden={
              visibleNumberTransfer === true ||
              viewNumberAttendedTransfer === true
                ? false
                : true
            }
          >
            <div className='row row-cols-1 phoneNumber mt-3'>
              <div className='input-group mb-3'>
                <input
                  className='form-control number '
                  placeholder='Type a number'
                  id='numberTransfer'
                  type='tel'
                />
                <button
                  // onClick={
                  //   visibleNumberTransfer === true
                  //     ? transfer
                  //     : makeCallForTransfer
                  // }
                  className='btn btnDelete'
                  type='button'
                  id='button-addon2'
                >
                  <i className='bi bi-telephone-forward'></i>
                </button>
              </div>
            </div>
          </div>
          <div hidden={viewBtnConfirmTransfer === false ? true : false}>
            <button
              className='btn btn-success'
              //onClick={completeTransfer}
            >
              Confirmar Transferencia
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Initiated
