import Dashboard from "./Dashboard/Dashboard";
import FooterPage from "./Footer/Footer";
import MenuPage from "./Menu/Menu";
import React from "react";
import 'antd/dist/antd.min.css';
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import './main.css'

const { Header, Sider, Content, Footer } = Layout;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mensaje: "",
      dataLogged: [],
      errors: "",
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const footerStyle = { height: "5%", lineHeight: "50%" };
    const infoLogin = this.props.infoLogin;
    infoLogin.username = infoLogin.username.toLowerCase()
    return (
      <div>
        <Layout>
          <Sider
            width={"18%"}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <MenuPage
              collapsed={this.state.collapsed}
              infoLogin={infoLogin}
            ></MenuPage>
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{ backgroundColor: "white", height: "7%" }}
            >
              {React.createElement(
                this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: this.toggle,
                  style: {
                    marginTop: "0%",
                  },
                }
              )}
              <div style={{float: 'right'}}>
              <p><strong>Usuario:</strong> {infoLogin.username}</p>

              </div>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "10px 10px",
                padding: 10,
                height: "100%",
                minHeight: "100vh",
              }}
            >
              <Dashboard infoLogin={infoLogin} />
            </Content>
            <Footer style={footerStyle} className="text-center">
              <FooterPage></FooterPage>
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Main;
