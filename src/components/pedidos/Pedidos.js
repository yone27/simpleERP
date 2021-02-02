import React, {useEffect, useState, Fragment, useContext} from 'react';

import clienteAxios from '../../config/axios'
import DetallesPedido from './DetallesPedido'
import { CRMContext } from '../../context/CRMContext'

function Pedidos({history}) {
    //State
    const [pedidos, guardarPedidos] = useState([])
    const [auth] = useContext(CRMContext)

    useEffect(()=> {
        const consultarAPI = async () => {
            //obtener los pedidos
            const resultado = await clienteAxios.get('/pedidos', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            guardarPedidos(resultado.data)
        }
        consultarAPI()
    }, [auth])

    //verificar si el user esta auth
    if(!auth.auth && (localStorage.getItem('token') !== auth.token)) {
        history.push('/iniciar-sesion')
    }

    return (
        <Fragment>
            <h2>Pedidos</h2>
            {
                !pedidos.length ? (
                    <h3>No hay más pedidos</h3>
                ): (
                    <ul className="listado-pedidos">
                        {
                            pedidos.map(pedido => (
                                <DetallesPedido 
                                    key={pedido._id}
                                    pedido={pedido}
                                />
                            ))
                        }
                    </ul>
                )
            }
        </Fragment>
    )
}
export default Pedidos