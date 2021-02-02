import React, {Fragment,useState, useContext} from 'react';
import Swal from 'sweetalert2'
import {withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios'
import { CRMContext } from '../../context/CRMContext'

function NuevoProducto(props) {
    // State
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: ''
    })
    const [archivo, guardarArchivo] = useState({
        file: '',
        imagePreview: ''
    })
    const [auth] = useContext(CRMContext)

    // almacena el nuevo producto en la db
    const agregarProducto = async e => {
        e.preventDefault()

        // Crear un form fata
        const formData = new FormData()
        formData.append('nombre',producto.nombre)
        formData.append('precio',producto.precio)
        formData.append('imagen',archivo.file)

        // almacenarlo en la db
        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`
                }
            })
            
            if(res.status === 200) {
                Swal.fire(
                    'Agregado correctamente',
                    res.data.mensaje,
                    'success'
                )
            }
            props.history.push('/productos')
        } catch (error) {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo'
            })
        }
    }

    // leer los datos del form
    const leerInformacionProducto = e => {
        guardarProducto({
            // obtenemos una copia del state y agregar el nuevo
            ...producto,
            [e.target.name]: e.target.value
        })
    }

    const leerArchivo = e => {
        guardarArchivo({
            file: e.target.files[0],
            imagePreview: URL.createObjectURL(e.target.files[0])
        })
    }

    // verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        props.history.push('/iniciar-sesion')
    }

    return (
        <Fragment>
            <h2>NuevoProducto</h2>
            <form
                onSubmit={agregarProducto}
            >
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                    />
                </div>
                <div className="campo">
                    <label>Precio:</label>
                    <input type="number"
                        name="precio" 
                        min="0.00" 
                        step="0.01" 
                        placeholder="Precio" 
                        onChange={leerInformacionProducto}
                    />
                </div>
                <div className="campo">
                    <label>Imagen:</label>
                    {
                        archivo ? (
                            <img src={archivo.imagePreview} alt="imagen" width="200"/>
                        ) : null
                    }
                    <input type="file"
                        name="imagen" 
                        onChange={leerArchivo}
                    />
                </div>
                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul" 
                        value="Agregar Producto"
                    />
                </div>
            </form>
        </Fragment>
    )
}
export default withRouter(NuevoProducto)