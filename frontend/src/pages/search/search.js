import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import SearchCard from "../../components/search_card";
import ResourceCard from "../../components/resource_card";
import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
const Search=()=>{
    const [searchResult, setSearchResult]=useState([]);
    const isFirstRender=useRef(true);
    const [outerFilterChoices, setOuterFilterChoices]=useState({
        type: 'all',
        size: 'all',
        time: 'all',
    });
    const Locaction=useLocation();
    let urlFilterChoices={
        type: 'all',
        size: 'all',
        time: 'all',
    };

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

        const params = new URLSearchParams(window.location.search);
        params.forEach((value, key) => {
            if (key !== 'q') {
              urlFilterChoices[key] = value;
            }
        });
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

    useEffect(()=>{
        if(isFirstRender.current)
        {
            isFirstRender.current=false;
            return;
        }
        
        const regex = /q=[^&]*/;
        let search=window.location.search ? `?${window.location.search.match(regex)[0]}` : '?';
        for(let key in outerFilterChoices)
            if(outerFilterChoices[key]!=='all')
                search+=`&${key}=${outerFilterChoices[key]}`;
        getFilterResult(search)
    },[outerFilterChoices])

    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="mt-5">
                    <SearchCard setOuterFilterChoices={setOuterFilterChoices} urlFilterChoices={urlFilterChoices}/>
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