import { useState, useEffect } from 'react'
import store from "../store"
import { useDispatch, useSelector } from 'react-redux'
import { setSettings, setUser } from '../store/ui'
import Kowloon from './lib/Kowloon'
import Navbar from './components/Navbar'
import Sidebar from "./components/Sidebar"
import PostEditor from "./components/PostEditor"
import ImageModal from './components/ImageModal'
import { Outlet } from 'react-router-dom'

function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.ui.user)
  const postEditorOpen = useSelector(state => state.ui.postEditorOpen);
  const imageModalOpen = useSelector(state => state.ui.imageModalOpen);
  

  const getSettings = async () => {
    let siteSettings = await Kowloon.getSettings();
    dispatch(setSettings(siteSettings));
  }
  useEffect(() => {
    getSettings();
    if (localStorage.getItem("user")) dispatch(setUser(JSON.parse(localStorage.getItem("user"))))

  }, [])

  return (

    <div className={imageModalOpen && `h-screen w-screen overflow-hidden`} >
      {imageModalOpen && <ImageModal />}
       <Navbar />
       <div className='flex gap-2'>

        {user && <Sidebar />}
        <div className='main'>
          {postEditorOpen && <PostEditor />}
          <Outlet />
          </div>
    </div>
      </div>

  )
}

export default App
