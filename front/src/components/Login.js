import { useRef, useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../api/useAuth";
import { useCookies } from "react-cookie";
import { setCookie } from "../api/Cookie";
const LOGIN_URL = "/login";
function Login() {
  const { auth, setAuth } = useAuth();
  let navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [cookies, setCookie] = useCookies(["mail"]);

  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [mail, pwd]);
  useEffect(() => {
    authCheck();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ mail, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      setAuth({ mail, pwd, accessToken });
      setCookie(mail, response.data.accessToken);
      setMail("");
      setPwd("");
      setSuccess(true);
      navigate(from, { replace: true });
      console.log(cookies);
      if (response.status === 200) navigate("/");
    } catch (err) {
      if (!err?.responose) {
        setErrMsg("No server response");
      } else if (err.response?.status === 400) {
        setErrMsg("missing email or password");
      } else if (err.respone?.status === 401) {
        setErrMsg("unauthorized");
      } else {
        setErrMsg("login failed");
      }
      console.log(errMsg);
      //errRef.current.focus();
    }
  };

  const authCheck = () => {
    const token = cookies.mail;
    axios
      .post("/login/refresh", { token: token })
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        console.log("refresh fail");
      });
  };
  return (
    <>
      {/* {success ? ( */}
      {/* navigate("/") */}
      {/* ) : ( */}
      {/* //navigate("/") */}
      <div className="box">
        <div className="container">
          <div>?????????</div>
          <form className="form" onSubmit={handleSubmit}>
            <p className="desc">?????????</p>
            <input
              className="input"
              type="email"
              id="email"
              ref={userRef}
              onChange={(e) => setMail(e.target.value)}
              value={mail}
              required
              autoComplete="off"
              placeholder="???) jwt123@gmail.com"
            />

            <p className="desc">????????????</p>
            <input
              className="input"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              autoComplete="off"
              placeholder="??????, ??????, ????????? ?????? 8-16???"
            />

            <button className="register_btn" disabled={false}>
              ?????????
            </button>
          </form>

          <Link to="/Register">no account?</Link>
          <Link to="/">home</Link>
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default Login;
