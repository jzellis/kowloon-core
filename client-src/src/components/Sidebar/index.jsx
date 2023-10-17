/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux';
import {togglePostEditor} from "../../../store/ui"

const Sidebar = (props) => {

    const user = useSelector(state => state.ui.user);
    const actor = user.actor || user;

    const dispatch = useDispatch();
    return (<div id="sidebar" className={`flex-none w-1/5 bg-gray-100 p-8 ${props.className}`}>
        <div className='user-profile mb-4'>
            <div className='user-profile-avatar w-1/4 mx-auto'><img className="avatar" src={actor.icon} /></div>
            <h2 className='text-center text-lg'>{actor.name}</h2>
            <div className='text-center text-sm'>({actor.preferredUsername})</div>
            <div className='text-sm mt-2'>{actor.bio}</div>
        </div>
        <div className='btn btn-neutral btn-block hover:btn-primary' onClick={() => {dispatch(togglePostEditor())}}>+ New Post</div>
    </div>)
 }

export default Sidebar;