import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Timeline from "../../components/Timeline"
export default function Home(props) {

    const title = useSelector(state => state.kowloon.settings.title)

    useEffect(() => {
        if(typeof window != "undefined" && title) document.title = title + " | Home";
    },[])
    return (
        <>
        <Timeline />
        </>
    )
}