import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LeftSidebar from "../LeftSidebar"
import RightSidebar from "../RightSidebar"
import PostEditor from "../PostEditor";
import LoginForm from "../LoginForm";
import FollowForm from "../FollowForm";
import { LuStickyNote } from 'react-icons/lu'
import { togglePostEditor } from "../../store/ui";
import { logout } from "../../store/user";

export default function Layout(props) {
    const title = useSelector(state => state.kowloon.settings.title);
    const postEditorIsVisible = useSelector(state => state.ui.showPostEditor);
    const user = useSelector(state => state.user.user);
    const showPostEditor = useSelector(state => state.ui.showPostEditor);
    const showFollowForm = useSelector(state => state.ui.showFollowForm);
    const dispatch = useDispatch();

    return (
        <>
            {showPostEditor && <PostEditor />}
            {showFollowForm && <FollowForm />}
            <div id="header">
                <h1><a href="/">{title}</a></h1> 
                {user && user.actor && <div className="avatar"><div className="h-16 rounded-full"><img className="avatar" src={user.actor.icon} /></div><span onClick={() => dispatch(logout())}>Logout</span></div>}
                {!user.actor && <LoginForm />}

 
        </div>
            <div id='layout'>
            <LeftSidebar />
                <div id='main'><Outlet />
                {!postEditorIsVisible && user && <button className="newPostButton" onClick={() => dispatch(togglePostEditor())}><LuStickyNote /></button>}
                </div>

            <RightSidebar />
            </div>
        </>
    )
}