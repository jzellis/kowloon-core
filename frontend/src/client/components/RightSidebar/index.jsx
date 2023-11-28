import { useSelector } from "react-redux";
export default function Sidebar() {

    const user = useSelector(state => state.user.user);
    return (
        <div className='sidebar' id='RightSidebar'>
            {user?.actor && <div className="user">

                <div className="avatar">{user.actor?.icon && <img src={user.actor.icon} />}</div>
                <div>{user.actor.name}</div>
            </div>}
        </div>
    )
}