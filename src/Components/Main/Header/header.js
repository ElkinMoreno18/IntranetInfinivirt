import React from "react";
import logo from "../../../infinivirt_logo.png";

class Header extends React.Component {
  render() {
    <link
      type="text/css"
      href="http://fonts.googleapis.com/css?family=Lato:400,700"
    />;

    const headerStyle = { backgroundColor: "#09294F", height: "10%" };
    const imageStyle = { marginLeft: "2%", marginTop: "-2%", width: "60%" };
    const textStyle = { fontFamily: "Lato", fontWeight: "700", fontSize: "120%", width: "80%", textAlign: "left" };

    return (
      <>
        <nav
          className="navbar navbar-expand-lg navbar-light shadow"
          style={headerStyle}
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src={logo} alt="Logo Infinivirt" style={imageStyle} />
            </a>
            <strong className="text-white" style={textStyle}>
              INTRANET
            </strong>
          </div>
        </nav>
      </>
    );
  }
}

export default Header;
