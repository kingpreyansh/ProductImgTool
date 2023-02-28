import logoImg from "../assets/images/aventa-long-white-logo.png";
import React from "react";

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <img src={logoImg} width={150}/>
      </div>
    </div>
  )
}

export default Header;
