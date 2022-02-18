import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Messanger from "./pages/messanger/Messanger";
import Teams from "./pages/teams/Teams"
import Calander from "./pages/calander/Calander"
import Profile from "./pages/profile/Profile"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("https://ventas-v1.herokuapp.com/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={user ? <Navigate to="https://sad-noether-bbc8ba.netlify.app/home" /> : <Login />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/home" element={user ? <Home user={user} /> : <Navigate to="https://sad-noether-bbc8ba.netlify.app/login" />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/login" element={user ? <Navigate to="https://sad-noether-bbc8ba.netlify.app/home" /> : <Login />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/messanger" element={user ? <Messanger user={user} /> : <Navigate to="https://sad-noether-bbc8ba.netlify.app/login" />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/teams" element={user ? <Teams user={user} /> : <Navigate to="https://sad-noether-bbc8ba.netlify.app/login" />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/calander" element={user ? <Calander user={user} /> : <Navigate to="https://sad-noether-bbc8ba.netlify.app/login" />} />
            <Route exact path="https://sad-noether-bbc8ba.netlify.app/profile" element={user ? <Profile user={user} /> : <Navigate to="https://sad-noether-bbc8ba.netlify.app/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
