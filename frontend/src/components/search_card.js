import React, {useState} from "react";

import SearchBox from "./search_box";

const SearchCard=()=>{
    const [folded, setFolded]=useState(true);

    return(
        <div className="flex flex-col">
            <SearchBox/>
            <div className="flex flex-col mt-1 mx-0.5 py-1 px-0.5">
                <div className="flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
                    className={`cursor-pointer transition-all ease-in-out duration-500 ${!folded && 'rotate-90'}`}
                    onClick={()=>{setFolded(!folded)}}>
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    <div className="ml-1 text-sm">筛选条件</div>
                </div>
                <div className={`transition-all ease-out duration-700 overflow-hidden text-sm text-gray-600 ${folded ? 'max-h-0' : 'max-h-24'}`}>
                    <div className="flex flex-row items-center h-5 border-b border-gray-400 py-1 box-content">
                        <div className="mr-1.5 ml-1">类型:</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">全部</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">文本</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">文件</div>
                    </div>
                    <div className="flex flex-row items-center h-5 border-b border-gray-400 box-content py-1">
                        <div className="mr-1.5 ml-1">大小:</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">全部</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">0~10MB</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">10~100MB</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">100~1000MB</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">大于1000MB</div>
                    </div>
                    <div className="flex flex-row items-center h-5 py-1 box-content">
                        <div className="mr-1.5 ml-1">时间:</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">全部</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">1周以内</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">1月以内</div>
                        <div className="ml-2 px-1.5 py-0.5 cursor-pointer hover:bg-sky-300 hover:text-sky-700 hover:rounded-lg">1年以内</div>
                    </div>
                </div>
                <div className="border-b border-gray-400"/>
            </div>
        </div>
    )
};

export default SearchCard;