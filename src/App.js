import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { Component } from 'react'
import Main from './Components/Main/main'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from './Resources/Infinivirt_blanco.png'
import User from './Resources/Usuario.svg'
import Password from './Resources/Password.svg'
import swal from 'sweetalert'

var CryptoJS = require('crypto-js')

var url_base = process.env.REACT_APP_DB_HOST

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      status: false,
      datos: []
    }
  }

  onChangeUsername (username) {
    this.setState({
      username: username.trim()
    })
  }

  onChangePassword (password) {
    this.setState({
      password: password.trim()
    })
  }

  pulsarEnter (e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      document.getElementById('loginBtn').click()
    }
  }

  sendDataLogin (ev) {
    const username = this.state.username.toLowerCase()
    const password = this.state.password

    var cipherTextPass = CryptoJS.AES.encrypt(
      password,
      'intrainfinivirt'
    ).toString()

    let header = {
      withCredentials: true,
    }
    var request = '/api/session/login'

    if (username === '' || password === '') {
      swal('Campos requeridos', 'Por favor, digite todos los campos', 'info')
    }
    axios
      .post(url_base + request, { username, cipherTextPass }, header)
      .then(res => {
        this.setState({
          status: true,
          datos: res.data
        })
        if (res.data.login === false) {
          swal('Error', 'Credenciales Incorrectas', 'error')
        }
      })
  }

  consultIsLogged () {
    var request = '/api/session/isLogged'
    axios
      .get(url_base + request, { withCredentials: true })
      .then(res => {
        this.setState({
          dataLogged: res.data
        })
      })
      .catch(err => {
        if (err.response) {
          this.setState({
            errors: err.response.status
          })
        }
      })
  }

  componentDidMount () {
    this.consultIsLogged()
  }

  render () {
    var data = this.state.datos
    var dataLogin = this.state.dataLogged

    if (dataLogin !== undefined) {
      if (dataLogin.login === true) {
        this.state.username = dataLogin.username
        return <Main infoLogin={this.state}></Main>
      }
    }

    if (data.login === true) {
      return <Main infoLogin={this.state}></Main>
    } else {
      return (
        <>
        <div id='totalContainer'>
          <div className='col-8' style={{ float: 'left' }}>
            <div className='container'>
              <img
                alt='Logo Inicial'
                src={Logo}
                id='LogoInicial'
                style={{ width: '50%', marginTop: '20%', marginLeft: '25%' }}
              ></img>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
              <div className='circle-container'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
          <div className='registration-form col-4'>
            <h5 id='encabezado'>Iniciar Sesion</h5>
            <div className='form-group secondary'>
              <div className='row justify-content-center mt-4'>
                <div className='col-10 col-md-10'>
                  <div className='input-group flex-nowrap'>
                    <div className='input-group-prepend'>
                      <span className='input-group-text' id='iconUser'>
                        <i className='fa fa-user bigicon'></i>
                      </span>
                    </div>
                    <input
                      type='text'
                      className='form-control item input'
                      placeholder='Usuario'
                      style={{ borderLeft: 'none' }}
                      value={this.state.username}
                      onChange={ev => this.onChangeUsername(ev.target.value)}
                      onKeyUp={e => this.pulsarEnter(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*  <div className='input-wrapper initial'>
              <img
                alt='LogoUser'
                id='logoUser'
                className='input-icon'
                src={User}
              />
              <input
                type='text'
                className='form-control item input'
                placeholder='Usuario'
                style={{ paddingLeft: '10%' }}
                value={this.state.username}
                onChange={ev => this.onChangeUsername(ev.target.value)}
                onKeyUp={e => this.pulsarEnter(e)}
              />
            </div> */}
            <div className='form-group secondary'>
              <div className='row justify-content-center mt-4'>
                <div className='col-10 col-md-10'>
                  <div className='input-group flex-nowrap'>
                    <div className='input-group-prepend'>
                      <span className='input-group-text' id='iconKey'>
                        <i className='fa fa-key'></i>
                      </span>
                    </div>
                    <input
                      id='password'
                      type='password'
                      className='form-control input'
                      placeholder='Contraseña'
                      value={this.state.password}
                      onChange={ev => this.onChangePassword(ev.target.value)}
                      onKeyUp={e => this.pulsarEnter(e)}
                      style={{ borderLeft: 'none', borderRight: 'none' }}
                    />
                    <div
                      onClick={() => {
                        var tipo = document.getElementById('password')
                        var iconEye = document.getElementById('changeIconEye')
                        if (tipo.type == 'password') {
                          tipo.type = 'text'
                          iconEye.className = 'fa fa-eye-slash bigicon'
                        } else {
                          tipo.type = 'password'
                          iconEye.className = 'fa fa-eye bigicon'
                        }
                      }}
                      className='input-group-append'
                    >
                      <span className='input-group-text' id='iconEye'>
                        <i className='fa fa-eye bigicon' id='changeIconEye'></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='input-wrapper secondary'>
              <img
                alt='LogoPass'
                id='logoPass'
                className='input-icon'
                src={Password}
                onClick={() => {
                  var tipo = document.getElementById('password')
                  if (tipo.type == 'password') {
                    tipo.type = 'text'
                  } else {
                    tipo.type = 'password'
                  }
                }}
              />
              <input
                id='password'
                type='password'
                className='form-control item input'
                placeholder='Contraseña'
                value={this.state.password}
                style={{ paddingLeft: '10%' }}
                onChange={ev => this.onChangePassword(ev.target.value)}
                onKeyUp={e => this.pulsarEnter(e)}
              />
            </div>
 */}
            <div className='form-group'>
              <button
                type='submit'
                className='btn login'
                id='loginBtn'
                onClick={ev => this.sendDataLogin(ev)}
              >
                <span>Iniciar Sesion</span>
              </button>
            </div>
            <h6 style={{ marginTop: '20%', textAlign: 'center' }}>
              &copy; Infinivirt 2022
            </h6>
          </div>
          </div>
        </>
      )
    }
  }
}

export default App
