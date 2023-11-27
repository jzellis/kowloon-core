import { useState } from "react";
import Kowloon from "../../lib/Kowloon";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/user";
import { useDispatch } from "react-redux";
export default function View(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = async (e) => {
        e.preventDefault();
        let response = await Kowloon.login({ username, password });
        if (!response.error) {
            dispatch(setUser(response));
            localStorage.setItem("user", JSON.stringify(response));
            navigate("/");
        } else {
            setError(response.error);
        }
    }
    return (
        <div id="login" className="w-1/4 mx-auto mt-8">
            <div className={`text-center text-red-500 ${error && "visible"}`}>{error}</div>
            <fieldset><label className="label" htmlFor="username">Username</label> <input name='username' type="text" className="input input-bordered w-full" onChange={(e) => setUsername(e.target.value)} /></fieldset>
            <fieldset><label className="label" htmlFor="password">Password</label> <input name='password' type={showPassword ? "text" : "password"} className="input input-bordered w-full" onChange={(e) => setPassword(e.target.value)} /> 
            </fieldset>
            <fieldset className="text-right text-sm mt-2"><label htmlFor="showPassword"><input id="showPassword" type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Show Password</label></fieldset>
            <fieldset className="text-center mt-4"><button onClick={login} className="btn btn-primary btn-wide">Login</button></fieldset>
        </div>
    )
}