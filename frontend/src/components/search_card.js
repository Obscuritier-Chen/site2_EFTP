import React, {useState} from "react";
import classNames from "classnames";
import { produce } from "immer";

import SearchBox from "./search_box";

const SearchCard=()=>{
    const [folded, setFolded]=useState(true);
    const [filterChoices, setFilterChoices]=useState({
        type: 'all',
        size: 'all',
        time: 'all',
    });
    
    function handleFilterOptClick(attr, choice)
    {
        setFilterChoices((preChoices)=>produce(preChoices, draft=>{
            draft[attr]=choice;
        }));
    }

    const filterOption=classNames('ml-2 px-1.5 py-[1px] cursor-pointer rounded-lg hover:bg-sky-300 hover:text-sky-700')

    return(
        <div className="flex flex-col">
            <SearchBox/>
            <div className="flex flex-col mt-1 mx-0.5 py-1 px-0.5">
                <div className="flex flex-row items-center mb-0.5">
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
                        <div className={`${filterOption} ${filterChoices.type==='all' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('type', 'all')}}>全部</div>
                        <div className={`${filterOption} ${filterChoices.type==='text' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('type', 'text')}}>文本</div>
                        <div className={`${filterOption} ${filterChoices.type==='files' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('type', 'files')}}>文件</div>
                    </div>
                    <div className="flex flex-row items-center h-5 border-b border-gray-400 box-content py-1">
                        <div className="mr-1.5 ml-1">大小:</div>
                        <div className={`${filterOption} ${filterChoices.size==='all' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('size', 'all')}}>全部</div>
                        <div className={`${filterOption} ${filterChoices.size==='0~10MB' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('size', '0~10MB')}}>0~10MB</div>
                        <div className={`${filterOption} ${filterChoices.size==='10~100MB' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('size', '10~100MB')}}>10~100MB</div>
                        <div className={`${filterOption} ${filterChoices.size==='100~1000MB' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('size', '100~1000MB')}}>100~1000MB</div>
                        <div className={`${filterOption} ${filterChoices.size==='>1000MB' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('size', '>1000MB')}}>大于1000MB</div>
                    </div>
                    <div className="flex flex-row items-center h-5 py-1 box-content">
                        <div className="mr-1.5 ml-1">时间:</div>
                        <div className={`${filterOption} ${filterChoices.time==='all' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('time', 'all')}}>全部</div>
                        <div className={`${filterOption} ${filterChoices.time==='in_one_week' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('time', 'in_one_week')}}>1周以内</div>
                        <div className={`${filterOption} ${filterChoices.time==='in_one_month' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('time', 'in_one_month')}}>1月以内</div>
                        <div className={`${filterOption} ${filterChoices.time==='in_one_year' ? 'bg-sky-300 text-sky-700' : ''}`} onClick={()=>{handleFilterOptClick('time', 'in_one_year')}}>1年以内</div>
                    </div>
                </div>
                <div className="border-b border-gray-400"/>
            </div>
        </div>
    )
};

export default SearchCard;