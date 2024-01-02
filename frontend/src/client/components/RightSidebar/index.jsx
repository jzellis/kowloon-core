import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaLink } from "react-icons/fa";
import { togglePostEditor } from "../../store/ui";
export default function Sidebar() {

    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();


    return (
        <div className='sidebar' id='RightSidebar'>

            {user?.actor && <><div className="user">
            
                <div className="avatar">{user.actor?.icon && <div className="h-16 rounded-full"><a href={`${user.actor.href}`} target="_blank"><img src={user.actor.icon} /></a></div>}</div>
                <div className="text-lg">{user.actor.name}</div>
                {user.actor.bio && <div className="bio text-sm mb-2">{user.actor.bio}</div>}
                {user.actor.location && <div className="location"><a target="_blank" href={`https://www.google.com/maps/place/${encodeURI(user.actor.location.name)}`}><FaMapMarkerAlt className="inline" /> {user.actor.location.name}</a></div>}
                {user.actor.url && user.actor.url.length > 0 && <ul className="url">{user.actor.url.map((u, i) => <li key={i}><a target="_blank" href={u}><FaLink className="inline" /> {u}</a></li>)}</ul>}
            </div>

                </>
            }
        </div>
    )
}