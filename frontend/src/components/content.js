import React from "react";

const Content=({children})=>{
    return(
        <div className="contentContainer flex flex-1 flex-col items-center self-center w-full h-full px-[25%] z-0">{children}</div>
    );
}

export default Content