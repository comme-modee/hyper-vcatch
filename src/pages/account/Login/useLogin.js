import { authApi } from '@/common/api';
import { useAuthContext, useNotificationContext } from '@/common/context';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';

export const loginFormSchema = yup.object({
	username: yup
		.string()
		.required('아이디를 입력해주세요'),
		// .min(6, '아이디는 6~12자로 입력해주세요.')
		// .max(12, '아이디는 6~12자로 입력해주세요.')
		// .matches(/[a-zA-Z]/, '아이디는 하나 이상의 영문을 포함해야 합니다.')
		// .matches(/[0-9]/, '아이디는 하나 이상의 숫자를 포함해야 합니다.'),
	password: yup
		.string()
		.required('비밀번호를 입력해주세요.')
		// .min(8, '비밀번호는 8~20자로 입력해주세요.')
		// .max(20, '비밀번호는 8~20자로 입력해주세요.')
		// .matches(/[a-zA-Z]/, '비밀번호는 하나 이상의 영문을 포함해야 합니다.')
		// .matches(/[0-9]/, '비밀번호는 하나 이상의 숫자를 포함해야 합니다.')
});

export default function useLogin() {
	
	const [ loading, setLoading ] = useState(false);
	
	const location = useLocation();
	
	const { isAuthenticated, saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();
	
	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
		);

	
	const login = async (values) => {
		
		setLoading(true);
		try {
			// console.log("2")
			let users = await authApi.login(values);
			// console.log("3", users)
			if (users) {
				// console.log("4", users.token)
				saveSession({ ...(users ?? {}), token:users.token });
				
				// httpClient.client.defaults.headers.Authorization = `Bearer ${users.token}`;
				// console.log("dddd",httpClient.client.defaults.headers)
				
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
