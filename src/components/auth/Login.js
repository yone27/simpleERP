import React, {useState, useContext} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

const Login = (props) => {
    // State
    const [, guardarAuth] = useContext(CRMContext)
    const [credenciales, guardarCredenciales] = useState({})

    // iniciar sesion en el servidor
    const iniciarSesion = async e => {
        e.preventDefault()
        // autenticar usuario

        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales)
            
            // extraer el token y colocarlo en localStorage
            const {token} = respuesta.data
            localStorage.setItem('token', token)

            // colocarlo en el state
            guardarAuth({
                token,
                auth: true
            })

            Swal.fire(  
                'Login correcto',
                'Has iniciado sesión',
                'success'
            )

            // redirect
            props.history.push('/')

        } catch (error) {
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: error.response.data.mensaje
            })
        }
    }

    // asignar lo que el usario escribe en el state
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        })
    }

    return ( 
        <div className="login">
            <h2>Iniciar Sesión</h2>
            <div className="contenedor-formulario">
                <form onSubmit={iniciarSesion}>
                    <div className="campo">
                        <label>Email</label>
                        <input type="email"
                            name="email"
                            placeholder="Email para iniciar sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input type="password"
                            name="password"
                            placeholder="Password para iniciar sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <p>
                        User: test@test.com
                        Pass: 123456
                    </p>
                    <input type="submit" value="iniciar sesión" className="btn btn-azul btn-block"/>
                </form>
            </div>
        </div>
    );
}
 
export default withRouter(Login);