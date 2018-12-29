import React from 'react';
import App from './app';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import Timezone from './pages/timezonePage';
import AddTimeZone from './pages/addTimezonePage';
import Timezones from './pages/timezonesPage';
import Users from './pages/usersPage';
import UserProfile from './pages/userProfile';
import OtherUserProfile from './pages/otherUserProfile';
import TermsAndConditions from './pages/policies/termsAndConditions';
import Privacy from './pages/policies/privacy';
import CookiesPolicy from './pages/policies/cookiesPolicy';
import NotFoundPage from './pages/notFound404Page';

export default [
    {
        path: '/timezone',
        ...App,
        routes: [
            {
                path: '/timezone/add',
                ...AddTimeZone
            },
            {
                path: '/timezone/edit/:id',
                ...AddTimeZone
            },
            {
                path: '/timezone/:id',
                ...Timezone
            }
        ]
    },
    {
        path: '/timezones',
        ...App,
        routes: [
            {
            path: '/timezones/:id',
            ...Timezones
            },
            {
                path: '/timezones',
                ...Timezones
            }
        ]
    },
    {
        path: '/register',
        ...App,
        routes: [
            {
                ...RegisterPage
            }
        ]
    },
    {
        path: '/user',
        ...App,
        routes: [
            {
                path: '/user/profile',
                ...UserProfile
            },
            {
                path: '/user/:id',
                ...OtherUserProfile
            }
        ]
    },
    {
        path: '/users',
        ...App,
        routes: [
            {
                path: '/users',
                ...Users
            }
        ]
    },
    {
        path: '/login',
        ...App,
        routes: [
            {
                ...LoginPage
            }
        ]
    },
    {
        path: '/reset-password',
        ...App,
        routes: [
            {
                ...ResetPasswordPage
            }
        ]
    },
    {
        path: '/policies/terms',
        ...App,
        routes: [
            {
                ...TermsAndConditions
            }
        ]
    },
    {
        path: '/policies/privacy',
        ...App,
        routes: [
            {
                ...Privacy
            }
        ]
    },
    {
        path: '/policies/cookies',
        ...App,
        routes: [
            {
                ...CookiesPolicy
            }
        ]
    },
    {
        path: '/',
        exact: true,
        ...App,
        routes: [
            {
                ...Timezones
            }
        ]
    },
    {
        path: '/',
        ...App,
        routes: [
            {
                ...NotFoundPage
            }
        ]
    }
];

