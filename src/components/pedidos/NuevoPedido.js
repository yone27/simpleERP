import React, {Fragment, useState, useEffect, useContext} from 'react';
import Swal from 'sweetalert2'
import {withRouter} from 'react-router-dom'

import clienteAxios from '../../config/axios'
import FormBuscarProducto from './FormBuscarProducto'
import FormCantidadProducto from './FormCantidadProducto'
import { CRMContext } from '../../context/CRMContext'

function NuevoPedido(props) {
    // Vars
    const {id} = props.match.params

    // State
    const [cliente, guardarCliente] = useState({})
    const [busqueda, guardarBusqueda] = useState('')
    const [productos, guardarProductos] = useState([])
    const [total, guardarTotal] = useState(0)
    const [auth] = useContext(CRMContext)
    
    useEffect(()=> {
        // actualizar el total a pagar
        const actualizarTotal = () => {
            // si el arreglo de productos es igual a 0 total = 0
            if(productos.length === 0) {
                guardarTotal(0)
                return
            }

            // calcular el nuevo total
            let nuevoTotal = 0

            //recorrer todos los productos, sus cantidades y precios
            productos.map(producto => (nuevoTotal += (producto.cantidad * producto.precio)))
            
            //almacenar total en el state
            guardarTotal(nuevoTotal)
        }

        // obtener el cliente
        const consultarAPI = async () => {
            // consultar cliente act
            const resultado = await clienteAxios.get(`/clientes/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })

            guardarCliente(resultado.data)
        }
        consultarAPI()

        // actualizar el total a pagar
        actualizarTotal()
    }, [productos, id, auth])

    const buscarProducto = async e => {
        e.preventDefault()

        //obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })

        // si no hay resultados una alerta, contrario lo add a l state
        if(resultadoBusqueda.data[0]) {
            let productoResultado = resultadoBusqueda.data[0]

            // agregar la llave "producto" (copia de id)
            productoResultado.producto = resultadoBusqueda.data[0]._id
            productoResultado.cantidad = 0

            // ponerlo en el state
            guardarProductos([
                ...productos,
                productoResultado
            ])
        }else {
            // no hay resultados
            Swal.fire({
                type: 'error',
                title: 'No resultados',
                text: 'No hay resultados'
            })
        }
    }

    //almacenar una busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value)
    }

    // actulizar la cnt de productos
    const restarProductos = i => {
        // copiar el arreglo original de productos
        const todosProductos = [...productos]

        // validar si esta en 0 no puede ir mas alla
        if(todosProductos[i].cantidad === 0) return

        //decremento
        todosProductos[i].cantidad--

        //almacenarlo en el state
        guardarProductos(todosProductos)
    }

    const sumarProductos = i => {
        // copiar el arreglo para no mutar el original
        const todosProductos = [...productos]

        //incremento
        todosProductos[i].cantidad++

        //almacenarlo en el state
        guardarProductos(todosProductos)
    }

    //elimina un producto por id
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id)

        guardarProductos(todosProductos)
    }

    //alamacena el pedido en la db
    const realizarPedido = async (e) => {
        e.preventDefault()

        //construimos el obj
        const pedido = {
            cliente: id,
            pedido: productos,
            total
        }

        // almacenarlo en la db
        const resultado = await clienteAxios.post(`/pedidos`, pedido, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })

        //leer resultado
        if(resultado.status === 200) {
            //todo ok
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        }else {
            //todo bad
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo'
            })
        }

        //redireccionar
        props.history.push('/pedidos')
    }

    //verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        props.history.push('/iniciar-sesion')
    }

    return (
        <Fragment>
            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>{cliente.nombre} {cliente.apellido}</p>
                <p>{cliente.telefono}</p>
            </div>

            <FormBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                {
                    productos.map((producto, index)=> (
                        <FormCantidadProducto
                            producto={producto}
                            key={producto.producto}
                            restarProductos={restarProductos}
                            sumarProductos={sumarProductos}
                            index={index}
                            eliminarProductoPedido={eliminarProductoPedido}
                        />
                    ))
                }
            </ul>
            <p className="total">
                Total a pagar: <span>${total} </span>
            </p>
            {
                total > 0 ? (
                    <form 
                        onSubmit={realizarPedido}
                    >
                        <div className="enviar">
                            <input type="submit" className="btn btn-azul" value="Agregar Pedido"/>
                        </div>
                </form>
                ) : null
            }
        </Fragment>
    )
}

export default withRouter(NuevoPedido)