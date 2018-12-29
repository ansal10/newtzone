const config = require('../webConfig.json');

export const GET_TIMEZONE_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/timezone';
export const GET_TIMEZONES_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/timezone/search';
export const CREATE_TIMEZONE_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/timezone';
export const UPDATE_TIMEZONE_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/timezone';
export const DELETE_TIMEZONE_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/timezone';
export const SIGN_UP_ENDPOINT_POST = config.axiosInstance_baseURL+'/api/v1/user/signup';
export const LOG_IN_ENDPOINT_POST = config.axiosInstance_baseURL+'/api/v1/user/login';
export const UPDATE_USER_ENDPOINT_PUT = config.axiosInstance_baseURL+'/api/v1/user';
export const DELETE_USER_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/user';
export const GET_USER_DETAILS = config.axiosInstance_baseURL+'/api/v1/user/details';
export const GET_USERS_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/user';
export const GET_OTHER_USER_DETAILS = config.axiosInstance_baseURL+'/api/v1/user';
export const RESEND_EMAIL = config.axiosInstance_baseURL+'/api/v1/user/email_confirmation';
export const PASSWORD_RESET = config.axiosInstance_baseURL+'/api/v1/user/password_reset';
export const LOGOUT_USER = config.axiosInstance_baseURL+'/api/v1/user/logout';


