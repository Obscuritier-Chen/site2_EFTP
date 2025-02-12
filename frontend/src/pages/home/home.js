import React, { useEffect, useState } from "react";
import axios from "axios";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import SearchCard from "../../components/search_card";
import Carousel from "../../components/carousel";

const Home=()=>{
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
            </Content>
        </PageContainer>
    );
}

export default Home