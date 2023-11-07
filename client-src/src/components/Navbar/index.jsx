import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/ui"
import { useEffect, useState } from "react";
import { toggleDrawer, togglePostEditor, changePostType } from "../../store/ui";
import { GoFileMedia } from 'react-icons/go';
import { GrDocumentText } from 'react-icons/gr'
import { LuStickyNote } from 'react-icons/lu'
import { FaLink } from 'react-icons/fa'
import "./index.css"

const Navbar = () => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.ui.settings);
    const user = useSelector(state => state.ui.user);
    const [showNewButtons, setShowNewButtons] = useState(false);

    const createNewPost = (type) => {
        dispatch(changePostType(type))
        dispatch(togglePostEditor())
        setShowNewButtons(false)

    }

    return (<><nav id='navbar' className="navbar flex px-4">
        <div className="navbar-start">
            <div className="visible md:hidden lg:-translate-y-1/2 mr-2 cursor-pointer" onClick={() => dispatch(toggleDrawer())}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></div>
        <div className='cursor-pointer'>
                <a href="/"><img src=".././public/seal.png" className="h-8 w-8 mr-4 inline" /></a>

                </div>

        </div>
        <div className="navbar-end">
            
            {user && user.actor &&
                <>
                
                <ul className="menu menu-horizontal px-1 lg:mr-8">
      <li tabIndex={0}>
        <details>
          <summary><img src={user.actor.icon} className="h-8 w-8 lg:h-12 lg:w-12 rounded-full" />
</summary>
                            <ul className="p-2 z-[9999] absolute right-0 w-40">
                                <li>{user.actor.name} ({user.actor.preferredUsername})</li>
            <li><a href={`/users/${user.actor.preferredUsername}`}>Profile</a></li>
            <li><a href="#" onClick={() => dispatch(logout())}>Logout</a></li>
          </ul>
        </details>
      </li>
    </ul>
                </>
            }
            {!user && <a className="btn" href="/login">Login</a>}
           

        </div>
    </nav>
    {
            user && user.actor && (<>
                <div className="new-post-wrapper">
        <div className={`new-post-buttons transition-all ${showNewButtons ? "opacity-100" : "opacity-0"}`}>
                    <div className="tooltip " data-tip="Add New Note">
                        <button onClick={() => createNewPost("Note")}><LuStickyNote /></button>
                    </div>
                    <div className="tooltip " data-tip="Add New Article">
                        <button onClick={() => createNewPost("Article")}><GrDocumentText /></button>
                    </div>
                    <div className="tooltip " data-tip="Add New Media">

                        <button onClick={() => createNewPost("Media")}><GoFileMedia /></button></div>
                    <div className="tooltip " data-tip="Add New Link">

                        <button onClick={() => createNewPost("Link")}><FaLink /></button>
                    </div>
                </div>
            <div className="add-new-post-button tooltip " data-tip="Add New Post">
            <button className="btn" onClick={() => setShowNewButtons(!showNewButtons)}>+</button>
                    </div>
                    </div></>)
        }
        </>
    )
}

export default Navbar