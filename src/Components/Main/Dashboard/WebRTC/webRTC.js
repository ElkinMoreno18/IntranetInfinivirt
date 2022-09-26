import TestJssip from './Initiated/Test Jssip'
import JsSipAudiocodes from './Initiated/Jssip Audiocodes'
import Initiated from './Initiated/initiated'
import './webRTC.css'

import React from 'react'

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

    return (
      <>
        <div className='container-fluid'>
          <div
            className='mx-auto mt-2 text-center contenedor col-10 col-sm-8 col-md-8 col-lg-6 col-xl-5 col-xxl-4'
            id='contenedor'
          >
            <JsSipAudiocodes getDataCall={this.getDataCall} />
          </div>
        </div>
      </>
    )
  }
}
