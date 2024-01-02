import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import "./index.css";

export default function FollowForm(props) { 

    const [url, setUrl] = useState("");
    const showFollowForm = useSelector(state => state.ui.showFollowForm);

    return (<div className={`followForm ${showFollowForm ? "visible" : "hidden"}`}>
        Follow
        <fieldset className="form-control">
            <input type="text" className="input input-bordered" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="url" />
            </fieldset>
    </div>)
}