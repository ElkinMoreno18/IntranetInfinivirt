import React from "react";
import Ventas from "./Ventas/Ventas";
import Margenes from "./Margenes/Margenes";
import Vendors from "./Vendors/Vendors";
import { Route, Routes } from "react-router-dom";


class Reportes extends React.Component {
  render() {
    return (
      <>
      <Routes>
        <Route path="/Ventas" element={<Ventas />}></Route>
        <Route path="/Margenes" element={<Margenes />}></Route>
        <Route path="/Vendors" element={<Vendors />}></Route>
        </Routes>
      </>
    );
  }
}

export default Reportes;
