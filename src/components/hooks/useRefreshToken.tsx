import { useCookies } from "react-cookie";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();
  const [cookies] = useCookies();

  const refresh = async () => {
    const token = await cookies.token;

    setAuth({ token });

    return token;
  };

  return refresh;
};

export default useRefreshToken;
