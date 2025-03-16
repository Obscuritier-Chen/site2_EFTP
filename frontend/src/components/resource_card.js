import React from "react";
import { useNavigate } from "react-router";

import defaultResImg from '../assets/images/defaultResImg.jpg'
import resImg from '../assets/images/resImg.jpg'
import LazyLoad from "react-lazyload";

const ResourceCard=({resType, resId, resTitle, resUploadTime})=>{
    const navigate=useNavigate();
    return(
        <div className="max-w-52 w-full h-[152px]  rounded-md shadow-md cursor-pointer" onClick={()=>{navigate(`/display/${resType==='UploadFiles' ? 'files' : 'text'}/${resId}`)}}>
            <div className="w-full h-28 rounded-t-md bg-none overflow-hidden">
                {
                    resType==='UploadText' ? <img className="object-cover w-full h-full" alt="" src={defaultResImg}/> : 
                    <LazyLoad className="h-full" placeholder={<img className="object-cover w-full h-full" alt="" src={defaultResImg}/>}>
                        <img className="object-cover w-full h-full" alt="" src={resImg}/>
                    </LazyLoad>
                }
            </div>
            <div className="w-full h-10 px-2 py-0.5 bg-white rounded-b-md">
                <div className="h-[17px] text-[15px] overflow-hidden">{resTitle}</div>
                <div className="mt-0.5 text-sm float-right text-gray-500">{resUploadTime}</div>
            </div>
        </div>
    )
}

export default ResourceCard;