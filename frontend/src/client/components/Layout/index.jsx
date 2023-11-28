import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LeftSidebar from "../LeftSidebar"
import RightSidebar from "../RightSidebar"

export default function Layout(props) {
    const title = useSelector(state => state.kowloon.settings.title);

    return (
        <><div id="header">
            <h1><a href="/">{title}</a></h1>
        </div>
            <div id='layout'>
            <LeftSidebar />
            <div id='main'><Outlet /></div>
            <RightSidebar />
            </div>
        </>
    )
}