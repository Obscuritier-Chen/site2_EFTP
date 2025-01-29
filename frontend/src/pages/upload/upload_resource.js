import React, { useRef, useState } from "react";
import axios, { all } from "axios";
import { produce } from "immer";
import { useNavigate } from "react-router";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import Alert from "../../components/alert";
import UplResCard from "../../components/upload_resources/u_res_card";
import UplResHeader from "components/upload_resources/u_res_header";

const UploadResource=()=>{
    const [alertContent, setAlertContent]=useState(false);
    const [alertExtraFunc, setAlertExtraFunc]=useState();

    const [files, setFiles]=useState([]);
    //const fileKey=useRef(0);//useRef保证不会因为组件更新而重置，但需要保证其与组件渲染无关

    function calcFileSIzeSum()
    {
        return files.reduce((acc, file)=>acc+file.file.size, 0);
    }

    function addUploadFiles(file)//虽然我觉得应该把file搞成对象 但是似乎太麻烦了
    {
        //fileKey.current++;
        setFiles(prevFiles=>[
            ...prevFiles,//数组展开技巧
            {
                id: Date.now(),//fileKey.current,
                file,
                progress: 0,
                speed: 0,
                ok: null,
                uploading: false,
            }
        ]);
    }

    function deleteUploadFile(id)
    {
        setFiles(prevFiles => prevFiles.filter((file)=>file.id!==id));
    }

    function deleteAll()
    {
        setFiles([]);
    }

    const [dragOver, setDragOver]=useState(false)

    function handleDrop(event)
    {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);

        const file=event.dataTransfer.files[0];
        addUploadFiles(file);
    }

    function handleFileChange(event)
    {
        if(event.target.files.length===0)
            return;
        if(files.some((file)=>file.file.name===event.target.files[0].name && file.file.size===event.target.files[0].size))//判断文件是否相同，虽然应该用hash但是开销太大
            return;

        const file=event.target.files[0];
        addUploadFiles(file);
        event.target.value=null;
    }

    /*-------------------------上面基本是文件处理---------------------------- */
    const [title, setTitle]=useState('');

    async function uploadFile_require(filesNum, filesSize, title)
    {

        return axios.post('/upload/api/postFiles/require', 
        {
            filesNum,
            filesSize,
            title,
        },
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
    }

    async function uploadFiles_uplaod(token, file, id)
    {
        setFiles((prevFiles)=>produce(prevFiles, draft=>{
            const index=draft.findIndex((f)=>f.id===id);

            draft[index].uploading=true;
        }));

        const formData=new FormData();//不到为啥必须用formData
        formData.append('token', token);
        formData.append('file', file);

        let lastUpdateTime=Date.now(), lastUploadedBytes=0;

        return axios.post('/upload/api/postFiles/upload', formData,
        {

            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            onUploadProgress: (progressEvent)=>{
                const progress=(progressEvent.loaded/progressEvent.total).toFixed(4);
                
                const currentTime = Date.now();
                const timeDiff = (currentTime - lastUpdateTime);
                const uploadedBytesDiff = progressEvent.loaded - lastUploadedBytes;
                const speed = (uploadedBytesDiff / timeDiff);//Bytes per millisecond

                lastUpdateTime = currentTime;
                lastUploadedBytes = progressEvent.loaded;

                setFiles((prevFiles)=>produce(prevFiles, draft=>{
                    const index=draft.findIndex((f)=>f.id===id);
    
                    draft[index].progress=progress;
                    draft[index].speed=speed*1000;
                }));
            }
        })
        .then((response)=>{
            setFiles((prevFiles)=>produce(prevFiles, draft=>{
                const index=draft.findIndex((f)=>f.id===id);

                draft[index].ok=true;
                draft[index].uploading=false;
            }));

            return response;
        })
        .catch((error)=>{
            setFiles((prevFiles)=>produce(prevFiles, draft=>{
                const index=draft.findIndex((f)=>f.id===id);

                draft[index].ok=false;
                draft[index].uploading=false;
            }));

            return error.response;
        });
    }

    async function uploadFiles_over(token)
    {
        return axios.post('/upload/api/postFiles/over', 
        {
            token,
        },
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
    }

    async function uploadFilesProcess(title, files)
    {
        let token;
        let allSuccess=true;
        try
        {
            const filesNum=files.length;
            const filesSize=calcFileSIzeSum();

            const requireResponse=await uploadFile_require(filesNum, filesSize, title);

            if(requireResponse.status!==200)
                throw new Error({response:requireResponse.data, source:'require'});
                

            token=requireResponse.data.token;

            const uploadPromises=files.map((file)=>uploadFiles_uplaod(token, file.file, file.id));
            const uploadResponses=await Promise.all(uploadPromises);

            for(let i=0;i<uploadResponses.length;i++)
                if(uploadResponses[i].status!==200)
                    throw new Error({response:uploadResponses[i].data, source:'upload'});
        }
        catch(error){
            allSuccess=false;

            setFiles((prevFiles)=>produce(prevFiles, (draft)=>{
                draft.forEach((f)=>{
                    f.uploading=false;
                });
            }));

            if(error.source==='require')
            {
                setAlertContent('出现意外问题，请重试');
                setAlertExtraFunc();
            }
            else if(error.source==='upload')
            {
                error.code===-1 ? setAlertContent('文件途中失败，请重试') : setAlertContent('出现意外问题失败，请重试');
                setAlertExtraFunc();
            }
        }
        finally{
            if(token)
            {
                setFiles((prevFiles)=>produce(prevFiles, (draft)=>{
                    draft.forEach((f)=>{
                        f.uploading=false;
                    });
                }));

                const overResponse= await uploadFiles_over(token);

                if(overResponse.status!==200)
                {
                    allSuccess=false;

                    setAlertContent('出现意外问题，请重试');
                    setAlertExtraFunc();
                }

                if(allSuccess)
                {
                    setAlertContent('上传成功');
                    setAlertExtraFunc(()=>{return ()=>{
                        setTitle('');
                        deleteAll()
                    }});
                }
            }
        }
    }

    const navigate=useNavigate();

    const [titleAlert, setTitleAlert]=useState(false);

    function checkFileSubmit()
    {
        if(!localStorage.getItem('token'))//登录检测?
        {
            setAlertContent('未登录');
            setAlertExtraFunc(()=>{
                return navigate('/login');
            });
            return false;
        }
            
        if(title.length===0)
        {
            setTitleAlert(true);
            return false;
        }
            
        if(calcFileSIzeSum()>524288000||calcFileSIzeSum()===0)
        {
            setAlertContent('文件不符合要求');
            setAlertExtraFunc();
            return false;
        }
        return true;
    }

    function handleFileSubmitClick()
    {
        setAlertContent(false);//只是一个临时的解决方案 感觉Alert应该有一个reset的方法
        setAlertExtraFunc();

        if(!checkFileSubmit())
            return;

        uploadFilesProcess(title, files);
    }

    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="flex flex-col w-full mt-4 pt-4 pb-6 px-5 bg-white rounded-lg shadow-lg">
                    <div className="text-2xl pb-1">上传资源</div>
                    <div className="flex flex-col w-full px-[10%]">
                        <div className="flex flex-row items-center mt-6">
                            <label className="text-[17px] mb-0.5">标题:</label>
                            <input className={`flex-1 h-6  border rounded-md px-2 pt-0.5 pb-1 ml-3 focus:outline-none 
                            focus:shadow-lg focus:bg-white focus:border-gray-400
                            ${titleAlert ? 'border-red-500' : 'border-gray-300'} ${title.length ? 'bg-white' : 'bg-gray-100'}`} 
                            placeholder="输入标题" onInput={(e)=>{setTitle(e.target.value)}} onFocus={()=>{setTitleAlert(false)}} value={title}/>
                        </div>
                        <input type="file" id='file_upload' className="hidden" onChange={handleFileChange}/>{/* 我觉得dragover导致的内部元素变化会导致input在里面的话会被刷新 */}
                        <div className={`flex flex-col items-center justify-center h-60 mt-6 border border-gray-300 rounded-lg
                        ${dragOver ? 'bg-white' : 'bg-gray-100'}`}
                        onDragEnter={(e)=>{e.preventDefault();setDragOver(true);}} onDragOver={(e)=>{e.preventDefault();e.stopPropagation();}} onDragLeave={(e)=>{e.preventDefault();setDragOver(false);}}
                        onDrop={handleDrop}>
                            {
                                dragOver ? <div className="text-2xl">松手上传</div> :
                                <div className="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                                    </svg>
                                    <div className="mt-1 text-xl">将文件拖拽到此区域内</div>
                                    <div className="text-sm">
                                        或&nbsp;
                                        <label htmlFor="file_upload" className="text-blue-600 underline cursor-pointer">点击上传</label>
                                    </div>
                                </div>
                              
                            }
                        </div>

                        {/* 我也许应该将这个整合为1个component 但是现在这样做可以让其与外部交互方便一点 不用container转发 */}
                        {files.length===0 ? null : <div className="flex flex-col mt-6 border border-gray-300 rounded-lg">{/*必须把元素和三元表达式放一行，有点丑 */}
                                <UplResHeader fileSizeSum={calcFileSIzeSum()} deleteAll={deleteAll}/>
                                {files.map((file)=>(<UplResCard file={file} fileDelete={deleteUploadFile} key={file.id}/>))}
                            </div>
                        }
                        
                        <div className={`ml-auto px-1.5 py-1.5 w-24 rounded-md mt-4 text-white text-center 
                        ${calcFileSIzeSum()<=524288000 && calcFileSIzeSum()>0 && title.length!==0 ? 'bg-blue-500 cursor-pointer hover:bg-blue-600 hover:shadow-md' : 'bg-gray-300 cursor-default'}`}
                        onClick={handleFileSubmitClick}>
                            点击上传
                        </div>
                    </div>
                </div>
                <Alert initialContent={alertContent} extraFunc={alertExtraFunc}/>
            </Content>
        </PageContainer>
    );
}

export default UploadResource;