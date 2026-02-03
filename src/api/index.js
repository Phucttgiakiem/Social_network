import axios from 'axios';

const URL = "http://localhost:3000";

export const logintk = (payload) => axios.post(`${URL}/api/login`,payload);
export const registertk = () => axios.post(`${URL}/api/register`);
export const forgotpasstk = (payload) => axios.post(`${URL}/api/choosepass`,payload);
export const authenemailgetpass = (payload) => axios.post(`${URL}/api/createcodeauthenemail`,payload);
export const createaccount = (payload) => axios.post(`${URL}/api/register`,payload);
export const getAllpost = (payload) => axios.post(`${URL}/api/getPosts`,payload);
export const getAllpostsofowner = (payload) => axios.post(`${URL}/api/getallpostwithowner`,payload);
export const getAllcomment = (payload) => axios.post(`${URL}/api/getDetailcomment`,payload);
export const getPost = (payload) => axios.post(`${URL}/api/getPost`,payload);
export const getDetaltuser = (payload) => axios.post(`${URL}/api/Profileuser`,{id: payload.id},{
    headers: {
        token: payload.token
    }
});
export const getUsernotAuth = (payload) => axios.post(`${URL}/api/getInfouser`,{id: payload.id})
export const refreshToken = () => axios.post(`${URL}/api/refresh-token`,{
    withCredentials: true
});
export const logoutAccount = () => axios.post(`${URL}/api/logout`);
