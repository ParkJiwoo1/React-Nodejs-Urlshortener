const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const users = [
  {
    id: "1",
    username: "park",
    mail: "park@gmail.com",
    pwd: "a1234",
    isAdmin: true,
  },
];

let refreshTokens = [];

app.post("/api/register", (req, res) => {
  const { username, mail, pwd } = req.body;
  const isAdmin = true;
  const check = users.find((x) => x.mail === mail);
  if (!check) {
    users.push({ username, mail, pwd, isAdmin });
    console.log({ username, mail, pwd, isAdmin });
    console.log(users);
    res.json({ username, mail, pwd, isAdmin });
  } else {
    res.json("already exist");
  }
});

app.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("refresh token is invalid");
  }
  jwt.verify(refreshToken, "myRefreshKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "tokenKey", {
    expiresIn: "1h",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshKey", {});
};

app.post("/api/login", (req, res) => {
  const { mail, pwd } = req.body;
  const user = users.find((x) => {
    return x.mail === mail && x.pwd === pwd;
  });
  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      mail: user.mail,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("username or password incorrect");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "tokenKey", (err, user) => {
      if (err) {
        return res.status(403).json("token invalid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("not authenticated");
  }
};
app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("user has been deleted");
  } else {
    req.status(403).json("not allowed to delete");
  }
});
app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("logged out successfully");
});
app.listen(5000, () => console.log("back running"));
