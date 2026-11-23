

export enum Routes {

    //AUTH SERVICES
    LOGIN_URL = `/auth/login`,
    LOGOUT_URL = `/auth/logout`,
    CURRENT_USER = "/me",

    //PROJECT SERVICES
    CREATE_PROJECT = "/project/create-project",
    GET_ALL_PROJECTS = "/project/getall-projects",
    GET_ALL_STARRED_PORJECTS = "/project/get-allstarred-project",
    GET_PROJECT_BY_PROJECTID = "/project/get-project-byid/",
    PROJECT_STAR_BY_PROJECTID = "/project/project-star/",
    DELETE_PROJECT_BY_PROJECTID = "/project/delete-project",

    //FILE SERVICES
    CREATE_ROOT_FOLDER = "/file/create-root-folder",
    CREATE_FOLDER = "/file/create-folder",
    CREATE_FILE = "/file/create-file",
    UPDATE_FILE_BY_ID = '/file/update-file',
    DELETE_FILE_BY_ID = '/file/delete-file',
    GET_FILE_BY_ID = '/file/get-file-byid',
    GET_TREE_BY_ID = '/file/get-tree-byid',

    //AI SERVICES
    AI_SERVICES = '/ai/chat'
}