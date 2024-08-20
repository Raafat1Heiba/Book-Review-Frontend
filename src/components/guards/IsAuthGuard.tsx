import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
interface IPayload {
  _id: string;
  role: {
    _id: string;
    name: string;
  };
}

import useAuth from "../hooks/useAuth";

const IsAuthGuard = ({ role }: { role: string | null }) => {
  const { setAuth }: any = useAuth();
  try {
    const token = localStorage.getItem("token");
    const payload: IPayload | null = token ? jwtDecode(token) : null;

    if (payload?.role.name === role) {
      return <Outlet />;
    }

    switch (payload?.role.name) {
      default:
        return <Navigate to="/login" replace />;
    }
  } catch (err: any) {
    if (err.message == "Invalid token specified: missing part #2") {
      setAuth({ token: "" });
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }
};

export default IsAuthGuard;
