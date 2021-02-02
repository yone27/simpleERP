import React, {Fragment, useState, useEffect, useContext} from 'react';
import Swal from 'sweetalert2'
import {withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios'
import { CRMContext } from '../../context/CRMContext'

function EditarCliente(props) {
    // VARS
    const {id} = props.match.params
    
    // State
    const [cliente, datosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    })
    const [auth] = useContext(CRMContext)
    
    // useEffect, cuando el componente carga act etc
    useEffect(()=> {
        // Query a la API
        const consultarAPI = async() => {
            if(auth.token !== '') {
                try {
                    const clienteConsulta = await clienteAxios.get(`/clientes/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })
                    datosCliente(clienteConsulta.data)
                } catch (error) {
                    // error con autorizacion
                    if(error.response.status === 500) {
                        props.history.push('/iniciar-sesion')
                    }
                }
            }else{
                props.history.push('/iniciar-sesion')
            }
        }
        consultarAPI()
    }, [id, auth, props.history])

    // leer los datos del formulario
    const actualizarState = e => {
        // almacenando lo que el usuario escribe en el state
        datosCliente({
            // obtener copia del state actual
            ...cliente,
            [e.target.name] : e.target.value
        })
    }

    // validar el formulario
    const validarCliente = () => {
        // destructuring
        const {nombre, apellido, email, empresa, telefono} = cliente
        // revisar que las propiedades del objeto sean correctas
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length

        return valido
    }
    // enviar una pet por axios para actualizar el cli
    const actulizarCliente = e => {
        e.preventDefault()

        clienteAxios.put(`clientes/${cliente._id}`, cliente, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {
                // valida si hay errores de mongo    
                if(res.data.code === 11000) {
                    Swal.fire({
                        type: 'error',
                        title : 'Hubo un error',
                        text: 'Ese correo ya esta registrado'
                    })
                    console.log('Error de duplicado de mongo');
                }else{
                    Swal.fire(
                        'Correcto',
                        'Se actualizó correctamente',
                        'success'
                    )
                }

                // redireccionar
                props.history.push('/')
            })
    }

    // verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
        props.history.push('/iniciar-sesion')
    }

    return ( 
        <Fragment>
            <h2>Editar Cliente</h2>
            
            <form 
                onSubmit={actulizarCliente}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        value={cliente.nombre}
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text"
                        placeholder="Apellido Cliente" 
                        name="apellido"
                        value={cliente.apellido}
                        onChange={actualizarState}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text"
                        placeholder="Empresa Cliente" 
                        name="empresa"
                        value={cliente.empresa}
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email"
                        placeholder="Email Cliente" 
                        name="email"
                        value={cliente.email}
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel"
                        placeholder="Teléfono Cliente" 
                        name="telefono"
                        value={cliente.telefono}
                        onChange={actualizarState}
                    />
                </div>

                <div className="enviar">
                    <input type="submit"
                    className="btn btn-azul"
                    value="Guardar Cliente"
                    disabled={validarCliente()}
                />
                </div>
            </form>

        </Fragment>
    )
}

// HOC, es una funcion que toma un component y retorna un nuevo componente
export default withRouter(EditarCliente)