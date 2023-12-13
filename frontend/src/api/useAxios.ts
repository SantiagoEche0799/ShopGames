import axios, { AxiosRequestHeaders } from 'axios'
import jwt_decode from 'jwt-decode';
import { useAuthStore } from '../store/auth';

// const baseURL = "http://127.0.0.1:8000";

function logout() {
    useAuthStore.getState().logout()
    window.location.href= '/login'
}

const baseURL = import.meta.env.VITE_BACKEND_URL

export const axi = axios.create({
    baseURL
});


export const authAxios = axios.create({
    baseURL,
    withCredentials: true,
});


authAxios.interceptors.request.use(async (config) =>{
    const token: string = useAuthStore.getState().access;
    config.headers = {
        Authorization: `Bearer ${token}`,
    }as AxiosRequestHeaders;

    type Token = {
        exp: number
    };

    const tokenDecoded: Token = jwt_decode(token)

    const expiration = new Date(tokenDecoded.exp * 1000);
    const now = new Date();
    const fiveMin = 1000 * 60 * 5;

    if(expiration.getTime() - now.getTime() < fiveMin)
        try{
            const response = await axi.post('/users/refresh', {refresh: useAuthStore.getState().refresh})
            useAuthStore.getState().setToken(response.data.access, response.data.refresh)
        }catch(err){
            logout()
        }
        return config
});