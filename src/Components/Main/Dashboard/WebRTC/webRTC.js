import InCall from './InCall/inCall'
import TestJssip from './Initiated/Test Jssip'
import './webRTC.css'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

export default class webRTC extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      state: '',
      numberPhone: '',
      callSession: '',
      audioDOM: ''
    }
    this.getDataCall = this.getDataCall.bind(this)
  }

  getDataCall = (value, number, callSession, audioDOM) => {
    this.setState({
      state: value,
      numberPhone: number,
      callSession: callSession,
      audioDOM: audioDOM
    })
  }

  render () {
    var estadoLlamada = this.state.state
    var numberPhone = this.state.numberPhone

    return (
      <>
        <div className='container-fluid'>
          <div
            className='mx-auto mt-2 text-center contenedor col-10 col-sm-8 col-md-8 col-lg-6 col-xl-5 col-xxl-4'
            id='contenedor'
          >
            {estadoLlamada === '' || estadoLlamada === 'completed' ? (
              <TestJssip getDataCall={this.getDataCall} />
              // <C2C getDataCall={this.getDataCall}></C2C>
             // <script src='C:\Users\elkin.moreno\Desktop\Backend_Frontend_v2.0.1\Intranet_Infinivirt_Frontend_v2.0.1\src\Components\Main\Dashboard\WebRTC\C2C\c2c.js'></script>

            /*   <>
                <div id='like_button_container'></div>
             <script src='C:\Users\elkin.moreno\Desktop\Backend_Frontend_v2.0.1\Intranet_Infinivirt_Frontend_v2.0.1\src\Components\Main\Dashboard\WebRTC\C2C\c2c.js'></script>
              </> */
            ) : (
              ''
            )}
            {/*  <button
              type='button'
              id='btnC2C'
              className='btn btn-success'
              onClick={call}
            >
              <i class='bi bi-telephone-forward-fill'></i>
            </button> */}

            {estadoLlamada === 'initiated'
              ? {
                  /* <InCall
                getDataCall={this.getDataCall}
                numberPhone={numberPhone}
                callSession={this.state.callSession}
                audioDOM={this.state.audioDOM}
              ></InCall> */
                }
              : ''}
          </div>
        </div>
      </>
    )
  }
}
