import axios from 'axios';

//const process.env.SERVER_APP_URL = "http://localhost:3000";

export const logintk = (payload) => axios.post(`${process.env.SERVER_APP_URL}/login`,payload);
export const registertk = () => axios.post(`${process.env.SERVER_APP_URL}/register`);
export const forgotpasstk = (payload) => axios.post(`${process.env.SERVER_APP_URL}/choosepass`,payload);
export const authenemailgetpass = (payload) => axios.post(`${process.env.SERVER_APP_URL}/createcodeauthenemail`,payload);
export const createaccount = (payload) => axios.post(`${process.env.SERVER_APP_URL}/register`,payload);
export const getAllpost = (payload) => axios.post(`${process.env.SERVER_APP_URL}/getPosts`,payload);
export const getAllpostsofowner = (payload) => axios.post(`${process.env.SERVER_APP_URL}/getallpostwithowner`,payload);
export const getAllcomment = (payload) => axios.post(`${process.env.SERVER_APP_URL}/getDetailcomment`,payload);
export const getPost = (payload) => axios.post(`${process.env.SERVER_APP_URL}/getPost`,payload);
export const getDetaltuser = (payload) => axios.post(`${process.env.SERVER_APP_URL}/Profileuser`,{id: payload.id},{
    headers: {
        token: payload.token
    }
});
export const getUsernotAuth = (payload) => axios.post(`${process.env.SERVER_APP_URL}/getInfouser`,{id: payload.id})
export const refreshToken = () => axios.post(`${process.env.SERVER_APP_URL}/refresh-token`,{
    withCredentials: true
});
export const logoutAccount = () => axios.post(`${process.env.SERVER_APP_URL}/logout`);
