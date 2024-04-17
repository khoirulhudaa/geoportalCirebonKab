    import axios from "axios";
    import store from "../Store/store.tsx";

    const api = axios.create({
        baseURL: "https://be-geospasial.vercel.app/v2/api",
        headers: {
            "Content-Type": "application/json",
        },
    });

    api.interceptors.request.use(
        async function (config: any) {
            const token = store.getState().Auth.token;
            console.log(token)

            if (token) {
                config.headers["Authorization"] = token;
            }

            if (config.data instanceof FormData) {
                config.headers["Content-Type"] = "multipart/form-data";
            }

            return config;
        },
        function (error: any) {
            return Promise.reject(error);
        }
    );

    // Tambahkan interceptor respons
    api.interceptors.response.use(
        function (response: any) {
            return response;
        },
        function (error: any) {
            if (error.response.status === 403 || error.response.message == "You don't have access permissions.") {
                window.location.pathname = '/'
            }
            console.log("error interceptor:", error);

            return Promise.reject(error);
        }
    );

    export default api;
