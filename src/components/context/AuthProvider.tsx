import { createContext, useState } from "react";
interface IAuth {
  token: string;
  userId: string;
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth]: [IAuth, React.Dispatch<React.SetStateAction<IAuth>>] =
    useState({
      token: "",
      userId: "",
    });
  const [isUser, setisUser] = useState(false);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isUser, setisUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
