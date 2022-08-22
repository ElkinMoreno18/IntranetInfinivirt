import Comisiones from "./Comisiones/Comisiones.js";
import Reportes from "./Reportes/Reportes";
import RTL from "./RTL/RTL";
import SBC from "./SBC/sbc";
import WebRTC from "./WebRTC/webRTC.js";
import React from "react";
import CosteoProductos from './ProductosYSoluciones/costeoProductos'
import { Route, Routes } from "react-router-dom";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const infoLogin = this.props.infoLogin;
    return (
      <>
            <script src='logo.js' />

        <Reportes></Reportes>
        <Routes>
          <Route
            path="Comisiones"
            element={<Comisiones infoLogin={infoLogin} />}
          ></Route>
          <Route path="RTL" element={<RTL infoLogin={infoLogin}></RTL>}></Route>
          <Route path="SBC" element={<SBC infoLogin={infoLogin}></SBC>}></Route>
          <Route path="WebRTC" element={<WebRTC></WebRTC>}></Route>
          <Route path="CosteoProductos" element={<CosteoProductos></CosteoProductos>}></Route>
        </Routes>
      </>
    );
  }
}

export default Dashboard;
