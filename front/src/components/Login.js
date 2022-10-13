import { useRef, useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../api/useAuth";

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

  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [mail, pwd]);

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
      setMail("");
      setPwd("");
      setSuccess(true);
      navigate(from, { replace: true });
      console.log(response);
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
  return (
    <>
      {/* {success ? ( */}
      {/* navigate("/") */}
      {/* ) : ( */}
      {/* //navigate("/") */}
      <div className="box">
        <div className="container">
          <div>로그인</div>
          <form className="form" onSubmit={handleSubmit}>
            <p className="desc">이메일</p>
            <input
              className="input"
              type="email"
              id="email"
              ref={userRef}
              onChange={(e) => setMail(e.target.value)}
              value={mail}
              required
              autoComplete="off"
              placeholder="예) jwt123@gmail.com"
            />

            <p className="desc">비밀번호</p>
            <input
              className="input"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              autoComplete="off"
              placeholder="영문, 숫자, 대문자 포함 8-16자"
            />

            <button className="register_btn" disabled={false}>
              로그인
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
