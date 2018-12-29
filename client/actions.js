import {
    GET_TIMEZONE_ENDPOINT, GET_TIMEZONES_ENDPOINT, SIGN_UP_ENDPOINT_POST, GET_USER_DETAILS,
    LOGOUT_USER, GET_OTHER_USER_DETAILS, GET_USERS_ENDPOINT
} from './endpoints';
import {actions} from './constants';

export const fetchOtherUserDetails = (id) => async (dispatch, getState, api) => {

    await api.get(GET_OTHER_USER_DETAILS + "/" + id).then(response => {
        console.log(response)
        dispatch({
            type: actions.FETCH_OTHER_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log(err);
        console.log('error', err.response.data.error.message);
    })

};

export const fetchUserDetails = () => async (dispatch, getState, api) => {

    await api.get(GET_USER_DETAILS).then(response => {
        console.log(response)
        dispatch({
            type: actions.FETCH_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const clearUserDetails = () => async (dispatch, getState, api) => {

    await api.post(LOGOUT_USER, {}).then(response => {
        console.log(response)
        dispatch({
            type: actions.CLEAR_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log(err);
        console.log('error', err.response.data.error.message);
    })

};


export const fetchTimeZoneAction = (productID) => async (dispatch, getState, api) => {

    await api.get(GET_TIMEZONE_ENDPOINT+'/'+productID).then(response => {
        console.log(response)
        dispatch({
            type: 'FETCH_TIMEZONE',
            payload: response.data.success.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const fetchUsersAction = (data) => async (dispatch, getState, api) => {

    const state = getState();
    const nextUrl = state.users.nextUrl || null;

    const endpoint = nextUrl ? nextUrl : GET_USERS_ENDPOINT;

    const merge = nextUrl ? true : false;

    await api.get(endpoint).then(response => {
        dispatch({
            type: 'FETCH_USERS',
            payload: response.data,
            merge: merge
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const fetchTimeZonesAction = (data) => async (dispatch, getState, api) => {

    const state = getState();
    const nextUrl = state.timezones.nextUrl || null;

    const endpoint = nextUrl ? nextUrl : GET_TIMEZONES_ENDPOINT;

    const merge = nextUrl ? true : false;

    await api.post(endpoint, data).then(response => {
        dispatch({
            type: 'FETCH_TIMEZONES',
            payload: response.data,
            merge: merge
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const clearTimeZoneData = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_PROPERTY_DATA'
    })
};

export const clearNextUrl = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_NEXT_URL'
    })
};


export const clearUsersNextUrl = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_USERS_NEXT_URL'
    })
};
