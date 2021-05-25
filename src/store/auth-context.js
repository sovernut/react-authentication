import React, { useState, useEffect, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
let logoutTimer;
const calculateRemainingTime = (expTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retriveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpireTime = localStorage.getItem("expireTime");

  const remainTime = calculateRemainingTime(storedExpireTime);
  if (remainTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainTime,
  };
};


export const AuthContextProvider = (props) => {
  const tokenData = retriveStoredToken();
  let initialToken;
  
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expireTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expireTime", expireTime);
    const remainingTime = calculateRemainingTime(expireTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
