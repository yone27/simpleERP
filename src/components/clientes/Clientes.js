import React, {useEffect, useState, Fragment, useContext, useCallback} from 'react';
import {Link, withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios'
import Cliente from './Cliente'
import Spinner from '../layout/Spinner'
import { CRMContext } from '../../context/CRMContext'

function Clientes(props) {
    // State
    const [clientes, guardarClientes] = useState([])
    const [auth] = useContext(CRMContext)

    const consultarAPI = useCallback(async () => {
        if(auth.token !== '') {
            try {
                const clientesConsulta = await clienteAxios.get('/clientes', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
        
                // colocar el resultado en el state
                guardarClientes(clientesConsulta.data)
            } catch (error) {
                // error con autorizacion
                if(error.response.status === 500) {
                    props.history.push('/iniciar-sesion')
                }
            }
        }else{
            props.history.push('/iniciar-sesion')
        }
    }, [auth, props.history]) 

    // use effect es similar a componentDidMount y componentWillMount
    useEffect(()=> {
        consultarAPI()
    }, [consultarAPI])

    //verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        props.history.push('/iniciar-sesion')
    }
    
    return (
        <Fragment>
            <h2>Clientes</h2>
            <Link to={"/clientes/nuevo"} className="btn btn-verde">
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>
            
            {
                !clientes.length ? (
                    //Spinner de carga
                    <Spinner /> 
                ):(
                    <ul className="listado-clientes">
                        {
                            clientes.map(cliente => (
                                <Cliente
                                    key={cliente._id}
                                    cliente={cliente}
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
export default withRouter(Clientes)