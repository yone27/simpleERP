import React, {useState, useEffect, Fragment, useContext} from 'react';
import Swal from 'sweetalert2'
import {withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios'
import { CRMContext } from '../../context/CRMContext'

function EditarProducto(props) {
    // VARS
    const {id} = props.match.params
    
    // State
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    })
    const [auth] = useContext(CRMContext)
    const [archivo, guardarArchivo] = useState({
        file: '',
        imagePreview: ''
    })

    // cuando el componente carga - esto es vainas de ciclo de vida creo yo
    useEffect(()=>{
        //consultar api para traer el producto a editar
        const consultarAPI = async ()=>{
            const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            guardarProducto(productoConsulta.data)
        }
        consultarAPI()
    }, [id, auth])

    // Edita un producto en la db
    const editarProducto = async e => {
        e.preventDefault()

        // Crear un form fata
        const formData = new FormData()
        formData.append('nombre',producto.nombre)
        formData.append('precio',producto.precio)
        formData.append('imagen',archivo.file)

        // almacenarlo en la db
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`
                }
            })
            
            if(res.status === 200) {
                Swal.fire(
                    'Editado correctamente',
                    res.data.mensaje,
                    'success'
                )
            }
            
            props.history.push('/productos')
        } catch (error) {
            Swal.fire({
                type: 'error',
                title : 'Hubo un error',
                text: 'Vuelva a intentarlo'
            })
        }
    }

    //leer los datos del form
    const leerInformacionProducto = e => {
        guardarProducto({
            //obtenemos una copia del state y agregar el nuevo
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

    // extraer los valores del state
    const {nombre, precio, imagen} = producto

    // verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        props.history.push('/iniciar-sesion')
    }

    return (
        <Fragment>
            <h2>EditarProducto</h2>
            <form
                onSubmit={editarProducto}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
                        />
                </div>
                <div className="campo">
                    <label>Precio:</label>
                    <input type="number"
                        name="precio" 
                        min="0.00" 
                        step="0.01" 
                        placeholder="Precio" 
                        defaultValue={precio}
                        onChange={leerInformacionProducto}
                        />
                </div>
                <div className="campo">
                    <label>Imagen:</label>
                    {
                        archivo.imagePreview ? (
                            <img src={archivo.imagePreview} alt="imagen" width="200"/>
                        ) : (
                            <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="200"/>
                        )
                    }
                    <input type="file"
                        name="imagen" 
                        onChange={leerArchivo}
                        />
                </div>
                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul" 
                        value="Editar Producto"/>
                </div>
            </form>
        </Fragment>
    )
}
export default withRouter(EditarProducto)