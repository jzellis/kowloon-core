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
        <div id="login">
            <div>
            <input name='username' type="text" className="input input-bordered w-full" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input name='password' type={showPassword ? "text" : "password"} className="input input-bordered w-full" onChange={(e) => setPassword(e.target.value)} placeholder="Password" /> 
                <label htmlFor="showPassword"><input id="showPassword" type="checkbox" onChange={() => setShowPassword(!showPassword)} /> <span className="label-text text-xs">Show Password</span></label>
            </div>
            <div>
            <div className={`text-center text-red-500 ${error && "visible"}`}>{error}</div>
            
                <button onClick={login} className="btn btn-primary btn-sm">Login</button>
            </div>
        </div>
    )
}