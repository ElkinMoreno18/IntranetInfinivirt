import React from 'react'
import Icono from '../../../../../Resources/phoneIcon.png'
import './inCall.css'
import userIcon from './userIcon.png'

var audioDOM = document.querySelector('audio')

export default class InCall extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stateCall: '',
      callSession: '',
    }
  }

  /// COLGAR LLAMADA

  HangUp () {
    var callSession = this.props.callSession
    var numberPhone = this.props.numberPhone
    if (callSession) {
      callSession.hangup()
      console.log('**********LLAMADA TERMINADA*********')
    }
    this.setState({
      callSession: callSession
    })
    this.props.getDataCall('completed',numberPhone,callSession, audioDOM)
  }

 

  render () {
    var numberPhone = this.props.numberPhone

    var callSession = this.props.callSession
    console.log(callSession)

    //audioDOM = (remote_stream_audio.current) // captura una sola vez el id de la equita audio para poder usarse

    return (
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
            <button className='btn acciones h-75' id='btnPause'>
              <i className='bi bi-pause-fill'></i>
              <p>Pause</p>
            </button>
          </div>
          <div className='col-4 '>
            <button className='btn acciones h-75' id='btnMute'>
              <i className='bi bi-mic-mute-fill'></i>
              <p>Mute</p>
            </button>
          </div>
          <div className='col-4'>
            <button className='btn acciones h-75' id='btnRecord'>
              <i className='bi bi-record-circle'></i>
              <p>Record</p>
            </button>
          </div>
        </div>
        <div className='row row-cols-3 mt-3'>
          <div className='col-4'>
            <button className='btn acciones h-75' id='btnPause'>
              <i className='bi bi-pause-fill'></i>
              <p>Pause</p>
            </button>
          </div>
          <div className='col-4'>
            <button className='btn acciones h-75' id='btnMute'>
              <i className='bi bi-mic-mute-fill'></i>
              <p>Mute</p>
            </button>
          </div>
          <div className='col-4'>
            <button className='btn acciones h-75' id='btnRecord'>
              <i className='bi bi-record-circle'></i>
              <p>Record</p>
            </button>
          </div>
        </div>
        <div className='row row-cols-1 mt-4'>
          <div className='col-12'>
            <button
              type='button'
              id='btnHang'
              className='btn btn-danger w-100'
              onClick={() => this.HangUp('completed', numberPhone, this.state.callSession)}
            >
              Hang Up
            </button>
          </div>
        </div>
        <audio hidden autoPlay controls ref={audioDOM}></audio>
      </>
    )
  }
}
