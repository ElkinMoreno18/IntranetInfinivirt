/* eslint-disable no-undef */
import calling from './calling.mp3'
import ringing from './ringing.mp3'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Modal } from 'antd'
import userIcon from '../InCall/userIcon.png'
import React, { useEffect, useRef, useState } from 'react'
import 'rsuite/dist/rsuite.min.css'
import Timer from './Timer'
import Icono from '../../../../../Resources/phoneIcon.png'
import './initiated.css'
import settings from '../../../../../Resources/config.ico'
import JsSIP from 'jssip'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'
import swal from 'sweetalert'
import { useLayoutEffect } from 'react'

export var call, ua
export let session, sessionOld

JsSIP.debug.enable('JsSIP:*')

var eventHandlers = {
  progress: function (e) {
    console.log('call is in progress')
  },
  failed: function (e) {
    console.log(e)
    console.log('call failed with cause: ' + e.cause)
  },
  ended: function (e) {
    console.log('call ended with cause: ' + e.cause)
  },
  addstream: function (e) {
    console.log('Add stream (event handlers)')
  },
  ended: function (e) {
    console.log(
      'call ended with cause: ' + (e.data ? e.data.cause : 'no cause')
    )
  }
}

var options = {
  eventHandlers: eventHandlers,
  mediaConstraints: { audio: true, video: false },
  pcConfig: {
    rtcpMuxPolicy: 'negotiate'
  },
  sessionTimersExpires: 7200
}

