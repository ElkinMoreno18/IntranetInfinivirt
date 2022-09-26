import Comisiones from './Comisiones/Comisiones.js'
import Reportes from './Reportes/Reportes'
import RTL from './RTL/RTL'
import SBC from './SBC/sbc'
import WebRTC from './WebRTC/webRTC.js'
import WebRTCOld from './WebRTC/Initiated/initiated'
import WebRTCSTUN from './WebRTC/Initiated/Test Jssip'
import WebRTCSIPML from './WebRTC SIPML5/webRTC'
import WebRTCSIPUDP from './WebRTC SIPML5/SIPJSUDP'
import React from 'react'
import CosteoProductos from './ProductosYSoluciones/costeoProductos'
import { Route, Routes } from 'react-router-dom'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const infoLogin = this.props.infoLogin
    return (
      <>
        <script src='logo.js' />

        <Reportes></Reportes>
        <Routes>
          <Route
            path='Comisiones'
            element={<Comisiones infoLogin={infoLogin} />}
          ></Route>
          <Route path='RTL' element={<RTL infoLogin={infoLogin}></RTL>}></Route>
          <Route path='SBC' element={<SBC infoLogin={infoLogin}></SBC>}></Route>
          <Route path='WebRTC' element={<WebRTC></WebRTC>}></Route>
          <Route path="CotizadorPyS" element={<CotizadorPyS></CotizadorPyS>}></Route>
        </Routes>
      </>
    )
  }
}

export default Dashboard
