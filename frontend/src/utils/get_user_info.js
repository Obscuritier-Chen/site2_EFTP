import axios from "axios";

async function getUserInfo()//返回了一个promise对象
{
    return axios.post('/api/getUserInfo',{},{
        headers:{
            Authorization :`Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response=>response.data)
    .catch(error=>error.response.data);
}

export default getUserInfo;