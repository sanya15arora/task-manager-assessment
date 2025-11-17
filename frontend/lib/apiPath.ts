export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const API_PATHS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
        LOGOUT: `${BASE_URL}/auth/logout`,
        REFRESH: `${BASE_URL}/auth/refresh`,
    },
    TASKS: {
        GET_ALL: `${BASE_URL}/tasks`,
        ADD_TASK: `${BASE_URL}/tasks`,
        GET: (id: number) => `${BASE_URL}/tasks/${id}`,
        UPDATE: (id: number) => `${BASE_URL}/tasks/${id}`,
        DELETE: (id: number) => `${BASE_URL}/tasks/${id}`,
        TOGGLE_TASK: (id: number) => `${BASE_URL}/tasks/${id}/toggle`,
    },
};
