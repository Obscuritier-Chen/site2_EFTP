import React from "react";

const MainCard=({children})=>{
    return(
        <div className="mainCardContainer relative flex flex-col w-full mt-4 pt-4 pb-6 px-5 bg-white rounded-lg shadow-lg">{children}</div>
    );
}

export default MainCard;