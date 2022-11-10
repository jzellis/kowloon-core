import { useState } from "react";
import axios from "axios";
import { getCookie, getCookies, setCookie } from 'cookies-next';
import { useRouter } from "next/router";

export default function LoginForm(props) { 

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const login = async (e) =>{
        e.preventDefault();
        const login = { username, password };
        let response = await axios.post("/api/my/login", login);
        console.log(response.data);
        if (response.data.token) {
            setCookie("token", response.data.token);
            router.push("/my")
        } else {
            alert(response.data.error)
        }

}

    return(
<>
<fieldset className="form-control my-4">
                <input type="text" name="username" id="username" className="input input-bordered" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
</fieldset>
<fieldset className="form-control mb-4">
                <input type="password" name="password" id="password" className="input input-bordered" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            </fieldset>
            <fieldset className="form-control">
               <button className='btn btn-lg' onClick={login}>Login</button>
</fieldset>

        </>    
    )
}