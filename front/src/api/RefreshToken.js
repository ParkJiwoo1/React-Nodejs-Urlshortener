import axios from "axios";
import useAuth from "../api/useAuth";
import jwt_decode from "jwt-decode";

function RefreshToken() {
  const { auth, setAuth } = useAuth();
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decoded = jwt_decode(auth.accessToken);
      if (decoded.exp * 1000 < currentDate.getTime()) {
        const refreshData = await refreshTokens();
        config.headers["authorization"] = "Bearer " + refreshData.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const refreshTokens = async () => {
    try {
      const res = await axios.post("/refresh", {
        token: auth.refreshToken,
        withCredentials: true,
      });
      setAuth({
        ...auth,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      console.log(res);
      return res.data;
    } catch (err) {
      console.log("refresh error");
    }
  };
  return refreshTokens;
}

export default RefreshToken;
