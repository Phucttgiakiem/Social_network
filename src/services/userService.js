import axios from 'axios';
export const refreshToken = async () => {
    const res = await axios.post(`/user/refresh-token`,{
        withCredentials: true
    });
    return res.data;
}