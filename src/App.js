import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { publicRoutes, privateRoutes } from 'routes';
import DefaultLayout from '~/layouts';
import { Fragment, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch,useSelector } from 'react-redux';
import { isJsonString } from '~/utils/JsonString';
import { getDetaltuser,refreshToken } from '~/api';
import { get } from 'utils/httpRequest';
import { AuthenLogin } from '~/redux/actions';
import {DetailuserState$ } from 'redux/selectors';
import socketIOService from "./services/socketIOService";
function App() {
    const dispatch = useDispatch();
    // Giả sử trạng thái đăng nhập là một biến lấy từ Redux hoặc Context
    const {id} = useSelector(DetailuserState$) || "";
    const isLoggedIn = !!id; // Thay thế bằng logic thực tế của bạn
    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use (
        async (config) => {
            const decoded = handleDecoded()?.decoded;
            // always the headers in existing
            config.headers = config.headers || {};
            if(decoded && decoded.exp * 1000 < Date.now()){
                const data = await refreshToken();
                config.headers.token = data.data.access_Token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    )
    const handleGetDetailUser = async (id, token) => {
        try {
            const res = await getDetaltuser({ id: id, token: token });
            dispatch(AuthenLogin.AuthenLoginSuccess({ ...res?.data.profileuser, access_Token: token }));
        } catch (error) {
            console.error('User invalid or token expired:', error);
            localStorage.removeItem('access_token');
        }
    };
    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };
    useEffect(() => {
        let { decoded, storageData } = handleDecoded();
        if (decoded?.id) {
            handleGetDetailUser(decoded?.id, storageData);
        }
    }, []);
    useEffect(() => {
        socketIOService.connect();
    }, []);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {/* Các route yêu cầu đăng nhập */}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    isLoggedIn ? (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
