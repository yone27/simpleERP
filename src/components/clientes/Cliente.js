import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'

import clienteAxios from '../../config/axios'
import { CRMContext } from '../../context/CRMContext'

function Cliente({cliente, consultarAPI}) {
    // VARS
    const {_id, nombre, apellido, empresa, email, telefono} = cliente

    //State
    const [auth] = useContext(CRMContext)

    // eliminar cilente
    const eliminarCliente = id => {
        Swal.fire({
            title: 'Estas seguro?',
            text: "Un cliente eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if (result.value) {
                clienteAxios.delete(`/clientes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                    .then(res => {
                        Swal.fire(
                            'Eliminado',
                            res.data.mensaje,
                            'success'
                        )
                        consultarAPI()
                    })
            }
        })
    }

    return (
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{nombre} {apellido}</p>
                <p className="empresa"> {empresa} </p>
                <p>{email}</p>
                <p>Tel: {telefono}</p>
            </div>
            <div className="acciones">
                <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Cliente
                </Link>
                <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
                    <i className="fas fa-pen-alt"></i>
                    Nuevo pedido
                </Link>
                <button 
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarCliente(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
    )
}

export default Cliente