import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import Alert from "../../components/alert";
import Captcha from "../../components/captcha";


const Login=()=>{
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [captcha, setCaptcha]=useState('');

    const [captchaKey, setCaptchaKey]=useState(0);

    const [alertContent, setAlertContent]=useState(false);
    const [alertExtraFunc, setAlertExtraFunc]=useState();

    const [captchaInputValue, setCaptchaInputValue]=useState('');
    const [usernameInputValue, setUsernameInputValue]=useState('');
    const [passwordInputValue, setPasswordInputValue]=useState('');

    const [wrongCaptcha, setWrongCaptcha]=useState(false)
    const [wrongUsername, setWrongUsername]=useState(false)
    const [wrongPassword, setWrongPassword]=useState(false)


    const navigate=useNavigate();
    function submitLoginInfo()
    {
        if(username===''||password===''||captcha==='')
            return;
        
        axios.post('/login/api/postLoginInfo',{
            username,
            password,
            captcha
        })
        .then(response=>{
            if(response.data.code===1)
            {
                localStorage.setItem('token', response.data.token);//保存token

                setAlertContent('登录成功');
                setAlertExtraFunc(()=>{
                    return()=>{
                        navigate('/');
                    };
                })
            }
        })
        .catch(error=>{
            setCaptchaKey(prekey=>prekey+1)//刷新验证码
            if(error.response.data.code===2)
            {
                setWrongCaptcha(true);
                setCaptchaInputValue('');
            }
            else if(error.response.data.code===3)
            {
                setWrongUsername(true);
                setUsernameInputValue('');
            }
            else if(error.response.data.code===4)
            {
                setWrongPassword(true);
                setPasswordInputValue('');
            }
            console.error(error);
        })
    }

    const loginInput=classNames('w-60 h-5 border rounded-md mt-4 px-1 py-0.5 text-sm focus:outline-none focus:shadow-lg');
    const submitLoginInfoBtn=classNames('w-24 h-8 border rounded-full mt-1 pt-0.5 bg-blue-500 text-center text-white hover:cursor-pointer active:bg-blue-600 active:shadow-lg');
    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="signupFormContainer flex flex-col items-center border my-auto border-slate-400 shadow-thick px-4 py-8 bg-white">
                    <div className="signupTitle mb-6 font-mono text-xl">Login</div>
                    <div>
                        <input type="text" placeholder="用户名" value={usernameInputValue} className={`${loginInput} ${wrongUsername ? 'border-red-600' : 'border-slate-400'}`}
                        onChange={(event)=>{setUsername(event.target.value);setUsernameInputValue(event.target.value)}}
                        onFocus={()=>{setWrongUsername(false)}}/>
                        { wrongUsername && <div className="absolute ml-1 text-xs text-red-600">用户名错误</div> }
                    </div>
                    <div>
                        <input type="password" placeholder="密码" value={passwordInputValue} className={`${loginInput} ${wrongPassword ? 'border-red-600' : 'border-slate-400'}`}
                        onChange={(event)=>{setPassword(event.target.value);setPasswordInputValue(event.target.value)}}
                        onFocus={()=>{setWrongPassword(false)}}/>
                        { wrongPassword && <div className="absolute ml-1 text-xs text-red-600">密码错误</div> }
                    </div>
                    <div className="flex flex-row items-center mt-2">
                        <input type="text" placeholder="验证码" value={captchaInputValue} 
                        className={`border rounded-md w-36 h-5 px-1 py-0.5 mr-2 text-sm focus:outline-none focus:shadow-lg ${wrongCaptcha ? 'border-red-600' : 'border-slate-400'}`}
                        onChange={(event)=>{setCaptcha(event.target.value); setCaptchaInputValue(event.target.value);}}
                        onFocus={()=>setWrongCaptcha(false)}/>

                        {wrongCaptcha && (
                            <div className="absolute mt-10 ml-1 text-xs text-red-600">验证码错误</div>
                        )}

                        <Captcha key={captchaKey}/>
                    </div>
                    <a className="text-blue-600 underline mt-12" href="/signup">signup</a>
                    <div className={submitLoginInfoBtn} onClick={submitLoginInfo}>登录</div>
                </div>
            </Content>
            <Alert initialContent={alertContent} extraFunc={alertExtraFunc}/>
        </PageContainer>
    );
}

export default Login;