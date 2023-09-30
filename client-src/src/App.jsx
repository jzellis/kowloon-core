/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import PostEditor from './components/PostEditor'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       {/* <div className="navbar bg-base-100">
  <div className="flex-1">
    <a className="btn btn-ghost normal-case text-xl font-thin">Kowloon</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li><a>Timeline</a></li>
      <li><a>Groups</a></li>
      <li><input className='border-black border' placeholder='Search' /></li>

            <li>
        <details>
          <summary>
            Parent
          </summary>
          <ul className="p-2 bg-base-100">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div> */}

      <div className="container">
      <Sidebar />
        <main className='main'>
          <PostEditor />
          
          <section className='timeline'>Timeline</section>
          </main>
      </div>
    </>
  )
}

export default App
