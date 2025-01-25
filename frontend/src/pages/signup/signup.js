import React, { useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import Alert from "../../components/alert";

const Signup=()=>{
    const signupInput=classNames('w-60 h-5 border rounded-md mt-4 px-1 py-0.5 text-sm focus:outline-none focus:shadow-lg');
    const submitSignupInfo=classNames('w-24 h-8 border rounded-full mt-1 pt-0.5 bg-blue-500 text-center text-white hover:cursor-pointer active:bg-blue-600 active:shadow-lg');

    const [usernameOverlong, setUsernameOverlang]=useState(false);
    const [newUsername, setNewUsername]=useState('');
    function handleUsernameChange(event)
    {
        setNewUsername(event.target.value);
        event.target.value.length>20 ? setUsernameOverlang(true) : setUsernameOverlang(false);
    }

    const [passwordAlert, setPasswordAlert]=useState(false);
    const [repasswordAlert, setRepasswordAlert]=useState(false);
    const [newPassword, setNewPassword]=useState('');
    function handlePasswordChange(event)
    {
        setNewPassword(event.target.value);
        const tempNewPassword=event.target.value;

        const regex=/^[!-~]+$/;
        if(tempNewPassword.length===0)
            setPasswordAlert(false);
        else if(tempNewPassword.length<4||tempNewPassword.length>32)
            setPasswordAlert('密码应为4~32字符');
        else if(!regex.test(tempNewPassword))
            setPasswordAlert('密码仅支持键盘可输入字符');
        else
            setPasswordAlert(false);
    }
    
    const [newRepassword, setReNewPassword]=useState('');
    function handleRepasswordChange(event)
    {
        setReNewPassword(event.target.value);
        if(newPassword!==event.target.value)
            setRepasswordAlert('与密码不匹配');
        else
            setRepasswordAlert(false);
    }

    const [alertContent, setAlertContent]=useState(false);
    const [alertExtraFunc, setAlertExtraFunc]=useState();

    
    const navigate=useNavigate();
    function handleSubmitClick()
    {
        if(newPassword!==newRepassword)
            return;

        if(newUsername.length<1||newUsername.length>20)
            return;

        if(newPassword.length<4||newPassword.length>32)
            return;

        const regex=/^[!-~]+$/;
        if(!regex.test(newPassword))
            return;

        axios.post('/signup/api/postSignupInfo',{
            username: newUsername,
            password: newPassword,
        })
        .then(response=>{
            if(response.data.code===1)
            {
                setAlertContent('注册成功');
                setAlertExtraFunc(()=>{//react需要通过执行函数来获取该函数 所以需要将其用return包裹
                    return()=>{
                        navigate('/login');
                    };
                });
            }   
        })
        .catch(error=>{
            if(!error.response.data.code)
                console.error(error);
            if(error.response.data.code===2)
                setAlertContent('用户名已被使用');
            else if(error.response.data.code===3)
                setAlertContent('非法表单');
            else
                console.error(error);
        });
    }

    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="signupFormContainer flex flex-col items-center border my-auto border-slate-400 shadow-thick px-4 py-8 bg-white">
                    <div className="signupTitle mb-6 font-mono text-xl">Signup</div>
                    <div>
                        <input type="text" placeholder="用户名" className={`${signupInput} ${usernameOverlong ? 'border-red-600' : 'border-slate-400'}`} onChange={handleUsernameChange}/>
                        {usernameOverlong && <div className="absolute text-xs text-red-600">用户名不得超过20字符</div>}
                    </div>
                    <div>
                        <input type="password" placeholder="密码" className={`${signupInput} ${!passwordAlert ? 'border-slate-400': 'border-red-600'}`} onChange={handlePasswordChange}/>
                        <div className="absolute text-xs text-red-600">{passwordAlert}</div>
                    </div>
                    <div>
                        <input type="password" placeholder="重复密码" className={`${signupInput} ${!repasswordAlert ? 'border-slate-400': 'border-red-600'}`} onChange={handleRepasswordChange}/>
                        <div className="absolute text-xs text-red-600">{repasswordAlert}</div>
                    </div>
                    <a className="text-blue-600 underline mt-12" href="/login">login</a>
                    <div className={submitSignupInfo} onClick={handleSubmitClick}>注册</div>
                </div>
            </Content>
            <Alert initialContent={alertContent} extraFunc={alertExtraFunc}/>
        </PageContainer>
    );
}

export default Signup;