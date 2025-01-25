import React from "react";
import defaultAvatar from '../../assets/images/defaultAvatar.png'

const LoginNavRight=({username})=>{
    return(
        <div className="loginNavRContainer flex flex-row items-center ml-auto">
            <div className="avatarContainer rounded-full w-6 h-6 overflow-hidden">
                <img src={defaultAvatar} alt="" className="object-cover w-full h-full"></img>
            </div>
            <div className="ml-2 font-bold">{username}</div>
        </div>
    )
}

export default LoginNavRight