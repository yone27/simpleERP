import React, { Fragment, useContext } from 'react';

// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Layout
import Header from './components/layout/Header'
import Navegacion from './components/layout/Navegacion'

// Components 
import Clientes from './components/clientes/Clientes'
import NuevoCliente from './components/clientes/NuevoCliente'
import EditarCliente from './components/clientes/EditarCliente'

import Productos from './components/productos/Productos'
import NuevoProducto from './components/productos/NuevoProducto'
import EditarProducto from './components/productos/EditarProducto'

import Pedidos from './components/pedidos/Pedidos'
import NuevoPedido from './components/pedidos/NuevoPedido'

import Login from './components/auth/Login'

// Settings
import { CRMContext, CRMProvider } from './context/CRMContext'

const App = () => {
    // Configurar context para usarlo
    const [auth, guardarAuth] = useContext(CRMContext)

    return (
        <Router>
            <CRMProvider value={[auth, guardarAuth]}>
                <Header />
                <div className="grid contenedor contenido-principal">
                    <Navegacion />
                    <main className="caja-contenido col-9">
                        <Switch>
                            <Route exact path="/" component={Clientes}></Route>
                            <Route exact path="/clientes/nuevo" component={NuevoCliente}></Route>
                            <Route exact path="/clientes/editar/:id" component={EditarCliente}></Route>

                            <Route exact path="/productos" component={Productos}></Route>
                            <Route exact path="/productos/nuevo" component={NuevoProducto}></Route>
                            <Route exact path="/productos/editar/:id" component={EditarProducto}></Route>

                            <Route exact path="/pedidos" component={Pedidos}></Route>
                            <Route exact path="/pedidos/nuevo/:id" component={NuevoPedido}></Route>

                            <Route exact path="/iniciar-sesion" component={Login}></Route>
                        </Switch>
                    </main>
                </div>
            </CRMProvider>
        </Router>
    );
}

export default App;