import Cookies from 'js-cookie'

export const setCookie = (name, value, expires) => Cookies.set(name, value, {expires:expires})

export const getCookie = (name) => Cookies.get(name)

export const removeCookie = (name) => Cookies.remove(name);