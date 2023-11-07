/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux';
import { toggleDrawer } from "../../store/ui"
import { FaMapMarkerAlt } from 'react-icons/fa';
import "./index.css";

const Sidebar = (props) => {

    const user = useSelector(state => state.ui.user);
    const settings = useSelector(state => state.ui.settings);
    const drawerOpen = useSelector(state => state.ui.drawerOpen);
    const actor = user.actor || user;

    const dispatch = useDispatch();
    return (
    <>
        {drawerOpen &&
        <div className='sidebar-wrapper'>
            <div id="sidebar" className={`transition-all sidebar`}>

                <div className='mb-8'>

                        </div>
                        {settings &&
                            <>
                            <h1>{settings.title}</h1>
                            <div className='location'><a href={`//maps.google.com?q=${encodeURIComponent(settings.location)}`} target="_blank"><FaMapMarkerAlt className="inline mr-1" />{settings.location}</a></div>
                            <div className='description'>{settings.description}</div>
                            </>
                        }
                    </div>
        </div>
            }
            </>
            )
 }

export default Sidebar;