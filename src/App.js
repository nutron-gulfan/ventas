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
      fetch("https://git.heroku.com/ventas-v1.git/auth/login/success", {
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
            <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/messanger" element={user ? <Messanger user={user} /> : <Navigate to="/login" />} />
            <Route path="/teams" element={user ? <Teams user={user} /> : <Navigate to="/login" />} />
            <Route path="/calander" element={user ? <Calander user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
