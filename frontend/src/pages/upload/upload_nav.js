import React from "react";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";

const UploadNav=()=>{
    const navigate=useNavigate();
    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="flex flex-col w-full mt-4 pt-4 pb-6 px-5 bg-white rounded-lg shadow-lg">
                    <div className="text-2xl pb-1">上传作品</div>
                    <div className="px-4 mt-4">
                        <div className="flex flex-col px-4 py-5 border rounded-xl border-gray-400 shadow-md">
                            <div className="text-xl">上传纯文本</div>
                            <div className="text-[15px] mt-2 ml-2">纯文本资源分享</div>
                            <div className="flex flex-row items-end mt-1">
                                <div className="w-20 h-8 ml-2 py-1 bg-blue-500 text-white text-center text-lg rounded-xl cursor-pointer hover:shadow-lg" onClick={()=>{navigate('/upload/text')}}>GO!</div>
                                <div className="ml-auto text-sm text-gray-500">任何用户均有权限上传</div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-5 mt-5 border rounded-xl border-gray-400 shadow-md">
                            <div className="text-xl">上传Markdown</div>
                            <div className="text-[15px] mt-2 ml-2">上传Markdown格式文本，支持丰富格式，支持配图</div>
                            <div className="flex flex-row items-end mt-1">
                                <div className="w-20 h-8 ml-2 py-1 bg-blue-500 text-white text-center text-lg rounded-xl cursor-pointer hover:shadow-lg" onClick={()=>{navigate('/upload/markdown')}}>GO!</div>
                                <div className="ml-auto text-sm text-gray-500">任何用户均有权限上传</div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-5 mt-5 border rounded-xl border-gray-400 shadow-md">
                            <div className="text-xl">上传资源</div>
                            <div className="text-[15px] mt-2 ml-2">可上传图片，视频，压缩包多种文件。文件大小不可超过500MB</div>
                            <div className="flex flex-row items-end mt-1">
                                <div className="w-20 h-8 ml-2 py-1 bg-blue-500 text-white text-center text-lg rounded-xl cursor-pointer hover:shadow-lg" onClick={()=>{navigate('/upload/resource')}}>GO!</div>
                                <div className="ml-auto text-sm text-gray-500">任何用户均有权限上传</div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-5 mt-5 border rounded-xl border-gray-400 shadow-md">
                            <div className="text-xl">上传资源+介绍</div>
                            <div className="text-[15px] mt-2 ml-2">可为上传的资源搭配Markdown文案。文件大小不可超过500MB</div>
                            <div className="flex flex-row items-end mt-1">
                                <div className="w-20 h-8 ml-2 py-1 bg-blue-500 text-white text-center text-lg rounded-xl cursor-pointer hover:shadow-lg" onClick={()=>{navigate('/upload/mixresource')}}>GO!</div>
                                <div className="ml-auto text-sm text-gray-500">贡献者与核心贡献者有权限上传</div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-5 mt-5 border rounded-xl border-gray-400 shadow-md">
                            <div className="text-xl">上传大型资源</div>
                            <div className="text-[15px] mt-2 ml-2">文件大小最高支持10GB</div>
                            <div className="flex flex-row items-end mt-1">
                                <div className="w-20 h-8 ml-2 py-1 bg-blue-500 text-white text-center text-lg rounded-xl cursor-pointer hover:shadow-lg" onClick={()=>{navigate('/upload/bigresource')}}>GO!</div>
                                <div className="ml-auto text-sm text-gray-500">仅核心贡献者有权限上传</div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </Content>
        </PageContainer>

    );
    
}

export default UploadNav;