import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/NavBar";
import Login from "./components/pages/login";
import Signup from "./components/pages/register";
import Home from "./components/pages/home";
import User from "./components/pages/user";
import BookDetails from "./components/pages/bookDetails";
import { jwtDecode } from "jwt-decode";
import useAuth from "./components/hooks/useAuth.tsx";
import useAxiosPrivate from "./components/hooks/useAxiosPrivate.tsx";
import { useEffect } from "react";

interface IPayload {
  _id: string;
  role: {
    _id: string;
    name: string;
  };
}
function App() {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, isUser, setisUser }: any = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const res = await axiosPrivate.get(url + "/cart");
    };

    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const payload: IPayload | null = token ? jwtDecode(token) : null;
      const expDate = payload?.exp * 1000;
      const nowDate = new Date().getTime();

      if (expDate > nowDate) {
        setisUser(true);
        setAuth({ token });
        getUser();
      } else {
        localStorage.removeItem("token");
        setAuth({ token: "" });
      }
    } else {
    }
  }, [isUser]);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
        <Route path="/book/:bookId" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
