import React from "react";
import { useState, useEffect } from "react";

const Carousel=()=>{

    const carouselItems=[
        {
            id: 1,
            color: 'bg-blue-400',
            description: 'blue',
        },
        {
            id: 2,
            color: 'bg-red-400',
            description: 'red',
        },
        {
            id: 3,
            color: 'bg-green-400',
            description: 'green',
        },
    ]

    const [currentIndex, setCurrentIndex]=useState(0);

    useEffect(()=>{
        const timer=setInterval(()=>{
            setCurrentIndex((currentIndex+1)%carouselItems.length)
        },7000);

        return ()=>{clearInterval(timer)};
    },[currentIndex, carouselItems.length]);

    return(
        <div className="relative w-[850px] h-[350px] shadow-thick overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 16 16"
            className="absolute top-1/2 mt-[-16px] ml-1 cursor-pointer z-10"
            onClick={()=>{
                currentIndex>0 && setCurrentIndex(currentIndex-1)
            }}>
                <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 16 16"
            className="absolute top-1/2 right-0 mt-[-16px] mr-1 cursor-pointer z-10"
            onClick={()=>{
                currentIndex<carouselItems.length-1 && setCurrentIndex(currentIndex+1)
            }}>
                <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
            </svg>

            <div className="absolute flex flex-row bottom-[6px] left-1/2 translate-x-[-50%] gap-2 z-10">
                {
                    carouselItems.map((_,index)=>{
                        return(
                            <div key={index} className={`w-3 h-3 rounded-full border border-white cursor-pointer ${currentIndex===index ? 'bg-white' : 'bg-black bg-opacity-5'}`}
                            onClick={()=>{setCurrentIndex(index)}}>
                            </div>
                        );
                    })
                }
            </div>

            <div className={`flex flex-row h-full w-[${carouselItems.length*100}%] transition-all ease-in-out duration-700 translate-x-[${-currentIndex*100}%]`}>
                {
                    carouselItems.map((item, index)=>{
                        return(
                            <div key={index} className={`flex items-end min-w-full h-full ${item.color}`}>
                                <div className="flex items-center w-full h-14 px-4 text-lg bg-black bg-opacity-20 text-white">{item.description}</div>
                            </div>
                        );
                    })
                }
            </div>
            
        </div>
    );
};

export default Carousel