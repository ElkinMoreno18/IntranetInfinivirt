import JsSIP from 'jssip'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'


JsSIP.debug.enable('JsSIP:*')

var call, session, holded_session, ua

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

/*import { Modal } from 'antd'
import userIcon from '../InCall/userIcon.png'
// import React, { useEffect, useState } from 'react'
import 'rsuite/dist/rsuite.min.css'
import Timer from '../Initiated/Timer'
import Icono from '../../../../../Resources/phoneIcon.png'
import '../Initiated/initiated.css'
import settings from '../../../../../Resources/config.ico'
import JsSIP from 'jssip'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'

 export var call
export let session
export var holded_session = []
var ua


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
}*/

const e = React.createElement

class Initiated extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      liked: false,
      txtPublicId: '',
      txtPassword: '',
      txtDisplayName: '',
      numberPhone: '',
      txtCallIn: 'C2C Infinivirt',
      showTimer: false,
      txtInButton: 'Call',
      answeredCall: 'init',
      showDialPad: false,
      visibleNumberTransfer: false,
      stateRegister: false
    }
  }
  /* const [numberPhone, setNumberPhone] = useState('')
  const [txtCallIn, setTxtCallIn] = useState('C2C Infinivirt')
  const [txtInButton, setTxtInButton] = useState('Call')
  const [answeredCall, setAnsweredCall] = useState('init')
  const [mute, setMute] = useState(false)
  const [hold, setHold] = useState(false)

  const [liked, setLiked] = useState(false)

     const [txtRealm, setTxtRealm] = useState(
    localStorage.getItem('org.doubango.identity.realm')
  ) //Dominio */
  /*   const [txtPrivateId, setTxtPrivateId] = useState(
    localStorage.getItem('org.doubango.identity.impi')
  ) //usuario 
  const [txtPublicId, setTxtPublicId] = useState('sip:1801@10.10.101.90') //sip
  const [txtPassword, setTxtPassword] = useState('temp1234') //contraseña
  const [txtDisplayName, setTxtDisplayName] = useState('1801') // usuario
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

  const handleOk = () => setModalModify(false)
  const handleCancel = () => setModalModify(false)

  function getNumberDialPad (number) {
    setNumberDialPad(number)
  }

  */

  ///////////// JS SIP /////////////

  register () {
    var socket = new JsSIP.WebSocketInterface('wss://10.10.101.90:8089/ws')
    // var socket = new JsSIP.WebSocketInterface('wss://mybilling.infinivirt.com/webrtc/')

    var configuration = {
      sockets: [socket],
      uri: this.state.txtPublicId,
      password: this.state.txtPassword,
      ws_servers: 'wss://10.10.101.90:8089/ws',
      realm: '10.10.101.90',
      contact_uri: this.state.txtPublicId,
      display_name: this.state.txtDisplayName,
      user_agent: 'C2C Infinivirt'
    }

    if (this.state.stateRegister === false) {
      ua = new JsSIP.UA(configuration)
      ua.start()
      // saveCredentials()
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
    }

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
      if (this.state.stateRegister === false) {
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
      this.setState({
        stateRegister: false
      })
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
      this.setState({
        stateRegister: false
      })
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
      console.trace('new rtc session created - incoming or outgoing call')

      session = e.session
      holded_session.push(session)

      if (session.direction === 'outgoing') {
        console.trace(e.request + ' outgoing session')
      } else if (session.direction === 'incoming') {
        console.log(
          'Session - Incoming call from ' + session.remote_identity.display_name
        )
        var sRemoteNumber = session.remote_identity.display_name || 'unknown' //obtiene el numero remoto
        this.setState({
          txtCallIn: 'Incoming Call',
          numberPhone: sRemoteNumber,
          txtInButton: 'Answer'
        })
      }
      session.on('addstream', e => {})
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
      })
      session.on('icecandidate', event => {})
      session.on('confirmed', data => {
        console.log(data)
      })
      session.on('ended', data => {
        this.setState({
          numberPhone: '',
          txtCallIn: 'C2C Infinivirt',
          showTimer: false,
          txtInButton: 'Call',
          answeredCall: 'init',
          showDialPad: false,
          visibleNumberTransfer: false
        })
      })
      session.on('failed', data => {
        console.log(data)
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
      })
      session.on('getusermediafailed', e => {
        console.log(e)
      })
    })

    ua.on('newMessage', e => {
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

    //setModalModify(false)
  }

  /* eslint-disable */
  /* useEffect(() => {
    register()
  }, []) */

  componentDidMount () {
    this.register()
  }

  unregister () {
    ua.stop()
   // setModalModify(false)
  }

  makeCall () {
    call = ua.call('sip:573125087580@10.10.101.221', options)
    //setShowDialPad(false)

    if (call) {
      console.log('Connection is valid')
      call.connection.addEventListener('addstream', e => {
        var audio = document.createElement('audio')
        audio.srcObject = e.stream
        audio.play()
      })
     // setAnsweredCall('calling')
    }

    call.on('ring', e => {
      console.log('Ringing' + e)
    })
    call.on('progress', e => {
      console.log(e)
    })
    call.on('accepted', e => {
     // setShowTimer(true)
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
     // setVisibleNumberTransfer(false)
    })
    call.on('answer', e => {
      console.log('Answered' + e)
      //setShowTimer(true)
    })
    call.on('failure', e => {
      console.log('Failured' + e)
    })
  }

  /*

  function hangUp () {
    if (call) {
      call.terminate()
    } else if (session) {
      session.terminate()
    }
    setShowDialPad(false)
    console.log('**********LLAMADA TERMINADA*********')
    setNumberPhone('')
    setTxtCallIn('C2C Infinivirt')
    setShowTimer(false)
    setTxtInButton('Call')
    setAnsweredCall('init')
    setVisibleNumberTransfer(false)
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
    session.terminate()
    setNumberPhone('')
    setTxtCallIn('WebRTC Infinivirt')
    setShowTimer(false)
    setTxtInButton('Call')
    setAnsweredCall('init')
    setShowDialPad(false)
    setVisibleNumberTransfer(false)
  }

  function answer () {
    session.answer(options)
    setAnsweredCall('calling')
    setShowDialPad(false)
  }

  function transfer () {
    console.log('Transfer')

    var numberTransfer = document.getElementById('numberTransfer').value
    if (call) {
      call.refer('sip:' + numberTransfer + '@10.10.101.56', options)
    }
    if (session) {
      session.refer('sip:' + numberTransfer + '@10.10.101.56', options)
    }
    setVisibleNumberTransfer(false)
  }

  function attendedTransfer () {
    console.log('attended transfer')
    var numberTransfer = document.getElementById('numberTransfer').value
    session.hold()
    var secondcall = ua.call('sip:' + numberTransfer + '@10.10.101.56', options)

    var opt = {
      replaces: secondcall,
      eventHandlers: eventHandlers,
      mediaConstraints: { audio: true, video: false }
    }
    if (mute === true) {
      session.refer(secondcall.remote_identity.uri, opt)
    }
    setVisibleNumberTransfer(false)
  }

  function ShowDialPad () {
    setShowDialPad(!showDialPad)
  }

  function SendDTMF (number) {
    if (call) {
      call.sendDTMF(number)
    }
    if (session) {
      session.sendDTMF(number)
    }
  }
  */
  render () {
    if (this.state.liked) {
      return 'You liked this.'
    }

    return e(
      'button',
      {
        id: 'btnC2C',
        type: 'button',
        className: 'btn btn-success',
        onClick: () => this.makeCall
      },
      'Call'
    )
  }
}

{
  /*  <>
    <button
              type='button'
              id='btnC2C'
              className='btn btn-success'
              onClick={call}
            >
              <i class='bi bi-telephone-forward-fill'></i>
            </button>
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
            </div>
            <ToastContainer />
            <div className='row row-cols-1 mt-3'>
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
                  onClick={() => setViewNumberAttendedTransfer(true)}
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
            <button
              onClick={
                visibleNumberTransfer === true ? transfer : attendedTransfer
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
    </>
  )*/
}

//export default Initiated

const domContainer = document.querySelector('#like_button_container')
const root = ReactDOM.createRoot(domContainer)
root.render(e(Initiated))
