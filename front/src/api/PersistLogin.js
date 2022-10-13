import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import RefreshToken from "./RefreshToken";
import useAuth from "./useAuth";
function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = RefreshToken();
  const { auth, persist } = useAuth();
  useEffect(() => {
    let isMounted = true;
    console.log(persist);
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    return () => (isMounted = false);
  }, []);
  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(auth);
  }, [isLoading]);
  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
}

export default PersistLogin;
