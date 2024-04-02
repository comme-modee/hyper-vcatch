import { PageBreadcrumb, Form, PasswordInput, TextInput } from '@/components';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import useLogin, { loginFormSchema } from './useLogin';
import Spinner from '../../../components/Spinner';

const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-muted">
          {t("Don't have an account?")}
          <Link to="/account/register" className="text-muted ms-1">
            <b>{t('Sign Up')}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

export default function Login() {
  const { t } = useTranslation();

  const { loading, login, redirectUrl, isAuthenticated } = useLogin();

  return (
    <>
      {isAuthenticated && <Navigate to={redirectUrl} replace />}
      
      <PageBreadcrumb title="Login" />
      <AccountWrapper bottomLinks={<BottomLink />}>

        <div className="text-center w-75 m-auto">
          <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Log In')}</h4>
        </div>

        <Form
          onSubmit={login}
          schema={loginFormSchema}
          defaultValues={{ username: 'admin', password: 'zxcv1234' }}
        >
          <Row>
            <Col>
              <TextInput
                name="username"
                label={t('ID')}
                type="text"
                placeholder={t('Enter your id')}
                containerClass="mb-3"
              />
            </Col>
          </Row>
          <PasswordInput
            label={t('Password')}
            name="password"
            placeholder={t('Enter your password')}
            containerClass="mb-3"
          >
            <Link to="/account/recover-password" className="text-muted float-end">
              <small>Forgot your password?</small>
            </Link>
          </PasswordInput>
          
          <div className="mb-3 text-center">
            {loading ?
              <Spinner color='primary' size='sm' className='m-auto'/>
              :
              <Button variant="primary" type="submit">
                {t('Log In')}
              </Button>
            }
            
          </div>
        </Form>
      </AccountWrapper>
    </>
  );
}
