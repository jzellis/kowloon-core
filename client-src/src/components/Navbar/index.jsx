import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../../store/ui"
import { useEffect } from "react";
const Navbar = () => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.ui.settings);
    const user = useSelector(state => state.ui.user);

    return (<nav id='navbar' className="navbar bg-base-200 shadow-lg mb-8 flex px-4">
        {(settings && settings.title) && <a className="text-xl font-thin navbar-start" href="/">{settings.title}</a>}
        <div className="navbar-end">
            {!user && <a href="/login">Login</a>}
            {user && <span className="cursor-pointer" onClick={(e) => { dispatch(logout())} }>Logout</span>}
        </div>
    </nav>)
}

export default Navbar