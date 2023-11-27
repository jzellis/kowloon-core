import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { Home, Login, PageNotFound } from "./views";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./store/user";
import { setSettings } from "./store/kowloon";
import { useEffect } from "react";
import Kowloon from "./lib/Kowloon";
function App() {
  const user = useSelector(state => state.user.user);
  const loggedIn = useSelector(state => state.user.loggedIn);
  const dispatch = useDispatch();
console.log(import.meta.env)
  useEffect(() => {
    if(typeof window != "undefined"){
      if(localStorage.getItem("user")){
        dispatch(setUser(JSON.parse(localStorage.getItem("user"))))
      }
      if(Kowloon.settings) dispatch(setSettings(Kowloon.settings))
    }
  },[])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: "",
          element: <Home />,
        },
      ],
    },
    {      path: "/login",
      element: <Login />,
    }
  ]);

  return (
<RouterProvider router={router} />
  );
}

export default App;
