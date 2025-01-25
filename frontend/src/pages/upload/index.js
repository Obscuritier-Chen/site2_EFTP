import UploadNav from "./upload_nav";
import UploadText from "./upload_text";
import UploadResource from "./upload_resource";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';//我不知道为何删除router引用会报错 但是事实如此

const Upload=()=>{
    return(
        <Routes>
            <Route exact path="/" element={<UploadNav/>}/>
            <Route exact path="/text" element={<UploadText/>}/>
            <Route exact path="/resource" element={<UploadResource/>}/>
        </Routes>
    )
}

export default Upload;