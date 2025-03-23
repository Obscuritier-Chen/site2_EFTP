import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";

import SearchCard from "../../components/search_card";
import ResourceCard from "../../components/resource_card";
import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
const Search=()=>{
    const [searchResult, setSearchResult]=useState([]);
    const currentSearch=useRef('');
    const outerFilterChoices=useRef({
        type: 'all',
        size: 'all',
        time: 'all',
    })

    const perPage=40;
    const [currentPage, setCurrentPage]=useState(0);
    const [maxPage, setMaxPage]=useState(0);

    function getSearchResult(params)
    {
        currentSearch.current=params;
        const pathname=`/search/api/${params}`;
        axios.get(pathname)
        .then((response)=>{
            setSearchResult(response.data.queryResult.map((resource)=>{
                const newTime=new Date(resource.time).toISOString().substring(0, 10);
                return {
                    ...resource,
                    time: newTime,
                }
            }));
            setMaxPage(Math.ceil(response.data.totalDataNum/perPage));

            const regex = /page=(\d+)/;
            const page=params.match(regex) ? parseInt(params.match(regex)[1]) : 1;
            setCurrentPage(page);
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    function handleOuterFilterChoicesChange()
    {
        const regex = /q=[^&]*/;
        const q=window.location.search.match(regex) ? window.location.search.match(regex)[0] : '';
        let search=window.location.search ? `?${q}` : '?';
        for(let key in outerFilterChoices.current)
            if(outerFilterChoices.current[key]!=='all')
                search+=`&${key}=${outerFilterChoices.current[key]}`;
        if(search[1]==='&')
            search=search[0]+search.slice(2);
        getSearchResult(search)
    }

    const setOuterFilterChoices=useCallback((newChoices)=>{
        outerFilterChoices.current=newChoices;
        handleOuterFilterChoicesChange()
    },[])

    const Locaction=useLocation();

    useEffect(()=>{
        getSearchResult(window.location.search);
    },[Locaction.search])

    const navigate=useNavigate();

    function updatePageInSearch(search, num)
    {
        if (search.includes("page="))
            return search.replace(/([?&])page=\d+/, `$1page=${num}`);
        if (search==='?')
            return search + `page=${num}`;
        return search + `&page=${num}`;
    }

    const jumpToPageNum=useRef(0);

    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="mt-5">
                    <SearchCard setOuterFilterChoices={setOuterFilterChoices}/>
                </div>
                <div className="grid w-full mt-5 grid-cols-4 gap-x-4 gap-y-8">
                    {
                        searchResult.map((resource)=><ResourceCard resType={resource.type} resId={resource.id} resTitle={resource.title} resUploadTime={resource.time}/>)
                    }
                </div>
                <div className="flex flex-row items-center mt-5">
                    <div className="flex flex-row items-center self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"
                        className={`${currentPage-1>0 ? 'hover:scale-110 cursor-pointer' : 'fill-gray-500 cursor-default'}`}
                        onClick={()=>{currentPage-1>0 && navigate(`/search/${updatePageInSearch(currentSearch.current, currentPage-1)}`)}}>
                            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                        </svg>
                        <div className="mx-1.5">{currentPage}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"
                        className={`${currentPage+1<=maxPage ? 'hover:scale-110 cursor-pointer' : 'fill-gray-500 cursor-default'}`}
                        onClick={()=>{currentPage+1<=maxPage && navigate(`/search/${updatePageInSearch(currentSearch.current, currentPage+1)}`)}}>
                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                    <div className="flex flex-row items-center ml-3">
                        <form onSubmit={(e)=>{
                            e.preventDefault(); 
                            if(jumpToPageNum.current!==currentPage && jumpToPageNum.current>0 &&jumpToPageNum.current<=maxPage)
                                navigate(`/search/${updatePageInSearch(currentSearch.current, jumpToPageNum.current)}`)
                        }}>
                            <input className="w-4 h-[18px] pl-0.5 outline-none border border-gray-400 rounded bg-transparent focus:border-gray-800 focus:shadow-md" 
                            onChange={(e)=>{jumpToPageNum.current=parseInt(e.target.value)}}/>
                        </form>
                        <div className="ml-1 mb-0.5">/</div>
                        <div className="ml-1">{maxPage}</div>
                    </div>
                </div>
            </Content>
        </PageContainer>
    );
}

export default Search;