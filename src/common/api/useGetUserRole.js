import { jwtDecode } from 'jwt-decode'; 
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useGetUserRole() {
        const navigator = useNavigate();
        let userRole = ''

        const token = localStorage.getItem('_HYPER_AUTH');
        if(token) {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.roles[0];
        } 

    return userRole;
};