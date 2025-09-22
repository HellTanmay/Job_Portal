import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';


export const LoginContext = createContext();


export const LoginProvider = ({ children }) => {
 
  const [loginInfo, setLoginInfo] = useState({
    isLoggedIn: false,
    username: '',
    role:''
  });
  console.log(loginInfo)
 useEffect(()=>{
    axiosInstance.get('/auth/protected')
    .then(res=>{
      console.log(res)
      if(res.status===200){
        setLoginInfo({
          isLoggedIn:true,
          username:res.data.username,
          role:res.data.role     
        })
      }})
  },[])
 const login = (userData) => {
    setLoginInfo({
      isLoggedIn: true,
      ...userData
    });
  };

  // Function to logout
  const logout = async() => {
    const res=await axiosInstance.post('/auth/logout')
  if(res.status===200){
    setLoginInfo({
      isLoggedIn: false,
      username: '',
      role:''
    });
  }
  };
console.log(loginInfo)
  return (
    <LoginContext.Provider value={{ loginInfo, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
