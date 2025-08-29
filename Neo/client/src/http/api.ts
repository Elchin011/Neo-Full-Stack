import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
    timeout: 10000,
})

if (typeof window !== "undefined") {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

    console.log("Token from cookie (client only):", token);

    api.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}




export const getAPi = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;

    }
}

export const postApi = async (url: string, data: any) => {
    try {
        const response = await api.post(url, data);
        return response.data;

    } catch (error) {
        console.error("Error posting data:", error);
        throw error;

    }
}


export const postApiComment = async (url: string, data: any) => {
    let token;
    if (typeof document !== "undefined") {
        token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    }
    const response = await api.post(url, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
}

export const deleteApiComment = async (url: string) => {
    let token;
    if (typeof document !== "undefined") {
        token = document.cookie.split("; ").find(row => row.startsWith("token="))?.
            split("=")[1];
    }
    const response = await api.delete(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
}


const BASE_URL = "http://localhost:3001/api";

export const deleteApi = async (url: string) => {
    const fullUrl = `${BASE_URL}${url}`;
    console.log("Deleting from URL:", fullUrl);

    const response = await fetch(fullUrl, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return null;
    }
};


export const patchProductApi = async (url: string, data: any) => {
    try {
        const response = await api.patch(url, data);
        return response.data;

    }
    catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};






export const deleteAPiWithParams = async (url: string, id: string) => {
    try {
        const response = await api.delete(`${url}/${id}`);
        return response.data;

    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;

    }
}

export const getAPiById = async (url: string, id: string) => {
    try {
        const response = await api.get(`${url}/${id}`);
        return response.data;

    } catch (error) {
        console.error("Error fetching data by ID:", error);
        throw error;

    }
}


export const patchApi = async (url: string, id: string, data: any) => {
    try {
        const response = await api.patch(`${url}/${id}`, data);
        return response.data;

    } catch (error) {
        throw error

    }
}

export const patchOrderApi = async (url: string, data: any) => {
    try {
        const response = await api.patch(`${url}`, data);
        return response.data;

    } catch (error) {
        throw error

    }
}


export const patchAppointmentApi = async (url: string, data: any) => {
    try {
        const response = await api.patch(`${url}`, data);
        return response.data;

    } catch (error) {
        throw error

    }
}