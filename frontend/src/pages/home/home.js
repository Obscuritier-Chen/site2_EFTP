import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import SearchCard from "../../components/search_card";
import Carousel from "../../components/carousel";
import ResourceCard from "../../components/resource_card";

const Home=()=>{
    const [searchResult, setSearchResult]=useState([]);

    useEffect(()=>{
        axios.get('/search/api')
        .then((response)=>{
            const latestRes=response.data.queryResult ? response.data.queryResult.slice(0,9) : [];
            setSearchResult(latestRes.map((resource)=>{
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
    },[])

    const navigate=useNavigate();
    
    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="mt-5"> {/* 不知道这是否是标准的做法 反正就给个margin-top罢了 */}
                    <SearchCard/>
                </div>
                <div className="mt-5">
                    <Carousel/>
                </div>
                <div className="mt-5 w-[850px]">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-end pb-1 border-b border-gray-700">
                            <div className="text-xl">最新资源</div>
                            <div className="flex flex-row items-center ml-auto text-sm cursor-pointer" onClick={()=>{navigate('/search')}}>更多资源
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                            </div>
                        </div>
                        <div className="grid w-full mt-5 grid-cols-4 gap-x-4 gap-y-8">
                            {
                                searchResult.map((resource)=><ResourceCard resType={resource.type} resId={resource.id} resTitle={resource.title} resUploadTime={resource.time}/>)
                            }
                        </div>
                    </div>
                </div>
            </Content>
        </PageContainer>
    );
}

export default Home