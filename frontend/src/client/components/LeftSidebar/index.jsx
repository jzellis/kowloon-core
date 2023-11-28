import { useSelector } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
export default function Sidebar() {
    const description = useSelector(state => state.kowloon.settings.description);
    const location = useSelector(state => state.kowloon.settings.location);

    return (
        <div className='sidebar' id='LeftSidebar'>
            <div className="description">{description}</div>
            {location && <div className="location">
                <a target="_blank" href={`https://www.google.com/maps/place/${encodeURI(location.name)}`}>
                    <FaMapMarkerAlt className="inline" /> {location.name}
                </a>
            </div>
            }
        </div>
    )
}