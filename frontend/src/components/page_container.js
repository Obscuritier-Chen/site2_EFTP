import React from "react";

const PageContainer=({ children })=>{
    return(
        <div className="absolute w-full min-h-full pageContainer flex flex-col bg-slate-100">{children}</div>
    );
    
}

export default PageContainer;