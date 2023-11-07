import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './pages/login/index.jsx'
import Home from './pages/home/index.jsx'
import Post, { loader as PostLoader } from "./pages/posts/index.jsx";
import Profile,{ loader as ProfileLoader } from './pages/profile/index.jsx'
import './index.css'
import store from './store/index.js'
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom";



const router = createBrowserRouter(createRoutesFromElements(
<>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/posts/:id" element={<Post />} loader={PostLoader} />
    <Route path="/users/:username" element={<Profile />} loader={ProfileLoader} />
    </Route>
    <Route path="login" element={<Login />} />
    </>
));



ReactDOM.createRoot(document.getElementById('root')).render(
        <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
)
