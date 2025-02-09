import React, { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import Alert from "../../components/alert";
import MainCard from "../../components/main_card";

import { ReactComponent as FileIcon } from "../../components/upload_resources/svgs/file.svg";

import defaultAvatar from '../../assets/images/defaultAvatar.png'

const Display=()=>{
    function formatFileSize(bytes)
    {
        if(bytes === 0) 
            return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    const [display, setDisplay]=useState(null);
    const [likeNum, setLikeNum]=useState(0);
    const [dislikeNum, setDislikeNum]=useState(0);
    const [like, setLike]=useState(false);
    const [dislike, setDislike]=useState(false);

    function transformPathname(pathname, type)
    {
        const match = pathname.match(/^\/display\/(text|files)\/(.+)$/);

        if(type===1)
            return match ? `/display/api/getDisplay/${match[1]}/${match[2]}` : null;

        else if(type===2)
            return match ? `/display/api/evalue/${match[1]}/${match[2]}` : null;
    }

    function getResourceInfo_api(pathname)
    {
        return axios.get(pathname)//这大概是我写过最简单的axios
        .then((response)=>{
            return response.data;
        })
        .catch(()=>{
            return null;
        });
    }

    async function getResourceInfo()
    {
        const pathname=transformPathname(window.location.pathname, 1);
        let resourceInfo=null;

        if(!pathname)
            return;

        resourceInfo=await getResourceInfo_api(pathname);

        setLikeNum(resourceInfo.likeNum);
        setDislikeNum(resourceInfo.dislikeNum);
        setDisplay(resourceInfo);
    }

    function getEvaluationStatus_api(pathname)
    {
        return axios.get(`${pathname}/fetch`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then((response)=>{
            return response.data.evaluation;
        })
        .catch(()=>{
            return null;
        })
    }
    
    async function getEvaluationStatus()
    {
        const pathname=transformPathname(window.location.pathname, 2);

        if(!pathname)
            return;

        const evaluationStatus=await getEvaluationStatus_api(pathname);

        if(!evaluationStatus)
            return;

        if(evaluationStatus==='like')
            setLike(true);
        else if(evaluationStatus==='dislike')
            setDislike(true);
    }

    useEffect(()=>{
        getResourceInfo();
        getEvaluationStatus();
    },[])

    function handleEvalueBtnClick(voteType)//code from gemini combine of like and dislike
    { // voteType: 'like' 或 'dislike'
        if (!localStorage.token) {
            return;
        }
    
        const isLike = voteType === 'like';
        const setIsVote = isLike ? setLike : setDislike; // 根据 voteType 决定更新哪个状态
        const isVoted = isLike ? like : dislike;
        const isOppositeVoted = isLike ? dislike : like;
        const setOppositeVote = isLike ? setDislike : setLike;
        const voteNum = isLike ? likeNum : dislikeNum;
        const setVoteNum= isLike ? setLikeNum : setDislikeNum;
        const oppositeVoteNum = isLike ? dislikeNum : likeNum;
        const setOppositeVoteNum= isLike ? setDislikeNum : setLikeNum;
        const pathname = transformPathname(window.location.pathname, 2);
    
        if (!isVoted && !isOppositeVoted) { // 既没有赞，也没有踩
            setIsVote(true); // 设置为赞/踩
            setVoteNum(voteNum+1);
            axios.get(`${pathname}/create/${voteType}`, { // 调用 create API
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
        } else if (isVoted) { // 当前已经是赞/踩状态
            setIsVote(false); // 取消赞/踩
            setVoteNum(voteNum-1);
            axios.get(`${pathname}/delete`, { // 调用 delete API
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
        } else if (!isVoted && isOppositeVoted) { // 当前是相反的投票状态 (例如，当前是踩，点击赞)
            setIsVote(true); // 设置为赞/踩
            setOppositeVote(false); // 取消相反的投票状态
            setVoteNum(voteNum+1);
            setOppositeVoteNum(oppositeVoteNum-1);
            axios.get(`${pathname}/update`, { // 调用 update API
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
        }
    }
    function handleLikeBtnClick()
    {
        handleEvalueBtnClick('like');
    }
    
    function handleDislikeBtnClick()
    {
        handleEvalueBtnClick('dislike');
    }

    return(
        <PageContainer>
            <Header/>
            {
                !display ? null :<Content>
                    <MainCard>
                        <div className="text-2xl pb-1">{display.title}</div>
                        <div className="flex flex-row items-end mt-2 pb-2">
                            <div>
                                <div className="loginNavRContainer flex flex-row items-center">
                                    <div className="avatarContainer rounded-full w-6 h-6 overflow-hidden">
                                        <img src={defaultAvatar} alt="" className="object-cover w-full h-full"></img>
                                    </div>
                                    <div className="ml-2 font-bold">{display.author}</div>
                                </div>
                                <div className="mt-1 text-[13px] text-gray-600">
                                    {new Date(display.type==='text' ? display.uploadedAt : display.createdAt)//我当时脑子抽了?
                                    .toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-").replace(",", "")}
                                </div>
                            </div>
                            <div className="flex flex-row ml-auto text-sm text-gray-600">
                                <div className="flex flex-row ml-2">
                                    {display.viewNum}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="mt-0.5 ml-0.5" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                    </svg>
                                </div>

                                <div className="flex flex-row ml-2">
                                    {display.likeNum}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" className="mt-1 ml-0.5" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                    </svg>
                                </div>

                                <div className="flex flex-row ml-2">
                                    {display.downloadNum}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="mt-[3px] ml-[3px]" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full">
                            <div className="border-b border-gray-400 w-[49%]"/>
                            <div className="w-[3px] h-[3px] border mx-2 border-gray-500 rounded-full bg-gray-400"/>
                            <div className="border-b border-gray-400 w-[49%]"/>
                        </div>
                        <div className="w-full px-2 py-4 break-all">
                            {display.text}
                        </div>
                        <div className="flex flex-row items-center justify-center w-full">
                            <div className="border-b border-gray-400 w-[49%]"/>
                            <div className="w-[3px] h-[3px] border mx-2 border-gray-500 rounded-full bg-gray-400"/>
                            <div className="border-b border-gray-400 w-[49%]"/>
                        </div>
                        {
                            display.type!=='files' ? null : <div className="flex flex-col px-2 pb-4 pt-3">
                                <div className="text-[17px]">资源下载</div>
                                <div className="flex flex-col w-3/5 mt-2 border border-gray-400 rounded bg-gray-50">
                                    {
                                        display.files.map((file)=><div className="flex flex-row items-center py-1 px-3 border-b border-gray-400 last:border-none">
                                            <FileIcon className="mt-0.5"/>
                                            <div className="ml-0.5">{file.filename}</div>
                                            <div className="ml-3 text-[13px]">{formatFileSize(file.size)}</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto mt-1 hover:scale-110 hover:cursor-pointer" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                            </svg>
                                        </div>)
                                    }
                                </div>
                            </div>
                        }
                        {
                            display.type!=='files' ? null :<div className="flex flex-row items-center justify-center w-full">
                                <div className="border-b border-gray-400 w-[49%]"/>
                                <div className="w-[3px] h-[3px] border mx-2 border-gray-500 rounded-full bg-gray-400"/>
                                <div className="border-b border-gray-400 w-[49%]"/>
                            </div>
                        }
                    <div className="flex flex-row items-center w-full px-3 pt-2">
                        <div className="flex flex-row items-center w-[10%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="gray" 
                            className={`cursor-pointer transition-all ease-in-out duration-300 ${like && 'fill-green-600'} ${!like && 'hover:translate-y-[-4px]  hover:fill-green-600'}`} viewBox="0 0 16 16"
                            onClick={handleLikeBtnClick}>
                                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                            </svg>
                            <div className="ml-1 text-sm">{likeNum}</div>
                        </div>
                        <div className="flex flex-row items-center w-[10%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="gray"
                            className={`cursor-pointer transition-all ease-in-out duration-300 ${dislike && 'fill-red-600'} ${!dislike && 'hover:translate-y-[4px]  hover:fill-red-600'}`} viewBox="0 0 16 16"
                            onClick={handleDislikeBtnClick}>
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            <div className="ml-1 text-sm">{dislikeNum}</div>
                        </div>
                        <div className="w-[10%]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="cursor-pointer hover:scale-105">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                    </div>
                    </MainCard>
                </Content>
            }
        </PageContainer>
    );
}

export default Display;