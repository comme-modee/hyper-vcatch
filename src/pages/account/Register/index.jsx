import { CheckInput, Form, PasswordInput, TextInput, PageBreadcrumb } from '@/components';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import useRegister from './useRegister';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t('Already have account?')}
					<Link to={'/account/login'} className="text-muted ms-1">
						<b>{t('Log In')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

export default function Register() {
	const { t } = useTranslation();

	const { loading, register, isAuthenticated, schema } = useRegister();
	// console.log(schema)

	return (
		<>
			{isAuthenticated && <Navigate to="/" replace />}
			<PageBreadcrumb title="Register" />
			<AccountWrapper bottomLinks={<BottomLink />}>
				<div className="text-center w-75 m-auto">
					<h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign Up')}</h4>
					<p className="text-muted mb-4">
						{t(
							"Don't have an account? Create your account, it takes less than a minute"
						)}
					</p>
				</div>

				<Form
					onSubmit={register}
					schema={schema}
					defaultValues={{
						username: 'user1',
						password1: 'test1234',
						password2: 'test1234',
						phone: '01033334444',
						email: 'user1@gmail.com',
					}}
				>
					<TextInput
						label={t('ID')}
						type="text"
						name="username"
						placeholder={t('Enter your name')}
						containerClass="mb-3"
					/>
					<PasswordInput
						label={t('Password')}
						name="password1"
						placeholder={t('Enter password')}
						containerClass="mb-3"
					/>

					<PasswordInput
						label={t('Confirm Password')}
						name="password2"
						placeholder={t('Confirm password')}
						containerClass="mb-3"
					/>

					<TextInput
						label={t('Phone Number')}
						type="number"
						name="phone"
						placeholder={t('Enter your phone number')}
						containerClass="mb-3"
					/>

					<TextInput
						label={t('Email Address')}
						type="text"
						name="email"
						placeholder={t('Enter your email')}
						containerClass="mb-3"
					/>

					<CheckInput
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
					/>

					<div className="mb-3 text-center">
						{loading ?
						<Spinner color='primary' size='sm' className='m-auto'/>
						:
						<Button variant="primary" type="submit">
							{t('Sign Up')}
						</Button>
						}
					</div>
				</Form>
			</AccountWrapper>
		</>
	);
}
