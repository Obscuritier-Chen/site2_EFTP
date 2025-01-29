import React, { useEffect, useState } from "react";
import axios from "axios";

import PageContainer from "../../components/page_container";
import Header from "../../components/header";
import Content from "../../components/content";
import Alert from "../../components/alert";

const UploadText=()=>{
    const maxTextNum=5000;
    const [textNum, setTextNum]=useState(0);
    const [exceedTextLim, setExceedTextLim]=useState(false);
    const [text, setText]=useState('');
    const [alertContent, setAlertContent]=useState(false);
    const [alertExtraFunc, setAlertExtraFunc]=useState();
    const [title, setTitle]=useState('')
    //title部分逻辑有些冗余 懒得改了

    function handleTextInput(event)//我知道这个代码很烂很不优美 但是textarea的scrollheight计算有问题 当删掉1行时 scrollHeight不会突变而是会每多删掉一个字符减少1点 auto能够强制刷新scrollHeight
    {
        setText(event.target.value);
        setTextNum(event.target.value.length);
        if(event.target.value.length>maxTextNum)
            setExceedTextLim(true);
        else
            setExceedTextLim(false);
        //setTextareaHeight(event.target.scrollHeight);
        event.target.style.height='auto';
        event.target.style.height=`${event.target.scrollHeight}px`;
    }

    function uploadText()
    {
        if(textNum===0||!title)
        {
            setAlertContent('上传内容不得为空');
            setAlertExtraFunc();
        }

        if(textNum>maxTextNum)
            return;

        // 将<和>转义成HTML实体
        const sanitizedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
        // 使用encodeURIComponent确保换行符和空格被编码
        const encodedText = encodeURIComponent(sanitizedText);

        axios.post('/upload/api/postText', //axios url,body,header
        {
            title,
            text: encodedText,
        },
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(response=>{
            setAlertContent('上传成功');
            setAlertExtraFunc();
        })
        .catch(error=>{
            console.error(error.response);
        });
    }

    return(
        <PageContainer>
            <Header/>
            <Content>
                <div className="flex flex-col w-full mt-4 pt-4 pb-6 px-5 bg-white rounded-lg shadow-lg">
                    <div className="text-2xl pb-1">上传文本</div>
                    <div className="flex flex-col w-full px-[10%]">
                        <div className="flex flex-row items-center mt-6">
                            <label className="text-[17px] mb-0.5">标题:</label>
                            <input className={`flex-1 h-6 ${title.length ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md px-2 pt-0.5 pb-1 ml-3 focus:outline-none 
                            focus:shadow-lg focus:bg-white focus:border-gray-400`} placeholder="输入标题" onInput={(e)=>{setTitle(e.target.value)}}/>
                        </div>
                        <div className="relative flex flex-col mt-1">
                            <div className="text-[17px]">内容:</div>
                            <div className="pl-[51px] mt-[-20px]">
                                <textarea className={`self-center w-full min-h-[126px] pt-2 px-2 pb-5 bg-gray-100 border ${textNum ? 'bg-white' : 'bg-gray-100'} rounded-lg box-border resize-none outline-none overflow-hidden
                                focus:bg-white focus:shadow-lg focus:border-gray-400 ${exceedTextLim&&'!border-red-600'}` } style={{height: 'auto'}} placeholder="输入内容"
                                onInput={handleTextInput} value={text}/>
                            </div>
                            <div className={`absolute bottom-2 right-2 text-sm text-gray-500 ${exceedTextLim&&'!text-red-600'}`}>{textNum}/{maxTextNum}</div>
                        </div>
                    </div>    
                    <div className="self-end flex flex-row items-center justify-center mr-[10%] w-18 h-8 px-1.5 mt-4 rounded-lg text-white bg-blue-500 cursor-pointer 
                    active:shadow-thick" onClick={()=>{setAlertContent('确认上传文本');setAlertExtraFunc(()=>uploadText);}}> {/* ()=>function 相当于return */}
                        <div>上传</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload ml-1" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
                        </svg>
                    </div>
                </div>
                <Alert initialContent={alertContent} extraFunc={alertExtraFunc}/>
            </Content>
        </PageContainer>
    );
}

export default UploadText;