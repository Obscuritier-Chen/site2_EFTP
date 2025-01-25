import React from "react";
import { useNavigate } from "react-router";

const UnloginNavRight=()=>{
    const navigate=useNavigate();
    return(
        <div className="UnloginNavRContainer flex flex-row ml-auto font-sans text-sm">
            <div className="login px-3 py-1 rounded-full bg-blue-500 text-white hover:shadow-thick hover:cursor-pointer" onClick={()=>{navigate('/login')}}>登录</div>
            <div className="signup px-3 py-1 ml-3 rounded-full bg-gray-500 text-white hover:shadow-thick hover:cursor-pointer" onClick={()=>{navigate('/signup')}}>注册</div>
        </div>
    );
}

export default UnloginNavRight