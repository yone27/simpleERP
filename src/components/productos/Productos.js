import React, { Fragment, useState, useEffect, useContext , useCallback} from 'react';
import {Link,withRouter } from 'react-router-dom'

import clienteAxios from '../../config/axios'
import Producto from './Producto'
import Spinner from '../layout/Spinner'
import { CRMContext } from '../../context/CRMContext'

function Productos(props) {
    // State
    const [productos, guardarProductos] = useState([])
    const [auth] = useContext(CRMContext)

    //Query a la API
    const consultarAPI = useCallback(async() => {
        if(auth.token !== '') {
            try {
                const productosConsulta = await clienteAxios.get('/productos', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                guardarProductos(productosConsulta.data)
            }catch (error) {
                // error con autorizacion
                if(error.response.status === 500) {
                    props.history.push('/iniciar-sesion')
                }
            }
        } else{
            props.history.push('/iniciar-sesion')
        }
    }, [auth, props.history])

    useEffect(()=> {
        consultarAPI()
    }, [consultarAPI])

    //verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        props.history.push('/iniciar-sesion')
    }
    
    return (
        <Fragment>
            <h2>Productos</h2>
            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            {
                !productos.length ? (
                    //Spinner de carga
                    <Spinner /> 
                ): (
                    <ul className="listado-productos">
                        {
                            productos.map(producto => (
                                <Producto 
                                    key={producto._id}
                                    producto={producto}
                                    consultarAPI={consultarAPI}
                                />
                            ))
                        }
                    </ul>
                )
            }

        </Fragment>
    )
}
export default withRouter(Productos)