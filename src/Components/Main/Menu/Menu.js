import React, { useState } from 'react'
import logoTotal from '../../../Resources/infinivirt_logo.png'
import logoSmall from '../../../Resources/nube_infinivirt.png'
import '../Menu/styles.css'
import 'antd/dist/antd.min.css'
import { Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  HomeOutlined,
  ReconciliationOutlined,
  AreaChartOutlined,
  SolutionOutlined,
  PhoneOutlined,
  DownloadOutlined,
  DashboardOutlined,
  HistoryOutlined,
  HddOutlined,
  DollarOutlined,
  CalculatorOutlined,
  CloudServerOutlined,
  PercentageOutlined
} from '@ant-design/icons'

const { SubMenu } = Menu

var url_base = process.env.REACT_APP_DB_HOST

const MenuPage = props => {
  const history = useNavigate()
  var collapsed = props.collapsed
  const [selectedMenuItem, setSelectedMenuItem] = useState('item1')
  var infoLogin = props.infoLogin

  const logout = () => {
    var request = '/api/session/logout'
    axios.get(url_base + request, { withCredentials: true }).then(res => {})
    history('/')
    window.location.reload(true)
  }

  var hiddenComitions = false

  if (
    infoLogin.username === 'leidy.tangarife' ||
    infoLogin.username === 'andres.mesa' ||
    infoLogin.username === 'sergio.munoz' ||
    infoLogin.username === 'carolina.posada' ||
    infoLogin.username === 'maria.zapata' ||
    infoLogin.username === 'manuela.calle' ||
    infoLogin.username === 'juanpablo.tejada' ||
    infoLogin.username === 'jorge.arango'
  ) {
    hiddenComitions = false
  } else {
    hiddenComitions = true
  }

  var showAll = false

  if (
    infoLogin.username === 'ingry.marquez' ||
    infoLogin.username === 'jacob.moritz' ||
    infoLogin.username === 'elkin.moreno' ||
    infoLogin.username === 'jesus.montoya' ||
    infoLogin.username === 'jorge.arango' ||
    infoLogin.username === 'sebastian.gomez' ||
    infoLogin.username === 'davison.canaveral'
  ) {
    showAll = true
  } else {
    showAll = false
  }

  return (
    <>
      <img
        alt='Logo Infinivirt'
        src={collapsed ? logoSmall : logoTotal}
        style={
          collapsed ? {} : { width: '70%', marginInline: '15%', height: '5%' }
        }
        className='logo bg-transparent'
        id='logo'
      />
      <Menu
        selectedKeys={selectedMenuItem}
        onClick={e => setSelectedMenuItem(e.key)}
        theme='dark'
        mode='inline'
        defaultSelectedKeys={['1']}
      >
        <Menu.Item key='1' icon={<HomeOutlined />}>
          <Link to='/Home' /> Dashboard
        </Menu.Item>
        <SubMenu key='sub1' icon={<ReconciliationOutlined />} title='Reportes'>
          <Menu.Item key='3' icon={<AreaChartOutlined />}>
            <Link to='/Ventas' />
            Informe de Ventas
          </Menu.Item>
          <Menu.Item key='4' icon={<SolutionOutlined />}>
            <Link to='/Margenes' />
            Informe de Margenes
          </Menu.Item>
          <Menu.Item key='5' icon={<PhoneOutlined />}>
            <Link to='/Vendors' />
            Informe de Vendors
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          hidden={showAll === true ? false : true}
          key='6'
          icon={<DownloadOutlined />}
        >
          <Link to='/CDRs' />
          Descarga de CDRs
        </Menu.Item>
        <Menu.Item
          hidden={showAll === true ? false : true}
          key='7'
          icon={<DashboardOutlined />}
        >
          <Link to='/CallMonitor' />
          Call Monitor
        </Menu.Item>
        <Menu.Item
          hidden={showAll === true ? false : true}
          key='8'
          icon={<HistoryOutlined />}
        >
          <Link to='/DIDs' /> Historial de DIDs
        </Menu.Item>
        <Menu.Item
          hidden={showAll === true ? false : true}
          key='9'
          icon={<HddOutlined />}
        >
          <Link to='/Activos' />
          Inventario de Activos
        </Menu.Item>
        <Menu.Item
          hidden={
            hiddenComitions === false ||
            showAll === true ||
            infoLogin.username === 'manuela.calle'
              ? false
              : true
          }
          key='10'
          icon={<DollarOutlined />}
        >
          <Link to='/Comisiones' />
          Reporte de Comisiones
        </Menu.Item>
        <Menu.Item
          hidden={
            hiddenComitions === false ||
            showAll === true ||
            infoLogin.username === 'manuela.calle'
              ? false
              : true
          }
          key='11'
          icon={<CalculatorOutlined />}
        >
          <Link to='/RTL' />
          Cotizaciones
        </Menu.Item>
        <Menu.Item
          hidden={
            showAll === true ||
            infoLogin.username === 'cristian.otalvaro' ||
            infoLogin.username === 'roman.urrego'
              ? false
              : true
          }
          key='12'
          icon={<CloudServerOutlined />}
        >
          <Link to='/SBC' />
          KPI SBCs
        </Menu.Item>
        <Menu.Item
          icon={<PercentageOutlined />}
          key='13'
          hidden={
            showAll === true ||
            infoLogin.username === 'juanpablo.tejada' ||
            infoLogin.username === 'manuela.calle'
              ? false
              : true
          }
        >
          CotizadorPyS
          <Link to='/CotizadorPyS' />
        </Menu.Item>
      </Menu>
      {collapsed ? (
        <img
          alt='Logout'
          src='https://flaticons.net/icon.php?slug_category=mobile-application&slug_icon=logout'
          width={20}
          onClick={logout}
          style={{ marginLeft: '40%', cursor: 'pointer', marginTop: '17%' }}
        ></img>
      ) : (
        <button
          onClick={logout}
          type='button'
          className=' w-75 btn btn-outline-light'
          style={{ marginLeft: '10%' }}
        >
          Cerrar Sesion
        </button>
      )}
    </>
  )
}

export default MenuPage
