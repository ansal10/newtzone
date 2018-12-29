import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import {actions} from './constants';
import {Gen} from "./helpers/gen";

const userReducer = function(state = null, action){

    switch(action.type){
        case actions.FETCH_USER_DATA:
            return action.payload.success.data || null;
        case actions.CLEAR_USER_DATA:
            return null;
        default:
            return state;
    }
};

const otherUserReducer = function(state = null, action){

    switch(action.type){
        case actions.FETCH_OTHER_USER_DATA:
            return action.payload.success.data || null;
        default:
            return state;
    }
};


const timezoneReducer = function(state = null, action){

    switch(action.type){
        case 'FETCH_TIMEZONE':
            return action.payload || false;
        case 'CLEAR_PROPERTY_DATA':
            return null;
        default:
            return state;
    }
};

const timezonesReducer = function(state = {
    timezones: null
}, action){
    switch(action.type){
        case 'FETCH_TIMEZONES':
            const merge = action.merge;
            let newProperties = action.payload.success.data;
            if(merge) {
                newProperties = Gen.mergeArray(state.arr, newProperties);
            }

            const data = {
                arr: newProperties,
                nextUrl: action.payload.nextUrl
            };
            return {...state, ...data || null};

        case 'CLEAR_NEXT_URL':
            return {... state, nextUrl: null};
        default:
            return state;
    }
};

const usersReducer = function(state = {
    timezones: null
}, action){
    switch(action.type){
        case 'FETCH_USERS':
            const merge = action.merge;
            let newUsers = action.payload.success.data;
            if(merge) {
                newUsers = Gen.mergeArray(state.arr, newUsers);
            }

            const data = {
                arr: newUsers,
                nextUrl: action.payload.nextUrl
            };
            return {...state, ...data || null};

        case 'CLEAR_USERS_NEXT_URL':
            return {... state, nextUrl: null};
        default:
            return state;
    }
}

export default combineReducers({
    form: formReducer,
    timezone: timezoneReducer,
    timezones: timezonesReducer,
    user: userReducer,
    otherUser: otherUserReducer,
    users: usersReducer,
});
