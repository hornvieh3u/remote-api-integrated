import jwtDecode from 'jwt-decode'
import { ref } from 'vue';
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    let userInfo = ref({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (accessToken && refreshToken) {
        try {
            const decodedToken = jwtDecode(accessToken)
            userInfo = decodedToken?.payload
        }
        catch (err) {
            throw err
        }
    }

    const setUserInfo = (aToken, rToken) => {
        localStorage.setItem('accessToken', aToken)
        localStorage.setItem('refreshToken', rToken)

        const decodedToken = jwtDecode(aToken)
        userInfo = decodedToken?.payload
    }

    const removeUserInfo = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        userInfo = null
    }

    return { userInfo, setUserInfo, removeUserInfo }
})