function Initiated () {
  const [numberPhone, setNumberPhone] = useState('')
  const [txtCallIn, setTxtCallIn] = useState('WebRTC Infinivirt')
  const [txtInButton, setTxtInButton] = useState('Call')
  const [answeredCall, setAnsweredCall] = useState('init')
  const [mute, setMute] = useState(false)
  const [hold, setHold] = useState(false)

  /*   const [txtRealm, setTxtRealm] = useState(
    localStorage.getItem('org.doubango.identity.realm')
  ) //Dominio */
  /*   const [txtPrivateId, setTxtPrivateId] = useState(
    localStorage.getItem('org.doubango.identity.impi')
  ) //usuario */
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
  const [showTimer, setShowTimer] = useState(false) // controla el estado del tiempo de la llamada, para mostrarlo o ocultarlo
  const [modalModify, setModalModify] = useState(false)
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

  const AudioIn = new Audio(ringing)
  AudioIn.loop = true

  const handleOk = () => setModalModify(false)
  const handleCancel = () => setModalModify(false)

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

  function saveCredentials () {
    if (localStorage) {
      localStorage.setItem('infinivirt.webRTC.display_name', txtDisplayName)
      localStorage.setItem('infinivirt.webRTC.sip', txtPublicId)
      localStorage.setItem('infinivirt.webRTC.password', txtPassword)
    }
  }

  ///////////// JS SIP /////////////

  function register () {
    var socket = new JsSIP.WebSocketInterface('wss://10.10.101.221:8089/ws')
    // var socket = new JsSIP.WebSocketInterface('wss://mybilling.infinivirt.com/webrtc/')

    var configuration = {
      sockets: [socket],
      uri: 'sip:' + txtPublicId + '@10.10.101.221',
      password: txtPassword,
      ws_servers: 'wss://10.10.101.221:8089/ws',
      realm: '10.10.101.221',
      display_name: txtDisplayName,
      contact_uri: 'sip:' + txtPublicId + '@10.10.101.221',
      user_agent: 'WebRTC Infinivirt'
    }

    /*    var configuration = {
      sockets: [socket],
      uri: 'sip:' + txtPublicId + '@10.10.101.90',
      password: txtPassword,
      ws_servers: 'wss://10.10.101.90:8089/ws',
      realm: '10.10.101.90',
      contact_uri: 'sip:' + txtPublicId + '@10.10.101.90',
      display_name: txtDisplayName,
      user_agent: 'WebRTC Infinivirt'
    } */

    /*   var configuration = {
      sockets: [socket],
      uri: 'sip:Test_Jesus_WebRTC@208.89.104.141',
      password: 'xochswv6',
      ws_servers: 'wss://mybilling.infinivirt.com/webrtc/',
      realm: '208.89.104.141',
      contact_uri: 'sip:Test_Jesus_WebRTC@208.89.104.141',
      //authorization_user: '1801',
      display_name: 'Test_Jesus_WebRTC',
      // register: true,
      user_agent: 'WebRTC Infinivirt'
      //sessionTimers: false
    }  
 */

    /* if (stateRegister === false) {
      ua = new JsSIP.UA(configuration)
      ua.start()
      saveCredentials()
    } else {
      toast.warning('Register already success', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
    } */

    ua = new JsSIP.UA(configuration)
    ua.start()
    saveCredentials()

    // Register callbacks to desired call events

    ua.on('connecting', ev => {
      console.log('UA "connecting" event')
      console.log(ev)
    })

    ua.on('connected', e => {
      console.log('UA is connected')
      console.log(e)
    })
    ua.on('disconnected', ev => {
      console.log('UA "disconnected" event')
      console.log(ev)
    })
    ua.on('registered', data => {
      console.log('UA "registered" event', data)
      if (stateRegister === false) {
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
      setStateRegister(true)
    })
    ua.on('unregistered', data => {
      console.log('UA "unregistered" event')
      toast.success('Unregister Successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
      setStateRegister(false)
    })
    ua.on('registrationFailed', data => {
      console.log('UA "registrationFailed" event')
      toast.warning('Register Failed', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
      console.log(data)
    })
    ua.on('registrationExpiring', data => {
      console.log('Expirando Registro')
      console.log(data)
    })
    ua.on('newRTCSession', function (e) {
      console.log('New RTC Session')
      session = e.session
      sessionOld = session

      if (session.direction === 'incoming') {
        AudioIn.play()
        setNumberPhone(session.remote_identity.display_name)
        setTxtInButton('Answer')
        setTxtCallIn('Incoming Call')
      }

      /* if (session.direction === 'outgoing') {
        console.log(e.request + ' outgoing session')
      } else if (session.direction === 'incoming') {
        console.log(
          'Session - Incoming call from ' + session.remote_identity.display_name
        )
        setTxtCallIn('Incoming Call')
        setNumberPhone(session.remote_identity.display_name)
        setTxtInButton('Answer')
        AudioIn.play()
      } */
      session.on('peerconnection', function (data) {
        data.peerconnection.addEventListener('addstream', function (e) {
          // set remote audio stream
          var audio = document.createElement('audio')
          audio.srcObject = e.stream
          audio.play()
        })
      })
      session.on('connecting', data => {
        console.log(data)
      })
      session.on('sending', data => {
        console.log(data)
        console.log('---------------SENDING------------------')
      })
      session.on('progress', data => {
        console.log(data)
      })
      session.on('accepted', data => {
        console.log(data)
        setShowTimer(true)
        AudioIn.pause()
      })
      session.on('confirmed', data => {
        console.log(data)
      })
      session.on('ended', data => {
        setNumberPhone('')
        setTxtCallIn('WebRTC Infinivirt')
        setShowTimer(false)
        setTxtInButton('Call')
        setAnsweredCall('init')
        setShowDialPad(false)
        setVisibleNumberTransfer(false)
        AudioIn.pause()
        toast.success('Call ended', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined
        })
      })
      session.on('failed', data => {
        console.log(data)
        setNumberPhone('')
        setTxtCallIn('WebRTC Infinivirt')
        setShowTimer(false)
        setTxtInButton('Call')
        setAnsweredCall('init')
        setShowDialPad(false)
        setVisibleNumberTransfer(false)
        const promise = AudioIn.pause()
        if (promise !== undefined) {
          promise
            .then(() => {})
            .catch(error => {
              AudioIn.muted = true
              AudioIn.pause()
            })
        }
      })
      session.on('hold', data => {
        console.log(data)
      })
      session.on('reinvite', data => {
        console.log(data)
      })
      session.on('update', data => {
        console.log(data)
      })
      session.on('sdp', data => {
        console.log(data)
        /* //  var ip
        try {
          //      ip = axios.get('https://api.ipify.org?format=json')
          //console.log(ip)

          console.log('sdp', data)
          // console.log(ip)


          //if (data.originator === 'local') {
            data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/AVP')
            data.sdp = data.sdp.replace('10.10.104.155', '181.143.18.50')
             data.sdp = data.sdp.replace('a=rtpmap:109 opus/48000/2', '')
            data.sdp = data.sdp.replace('a=rtpmap:9 G722/8000/1', '') 
             data.sdp =
              'v=0\r\n' +
              'o=Infinivirt 1983 678902 IN IP4 181.143.18.50\r\n' +
              's=Infinivirt\r\n' +
              'c=IN IP4 181.143.18.50\r\n' +
              't=0 0\r\n' +
              'm=audio 35402 RTP/AVP 9 8 101 0\r\n' +
              'c=IN IP4 181.143.18.50\r\n' +
              'a=ptime:20\r\n' +
              'a=minptime:1\r\n' +
              'a=maxptime:255\r\n' +
              'a=silenceSupp:off - - - -\r\n' +
              'a=rtpmap:9 G722/8000/1\r\n' +
              'a=rtpmap:8 PCMA/8000/1\r\n' +
              'a=rtpmap:101 telephone-event/8000/1\r\n' +
              'a=ftmtp:101 0-16\r\n' +
              'a=rtpmap:0 PCMU/8000/1\r\n' +
              'a=sendrecv\r\n'
              
        data.sdp =
          'v=0\r\n' +
          'o=Infinivirt 1983 678902 IN IP4 181.143.18.50\r\n' +
          's=Infinivirt\r\n' +
          'c=IN IP4 181.143.18.50\r\n' +
          't=0 0\r\n' +
          'm=audio 57592 RTP/AVP 0 101\r\n' +
          'a=rtpmap:101 telephone-event/8000\r\n' +
          'a=rtpmap:0 PCMU/8000\r\n' +
          'a=ptime:20\r\n' +
          'a=fmtp:101 0-15\r\n' +
          'a=sendrecv\r\n'
          
*/
        // 'm=audio 51434 RTP/AVP 110 \n' +

        // data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/AVP')
        /*  } 
         } catch (error) {
          console.error(error)
        }*/

        // data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/AVP')
      })
      session.on('getusermediafailed', e => {
        console.log(e)
      })
    })

    ua.on('newMessage', e => {
      if (e.originator === 'local') console.log(' outgoing MESSAGE request ', e)
      else console.log(' incoming MESSAGE request ', e)
    })
    ua.on('sipEvent', data => {
      console.log('Evento SIP')
      console.log(data)
    })
    ua.on('newOptions', data => {
      console.log('Nuevo Options')
      console.log(data)
    })
    setModalModify(false)
  }

  useEffect(() => {
    register()
  }, [])

  function unregister () {
    if (ua) {
      ua.stop()
    }
    setModalModify(false)
  }

  function makeCall () {
    setShowDialPad(false)

    call = ua.call('sip:' + numberPhone + '@10.10.101.221', options)
    if (call) {
      call.connection.addEventListener('addstream', e => {
        var audio = document.createElement('audio')
        audio.srcObject = e.stream
        audio.play()
      })
      setAnsweredCall('calling')
    }

    call.on('ring', e => {
      console.log('Ringing' + e)
    })
    call.on('progress', e => {
      console.log(e)
    })
    call.on('accepted', e => {
      setShowTimer(true)
    })
    call.on('reject', e => {
      console.log('Rejected' + e)
      toast.warning('Call Rejected', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
      setVisibleNumberTransfer(false)
    })
    call.on('answer', e => {
      console.log('Answered' + e)
      //setShowTimer(true)
    })
    call.on('failure', e => {
      console.log('Failured' + e)
    })
    call.on('ended', () => {
      setShowTimer(false)
    })
  }

  function makeCallForTransfer () {
    setShowDialPad(false)
    var numberTransfer = document.getElementById('numberTransfer').value

    call = ua.call('sip:' + numberTransfer + '@10.10.101.221', options)
    if (call) {
      call.connection.addEventListener('addstream', e => {
        var audio = document.createElement('audio')
        audio.srcObject = e.stream
        audio.play()
      })
      setAnsweredCall('calling')
    }

    call.on('ring', e => {
      console.log('Ringing' + e)
    })
    call.on('progress', e => {
      console.log(e)
    })
    call.on('accepted', e => {
      setShowTimer(true)
    })
    call.on('reject', e => {
      console.log('Rejected' + e)
      toast.warning('Call Rejected', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      })
      setVisibleNumberTransfer(false)
    })
    call.on('answer', e => {
      console.log('Answered' + e)
      //setShowTimer(true)
    })
    call.on('failure', e => {
      console.log('Failured' + e)
    })
    call.on('ended', () => {
      setShowTimer(false)
    })
  }

  function hangUp () {
    /* if (call) {
      call.terminate()
    } else if (session) {
      session.terminate()
    } */
    session.terminate()
    setShowDialPad(false)
    console.log('**********LLAMADA TERMINADA*********')
    setNumberPhone('')
    setTxtCallIn('WebRTC Infinivirt')
    setShowTimer(false)
    setTxtInButton('Call')
    setAnsweredCall('init')
    setVisibleNumberTransfer(false)
    setViewNumberAttendedTransfer(false)
    setViewBtnConfirmTransfer(false)
  }

  function muted () {
    if (mute === false) {
      if (call) {
        call.mute()
        setMute(true)
      }
      if (session) {
        session.mute()
        setMute(true)
      }
    }

    if (mute === true) {
      if (call) {
        call.unmute()
        setMute(false)
      }
      if (session) {
        session.unmute()
        setMute(false)
      }
    }
  }

  function holdResume () {
    if (hold === false) {
      if (call) {
        call.hold()
      }
      if (session) {
        session.hold()
      }
      setHold(true)
    }
    if (hold === true) {
      if (call) {
        call.unhold()
      }
      if (session) {
        session.unhold()
      }
      setHold(false)
    }
  }

  function rejectCall () {
    AudioIn.pause()
    session.terminate()
    setNumberPhone('')
    setTxtCallIn('WebRTC Infinivirt')
    setShowTimer(false)
    setTxtInButton('Call')
    setAnsweredCall('init')
    setShowDialPad(false)
    setVisibleNumberTransfer(false)
    setViewNumberAttendedTransfer(false)
  }

  function transfer () {
    var numberTransfer = document.getElementById('numberTransfer').value
    if (call) {
      call.refer('sip:' + numberTransfer + '@10.10.101.221', options)
    }
    if (session) {
      session.refer('sip:' + numberTransfer + '@10.10.101.221', options)
    }
    setVisibleNumberTransfer(false)
  }

  var optionsTransfer = {
    replaces: sessionOld
  }

  function attendedTransfer () {
    session.hold()
    setViewBtnConfirmTransfer(true)
    setViewNumberAttendedTransfer(true)
  }

  function completeTransfer () {
    attendedTransferRefer()
  }

  function attendedTransferRefer () {
    session.refer(sessionOld.remote_identity.uri, optionsTransfer)
    setViewBtnConfirmTransfer(false)
    setViewNumberAttendedTransfer(false)
  }

  function answer () {
    setAnsweredCall('calling')
    setShowDialPad(false)
    session.answer(options)
  }

  function ShowDialPad () {
    setShowDialPad(!showDialPad)
  }

  function SendDTMF (number) {
    if (session) {
      session.sendDTMF(number)
    }
  }

  return (
    <>
      <div tabIndex='0' onKeyDown={e => detectKeyPress(e)}>
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
            <ToastContainer />
            <div className='row row-cols-1 mt-3'>
              {txtInButton === 'Call' ? (
                <div className='col-12'>
                  <button
                    type='button'
                    id='btnCall'
                    className='btn btn-success w-100'
                    onClick={makeCall}
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
              {showTimer === true ? <Timer></Timer> : ''}
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
                  onClick={() => setVisibleNumberTransfer(true)}
                >
                  <i className='bi bi-arrow-up-circle'></i>
                  <p>Transfer</p>
                </button>
              </div>
              <div className='col-4'>
                <button
                  className='btn acciones h-100'
                  id='btnMute'
                  onClick={ShowDialPad}
                >
                  <i className='bi bi-grid-3x3-gap-fill'></i>
                  <p>Dialpad</p>
                </button>
              </div>
              <div className='col-4'>
                <button
                  className='btn acciones h-100'
                  id='btnRecord'
                  onClick={attendedTransfer}
                >
                  <i className='bi bi-record-circle'></i>
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
            onClick={unregister}
          >
            Unregister
          </Button>,
          <Button
            className='btn btn-success'
            key={'registerbtn'}
            onClick={register}
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
                      onChange={event => setTxtDisplayName(event.target.value)}
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
        hidden={answeredCall === 'init' || showDialPad === false ? true : false}
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
                <div className='button digitdial' onClick={() => SendDTMF(0)}>
                  0
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div className='button digitdial' onClick={() => SendDTMF('#')}>
                #
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        hidden={
          visibleNumberTransfer === true || viewNumberAttendedTransfer === true
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
            {console.log('visibleNumberTransfer', visibleNumberTransfer)}
            <button
              onClick={
                visibleNumberTransfer === true ? transfer : makeCallForTransfer
              }
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
        <button className='btn btn-success' onClick={completeTransfer}>
          Confirmar Transferencia
        </button>
      </div>
    </>
  )
}

export default Initiated
