import { jwtDecode } from 'jwt-decode'; 

export default function useGetUserRole() {
        let userRole = ''

        const token = localStorage.getItem('_HYPER_AUTH');
        if(token) {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.roles[0];
        } 

    return userRole;
};