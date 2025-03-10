import axios from 'axios';

const URL = "https://social-network-be-ll5p.onrender.com";

export const logintk = (payload) => axios.post(`${URL}/api/login`,payload);
export const registertk = () => axios.post(`${URL}/api/register`);
export const forgotpasstk = (payload) => axios.post(`${URL}/api/choosepass`,payload);
export const authenemailgetpass = (payload) => axios.post(`${URL}/api/createcodeauthenemail`,payload);
export const createaccount = (payload) => axios.post(`${URL}/api/register`,payload);
export const getAllpost = (payload) => axios.post(`${URL}/api/getPost`,payload);
export const getAllpostsofowner = (payload) => axios.post(`${URL}/api/getallpostwithowner`,payload);
export const getAllcomment = (payload) => axios.post(`${URL}/api/getDetailcomment`,payload);
