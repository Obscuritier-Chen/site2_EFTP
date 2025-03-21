import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router";

const SearchBox=({filterChoices})=>{
    const [query, setQuery]=useState('/search/?');
    const [q, setQ]=useState('');

    useEffect(()=>{
        if(Object.values(filterChoices).every((value) => value === 'all'))
        {
            setQuery(`/search/?q=${q}`)
            return;
        }

        let newQuery=`/search/?q=${q}`;
        for(let key in filterChoices)
            if(filterChoices[key]!=='all')
                newQuery+=`&${key}=${filterChoices[key]}`;

        setQuery(newQuery);
    },[filterChoices, q])

    const [searchBoxOnfocus, setSearchBoxOnFocus]=useState(false);

    const navigate=useNavigate()

    return(
        <div className="relative">
            <div className={`relative w-[650px] h-6 flex flex-row py-[3px] px-2 rounded-full bg-white z-10`}>
                <form className="flex flex-1 ml-1" onSubmit={(e)=>{e.preventDefault();navigate(query)}}>
                    <input type="text" className="flex-1 border-none outline-none" placeholder="search" 
                    onFocus={()=>{setSearchBoxOnFocus(true);}} onBlur={()=>{setSearchBoxOnFocus(false)}} onChange={(e)=>{setQ(e.target.value)}}/>
                </form>
                
                <svg className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" onClick={()=>{console.log('test')}}>
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
            </div>
            <div className={`absolute z-[9] top-[-2px] h-7 rounded-full bg-blue-600 transition-all duration-700 ease-in-out
                            ${searchBoxOnfocus ? 'w-[654px] left-[-2px]' : 'w-0 left-1/2'}`}></div>
            <div className='absolute z-[8] top-[-2px] left-[-2px] w-[654px] h-7 rounded-full bg-gray-300'></div>
        </div>
    );
};

export default SearchBox;