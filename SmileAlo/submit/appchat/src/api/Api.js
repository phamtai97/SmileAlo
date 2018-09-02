import axios from 'axios';
const apiURL = 'http://localhost:3001';
class Api{

    get(path = "", option = null){
        const url = `${apiURL}/${path}`;
        return axios.get(url, option);
    }

    post(path ="", data = {}, option = {headers:{'Contend-Type': 'application/json'}}){
        const url = `${apiURL}/${path}`;
        return axios.post(url, data, option);
    }
}   

export default Api;