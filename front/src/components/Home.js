import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../api/useAuth";

function Home() {
  const { auth, setAuth } = useAuth();

  //console.log(jwt_decode(auth.accessToken));
  return (
    <div>
      {auth.accessToken ? <div>{auth.accessToken}</div> : <div>null</div>}
      <ul>
        <li>
          <Link to="/Register">회원가입</Link>
        </li>
        <li>
          <Link to="/Login">로그인</Link>
        </li>
        <li>
          <Link to="/Users">user</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
