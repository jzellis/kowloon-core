import { useState } from "react";
import axios from "axios";
import { getCookie, getCookies, setCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function LoginForm(props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const doLogin = async (e) => {
    e.preventDefault();
    const creds = { login, password };
    let response = await axios.post("/api/login", creds);
    console.log(response.data);
    if (response.data.token) {
      setCookie("token", response.data.token);
      router.push("/my");
    } else {
      alert(response.data.error);
    }
  };

  return (
    <>
      <fieldset className="form-control my-4">
        <input
          type="text"
          name="login"
          id="username"
          className="input input-bordered"
          placeholder="Username or email"
          onChange={(e) => setLogin(e.target.value)}
        />
      </fieldset>
      <fieldset className="form-control mb-4">
        <input
          type="password"
          name="password"
          id="password"
          className="input input-bordered"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      <fieldset className="form-control">
        <button className="btn btn-lg" onClick={doLogin}>
          Login
        </button>
      </fieldset>
    </>
  );
}
