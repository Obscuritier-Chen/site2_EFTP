import React, { useState, useEffect } from "react";
import infoIcon from '../assets/images/infoIcon.png'

//完全是尸山 本来应当是在外面添加删除回调函数 就像对upload_resource中files的删除那样 懒得改了 使用是在父组件需要注意手动重设参数
//每次必须重新给extraFunc!!!!
const Alert=({initialContent, extraFunc=()=>{}})=>{//content为false是不显示 希望是正常的做法
    const [content, setContent]=useState(initialContent);

    // 如果 initialContent 发生变化，同步更新 content
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    if(!content)
        return null;

    return(
        <div className={'alertContainer absolute inset-0 flex items-center justify-center backdrop-blur-sm'}>
            <div className="relative flex flex-col items-center bg-white w-108 pb-5 pt-6 rounded-md shadow-thick">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" 
                className="absolute top-2 right-2 cursor-pointer hover:fill-[#ff0000] hover:scale-105" viewBox="0 0 16 16"
                onClick={()=>{setContent(false);}}>
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
                <div className="w-20 h-20">
                    <img src={infoIcon} alt="" className="object-cover"></img>
                </div>
                <div className="mt-9 text-4xl font-medium">{content}</div>
                <div className="mt-5 px-4 py-1 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:shadow-thick" 
                onClick={()=>{
                    setContent(false);
                    if(typeof extraFunc==='function' && extraFunc!==undefined)
                        extraFunc();
                }}>确认</div>
            </div>
        </div>
    );
};

export default Alert