/* eslint-disable no-unused-vars */
import { useState } from "react";
import Kowloon from "../../lib/Kowloon";
import { useDispatch } from 'react-redux';
import { login } from '../../store/ui';

const LoginForm = () => { 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const doLogin = async (e) => { 
        e.preventDefault();
        let user = await Kowloon.login(username, password);
        if (!user.error) {
            dispatch(login(user));
            window.location.href = "/";
        } else {
            alert(JSON.stringify(user.error))
        }


    }
    return (<>
        <form className="login-form text-center">
            <fieldset>
                <label className="label" htmlFor="username">Username</label>
                <input className="input input-bordered" name="username" onChange={(e) => setUsername(e.target.value)} value={username} />
            </fieldset>
            <fieldset>
            <label className="label" htmlFor="password">Password</label>

                <input className="input input-bordered" type="text" onChange={(e) => setPassword(e.target.value)} value={password} />
                </fieldset>
            <button className="btn btn-primary mt-4" onClick={doLogin}>Login</button>
        </form>
    </>)


}

export default LoginForm;