
# react-authentication
* create Context to handle login information
```javascript
import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
  };
  const logoutHandler = () => {
    setToken(null);
  };

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
```
Use `isLoggedIn` to prevent login page
```javascript
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { useContext } from 'react'
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
```
save login to localStorage to make loginState persist!
```javascript
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token')
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token)
  };
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token')
  };
  ```
Add auto logout by using setTimeout
* when login setTimeout to logout function
```javascript
const loginHandler = (token, expireTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expireTime", expireTime);
    const remainingTime = calculateRemainingTime(expireTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };
  ```
  
