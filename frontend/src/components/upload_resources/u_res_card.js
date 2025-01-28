import React, { useEffect, useState } from "react";

import { ReactComponent as AudioIcon } from "./svgs/audio.svg";
import { ReactComponent as CodeIcon } from "./svgs/code.svg";
import { ReactComponent as CompressedFileIcon } from "./svgs/compressed.svg";
import { ReactComponent as ExcelIcon } from "./svgs/excel.svg";
import { ReactComponent as FileIcon } from "./svgs/file.svg";
import { ReactComponent as ImageIcon } from "./svgs/image.svg";
import { ReactComponent as PdfIcon } from "./svgs/pdf.svg";
import { ReactComponent as TextIcon } from "./svgs/text.svg";
import { ReactComponent as VideoIcon } from "./svgs/video.svg";
import { ReactComponent as WordIcon } from "./svgs/word.svg";

const UplResCard=({ file, fileDelete })=>{
    function formatFileSize(bytes)
    {
        if(bytes === 0) 
            return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    function formatUploadSpeed(speed)
    {
        if(speed === 0)
            return '0 B/s';
        const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
        const i = Math.floor(Math.log(speed) / Math.log(1024));
        return (speed / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    function determineFileType()
    {
        const mimeType = file.file.type;

        const videoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mkv', 'video/x-msvideo'];
        const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-wav', 'audio/flac'];
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp'];
        const wordTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const excelTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        const pdfTypes = ['application/pdf'];
        const textTypes = ['text/plain'];
        const compressedTypes = ['application/zip', 'application/x-tar', 'application/gzip', 'application/x-bzip2', 'application/x-7z-compressed', 'application/x-compressed', 'application/x-zip-compressed'];
        const codeTypes = [
            'application/javascript', 'application/json', 'application/xml', 'text/javascript', 'text/css', 'text/html', 'application/x-httpd-php',
            'application/x-sh', 'application/x-perl', 'application/python', 'text/x-python', 'application/x-ruby', 'text/x-java', 'text/x-go',
            'application/x-typescript', 'text/x-typescript', 'text/x-csrc', 'text/x-c++src', 'text/x-csharp', 'text/x-php', 'text/x-java-source',
            'application/rust', 'application/x-lua'
        ];
    
        // 判断文件类型并返回分类
        if (videoTypes.includes(mimeType))
            return 'Video';
        else if (audioTypes.includes(mimeType))
            return 'Audio';
        else if (imageTypes.includes(mimeType))
            return 'Image';
        else if (wordTypes.includes(mimeType))
            return 'Word Document';
        else if (excelTypes.includes(mimeType))
            return 'Excel Document';
        else if (pdfTypes.includes(mimeType))
            return 'PDF';
        else if (textTypes.includes(mimeType))
            return 'TXT';
        else if (compressedTypes.includes(mimeType))
            return 'Compressed File';
        else if (codeTypes.includes(mimeType))
            return 'Code File';
        else
            return 'Other';
    }
    
    return(
        <div className="relative flex flex-col px-3 py-2 text-gray-700 border-b border-gray-300 last:border-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" 
            className="absolute top-1 right-2 cursor-pointer hover:fill-[#ff0000] hover:scale-110" viewBox="0 0 16 16"
            onClick={()=>{fileDelete(file.id)}}>
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
            <div className="flex flex-row items-center text-sm">
                {
                    determineFileType()==='Video' ? <VideoIcon/> :
                    determineFileType()==='Audio' ? <AudioIcon/> :
                    determineFileType()==='Image' ? <ImageIcon/> :
                    determineFileType()==='Word Document' ? <WordIcon/> :
                    determineFileType()==='Excel Document' ? <ExcelIcon/> :
                    determineFileType()==='PDF' ? <PdfIcon/> :
                    determineFileType()==='TXT' ? <TextIcon/> :
                    determineFileType()==='Compressed File' ? <CompressedFileIcon/> :
                    determineFileType()==='Code File' ? <CodeIcon/> :
                    <FileIcon/>
                }
                <div className="ml-1.5">{file.file.name}</div>
                <div className="ml-3 text-[13px]">{formatFileSize(file.file.size)}</div>
            </div>
            
            {
                !file.uploading ? null : <div className="flex flex-row items-center mt-1 text-[13px]">
                    <div className="flex-1 h-1.5 bg-gray-300 rounded-full">
                        <div style={{width: `${file.progress*100}%`}} className="h-full bg-blue-500 rounded-full"/>
                    </div>
                    <div className="ml-1.5 mr-1">{file.progress===0 ? '' : `${(file.progress*100).toFixed(2)}%`}</div>
                    <div className="ml-auto mr-1">{formatUploadSpeed(file.speed)}</div>
                </div>
            }
            
        </div>
    );
}

export default UplResCard;