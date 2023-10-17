import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './pages/login/index.jsx'
import Home from './pages/home/index.jsx'
import './index.css'
import store from '../store/index.js'
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom";

import Navbar from './components/Navbar/index.jsx'

const router = createBrowserRouter(createRoutesFromElements(
<>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    </Route>
    <Route path="login" element={<Login />} />
    </>
));



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>,
)
