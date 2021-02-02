import React, {useContext} from 'react';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import clienteAxios from '../../config/axios'
import { CRMContext } from '../../context/CRMContext'

function Producto({producto, consultarAPI}) {
    // VARS
    const {_id, nombre, precio, imagen} = producto

    // State
    const [auth] = useContext(CRMContext)

    // elimina un producto
    const eliminarProducto = id => {
        Swal.fire({
            title: 'Estas seguro?',
            text: "Un producto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if (result.value) {
                clienteAxios.delete(`/productos/${id}`, {
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
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{nombre}</p>
                <p className="precio">$ {precio}</p>
                {
                    imagen ? (
                        <img src={`http://localhost:5000/${imagen}`} alt="imagen"/>
                    ) : null
                }
            </div>
            <div className="acciones">
                <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>
                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar" 
                    onClick={()=> eliminarProducto(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
    )
}
export default Producto