import { authApi } from '@/common/api';
import { useAuthContext, useNotificationContext } from '@/common/context';

import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function useRegister() {
	const [loading, setLoading] = useState(false);

	const { t } = useTranslation();
	const navigate = useNavigate();

	const { isAuthenticated } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const schema = yup.object().shape({
		username: yup.string().required(t('Please enter name')),
		email: yup.string().email('Please enter valid email').required(t('Please enter email')),
		password1: yup
			.string()
			.required(t('Please enter password'))
			.min(8, 'Password is too short - should be 8 chars minimum')
			.matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
		password2: yup.string().oneOf([yup.ref('password1')], 'Passwords must match'),
		phone: yup
			.string()
			.required(t('Please enter phone number'))
			.matches(/^01\d{8,9}$/, '01012345678의 형태로 입력해주세요')
	});

	const register = async ( data ) => {
		
		const { username, password1, phone, email } = data;
		setLoading(true);
		console.log("in")
		try {
			const res = await authApi.register({
				username: username,
				password: password1,
				phone,
				email,
			});
			console.log(res.config.data)
			//fake-backend에서 resolve되면 밑에 if문 진행
			if (res?.config.data) {
				showNotification({
					message: 'Registration successful. Welcome aboard!',
					type: 'success',
				});
				navigate('/account/login');
			}
		} catch (error) {
			//fake-backend에서 reject되면 error메세지 출력
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, register, isAuthenticated, schema };
}
