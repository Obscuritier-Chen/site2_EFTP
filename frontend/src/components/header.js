import React, { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { useNavigate } from "react-router";

import getUserInfo from "../utils/get_user_info";

import UnloginNavRight from "./header_components/unlogin_nav_right";
import LoginNavRight from "./header_components/login_nav_right";

const Header=()=>{
    const [loginStatus, setLoginStatus]=useState(false);
    const [username, setUsername]=useState('');

    useEffect(()=>{
        const _getUserInfo=async()=>{
            const response=await getUserInfo();
            if(response.code===1)
            {
                setLoginStatus(true);
                setUsername(response.user.username);
            }
            else
                setLoginStatus(false);
        }
        _getUserInfo();
    },[])
    

    const nav_li=classNames('inline-block', 'px-2', 'py-1', 'mx-2', 'rounded', 'hover:bg-sky-300', 'hover:text-sky-800', 'hover:cursor-pointer');

    const navigate=useNavigate();
    return(
        <div className="headerContainer sticky top-0 flex flex-row items-center px-[15%] py-2 border-b border-slate-400 shadow-md bg-white z-10">
            <div className="logo font-mono text-2xl cursor-pointer" onClick={()=>{navigate('/')}}>EFTP</div>
            <nav className="ml-6">
                <ul className="list-none m-0">
                    <li className={nav_li}>test1</li>
                    <li className={nav_li}>test2</li>
                    <li className={nav_li}>test3</li>
                    <li className={nav_li}>test4</li>
                </ul>
            </nav>
            {loginStatus ? <LoginNavRight username={username}/> : <UnloginNavRight/>}
        </div>
    );
}

export default React.memo(Header);//react.memo包裹防止被父组件状态变化导致刷新