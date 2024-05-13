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
		username: yup
			.string()
			.required(t('아이디를 입력해주세요'))
			.min(6, '아이디는 6~12자로 입력해주세요.')
			.max(12, '아이디는 6~12자로 입력해주세요.')
			.matches(/[a-zA-Z]/, '아이디는 하나 이상의 영문을 포함해야 합니다.')
			.matches(/[0-9]/, '아이디는 하나 이상의 숫자를 포함해야 합니다.'),
		email: yup
			.string()
			// .email('Please enter valid email')
			.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i, 'email형식이 올바르지 않습니다.')
			.required(t('이메일을 입력해주세요.')),
		password1: yup
			.string()
			.required(t('비밀번호를 입력해주세요.'))
			.min(8, '비밀번호는 8~20자로 입력해주세요.')
			.max(20, '비밀번호는 8~20자로 입력해주세요.')
			.matches(/[a-zA-Z]/, '비밀번호는 하나 이상의 영문을 포함해야 합니다.')
			.matches(/[0-9]/, '비밀번호는 하나 이상의 숫자를 포함해야 합니다.'),
		password2: yup.string().oneOf([yup.ref('password1')], '비밀번호가 일치하지 않습니다.'),
		phone: yup
			.string()
			.required(t('휴대폰번호를 입력해주세요.'))
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
			console.log("res: ",res)
			//join에서 resolve되면 밑에 if문 진행
			if (res) {
				showNotification({
					message: '회원가입이 완료되었습니다. 로그인 해주세요.',
					type: 'success',
				});
				navigate('/');
			}
		} catch (error) {
			//join에서 reject되면 error메세지 출력
			showNotification({ message: '회원가입에 실패하였습니다. 다시 한번 시도해주세요.', type: 'error' });
			console.log(error)
		} finally {
			setLoading(false);
		}
	};

	return { loading, register, isAuthenticated, schema };
}
