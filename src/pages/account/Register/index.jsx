import { useState } from 'react';
import { Form, PasswordInput, PageBreadcrumb, TextInput } from '@/components';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import useRegister from './useRegister';
import IdInput from './IdInput'
import useErrorAni from '@/hooks/useErrorAni';

const BottomLink = () => {
	const { t } = useTranslation();
	
	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t('이미 계정이 있으신가요?')}
					<Link to={'/'} className="text-muted ms-1">
						<b>{t('로그인')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

export default function Register() {
	const { t } = useTranslation();

	const { loading, register, isAuthenticated, schema } = useRegister();

	const { errorAni, handleErrorAni } = useErrorAni();

	return (
		<>
			{isAuthenticated && <Navigate to="/" replace />}
			<PageBreadcrumb title="Register" />
			<AccountWrapper bottomLinks={<BottomLink />}>
				<div className="text-center w-75 m-auto">
					<h4 className="text-dark-50 text-center mt-0 mb-3 fw-bold">{t('회원가입')}</h4>
				</div>
				

				<Form
					onSubmit={register}
					schema={schema}
					defaultValues={{
						username: 'user1234',
						password1: 'test1234',
						password2: 'test1234',
						phone: '01033334444',
						email: 'user1@gmail.com',
					}}
				>
					<IdInput
						label={t('아이디')}
						type="text"
						name="username"
						placeholder={t('아이디 입력 (영문, 숫자 포함 6~12자)')}
						className={`${errorAni}`}
					/>
					
					<PasswordInput
						label={t('비밀번호')}
						name="password1"
						placeholder={t('비밀번호 입력 (영문, 숫자 포함 8~20자)')}
						className={`${errorAni}`}
					/>

					<PasswordInput
						label={t('비밀번호 확인')}
						name="password2"
						placeholder={t('비밀번호 재입력')}
						className={`${errorAni}`}
					/>

					<TextInput
						label={t('휴대폰 번호')}
						type="number"
						name="phone"
						placeholder={t('휴대폰번호')}
						className={`${errorAni}`}
					/>

					<TextInput
						label={t('이메일')}
						type="text"
						name="email"
						placeholder={t('이메일 주소')}
						className={`${errorAni}`}
					/>

					{/* <CheckInput
						name="checkbox"
						type="checkbox"
						containerClass="mb-2"
						label={
							<>
								I accept
								<span className="text-muted cursor-pointer">
									Terms and Conditions
								</span>
							</>
						}
						defaultChecked
					/> */}

					<div className="mb-3 text-center">
						{loading ?
						<Spinner color='primary' size='sm' className='m-auto'/>
						:
						<Button variant="primary" type="submit" onClick={() => handleErrorAni()}>
							{t('회원가입')}
						</Button>
						}
					</div>
				</Form>
			</AccountWrapper>
		</>
	);
}
