import axios from 'axios';  
import { server } from '../constant/config';


export const evaluateRule = (ruleString, data) => {  
    return axios.post(`${server}/evaluate`, { ruleString, data });  
};  

export const getRules = () => {  
    return axios.get(`${server}/`);  
};