import React, { useEffect, useState } from "react";
import axios from "axios";

const Captcha=()=>{
    const [captcha, setCaptcha]=useState('');

    function getCaptcha()
    {
        axios.get('api/captcha/get')
        .then(response=>{
            setCaptcha(response.data);
        })
        .catch(error=>{
            console.error(error);
        });
    }

    useEffect(()=>{
        getCaptcha();
    },[]);

    return(
        <div className="cursor-pointer" dangerouslySetInnerHTML={{__html: captcha}} onClick={getCaptcha}/>
    );
}

export default Captcha;