import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import SearchCard from "../../components/search_card";
import ResourceCard from "../../components/resource_card";
import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
const Search=()=>{
    const [searchResult, setSearchResult]=useState([]);
    const outerFilterChoices=useRef({
        type: 'all',
        size: 'all',
        time: 'all',
    })

    function handleOuterFilterChoicesChange()
    {
        const regex = /q=[^&]*/;
        const q=window.location.search.match(regex) ? window.location.search.match(regex)[0] : '';
        let search=window.location.search ? `?${q}` : '?';
        for(let key in outerFilterChoices.current)
            if(outerFilterChoices.current[key]!=='all')
                search+=`&${key}=${outerFilterChoices.current[key]}`;
        getFilterResult(search)
    }

    const setOuterFilterChoices=useCallback((newChoices)=>{
        outerFilterChoices.current=newChoices;
        handleOuterFilterChoicesChange()
    },[])

    const Locaction=useLocation();

    function getSearchResult()
    {
        const pathname=`/search/api/${window.location.search}`;
        axios.get(pathname)
        .then((response)=>{
            setSearchResult(response.data.queryResult.map((resource)=>{
                const newTime=new Date(resource.time).toISOString().substring(0, 10);
                return {
                    ...resource,
                    time: newTime,
                }
            }));
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    useEffect(()=>{
        getSearchResult();
    },[Locaction.search])

    function getFilterResult(search)
    {
        const pathname=`/search/api/${search}`;
        axios.get(pathname)
        .then((response)=>{
            setSearchResult(response.data.queryResult.map((resource)=>{
                const newTime=new Date(resource.time).toISOString().substring(0, 10);
                return {
                    ...resource,
                    time: newTime,
                }
            }));
        })
        .catch((error)=>{
            console.error(error);
        })
    }

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
            </Content>
        </PageContainer>
    );
}

export default Search;