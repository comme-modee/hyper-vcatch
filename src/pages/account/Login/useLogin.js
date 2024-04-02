import { authApi } from '@/common/api';
import { useAuthContext, useNotificationContext } from '@/common/context';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export const loginFormSchema = yup.object({
	// email: yup.string().email('Please enter valid email').required('Please enter email'),
	username: yup.string().required('Please enter id'),
	password: yup.string().required('Please enter password'),
});

export default function useLogin() {

	const [ loading, setLoading ] = useState(false);
	
	const location = useLocation();
	const navigate = useNavigate();

	const { isAuthenticated, saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const redirectUrl = useMemo(
	
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);


	// console.log("isAuthenticated", isAuthenticated)
	// console.log("showNotification", showNotification)


	const login = async (values) => {

		setLoading(true);
		
		try {
			// console.log("2")
			let users = await authApi.login(values);
			// console.log("3", users)
			if (users) {
				// console.log("4", users.token)
				
				saveSession({ ...(users ?? {}), token:users.token });
				navigate('/monitoring/keyword-week');
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log("여기")
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, redirectUrl, isAuthenticated, showNotification };
}
