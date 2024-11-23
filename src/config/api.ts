export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/users/register',
    GET_PROFILE: '/users/my-profile',
    GET_USER: (idOrUsername: string) => `/users/${idOrUsername}`,

    // Exhibit endpoints
    GET_EXHIBITS: '/exhibits',
    GET_MY_EXHIBITS: '/exhibits/my-posts',
    GET_EXHIBIT: (id: number) => `/exhibits/post/${id}`,
    CREATE_EXHIBIT: '/exhibits',
    UPDATE_EXHIBIT: (id: number) => `/exhibits/${id}`,
    DELETE_EXHIBIT: (id: number) => `/exhibits/${id}`,
    GET_STATIC_FILE: (filename: string) => `/exhibits/static/${filename}`,

    // Comment endpoints
    CREATE_COMMENT: (exhibitId: number) => `/exhibits/${exhibitId}/comments`,
    GET_COMMENTS: (exhibitId: number) => `/exhibits/${exhibitId}/comments`,
    UPDATE_COMMENT: (exhibitId: number, commentId: number) => `/exhibits/${exhibitId}/comments/${commentId}`,
    DELETE_COMMENT: (exhibitId: number, commentId: number) => `/exhibits/${exhibitId}/comments/${commentId}`,
};
