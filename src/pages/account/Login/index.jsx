import { PageBreadcrumb, Form, PasswordInput, TextInput } from '@/components';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AccountWrapper from '../AccountWrapper';
import useLogin, { loginFormSchema } from './useLogin';
import Spinner from '../../../components/Spinner';
import useGetUserRole from '@/common/api/useGetUserRole';
import { useEffect } from 'react';
import { useState } from 'react';
import useErrorAni from '@/hooks/useErrorAni';

const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-muted">
          {t("계정이 없으신가요?")}
          <Link to="/account/register" className="text-muted ms-1">
            <b>{t('회원가입')}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

export default function Login() {
  const { t } = useTranslation();
  const userRole = useGetUserRole();
  const navigate = useNavigate();
  const { loading, login, isAuthenticated } = useLogin();

  useEffect(()=>{
    console.log("=====", "userRole:", userRole, "인증여부:", isAuthenticated)
    if(isAuthenticated) {
      if(userRole === 'ADMIN') {
        navigate('/monitoring/keyword-week')
      } else if(userRole === 'EMPL') {
        navigate('/monitoring/keyword-week')
      } else if(userRole === 'CLIENT') {
        navigate('/monitoring/keyword-week')
      }
    }
  },[userRole, isAuthenticated])

  const { errorAni, handleErrorAni } = useErrorAni();

  return (
    <>
      {/* {isAuthenticated && <Navigate to={redirectUrl} replace />} */}
      
      <PageBreadcrumb title="Login" />
      <AccountWrapper bottomLinks={<BottomLink />}>

        <div className="text-center w-75 m-auto">
          <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('로그인')}</h4>
        </div>

        <Form
          onSubmit={login}
          schema={loginFormSchema}
          defaultValues={{ username: 'admin', password: 'zxcv1234' }}
        >
          <TextInput
            name="username"
            label={t('ID')}
            type="text"
            placeholder={t('아이디')}
          />
          
          <PasswordInput
            label={t('Password')}
            name="password"
            placeholder={t('비밀번호')}
            className={`${errorAni}`}
          >
            {/* <Link to="/account/recover-password" className="text-muted float-end">
              <small>Forgot your password?</small>
            </Link> */}
          </PasswordInput>
          
          <div className="mb-3 text-center">
            {loading ?
              <Spinner color='primary' size='sm' className='m-auto'/>
              :
              <Button variant="primary" type="submit" onClick={() => handleErrorAni()}>
                {t('로그인')}
              </Button>
            }
            
          </div>
        </Form>
      </AccountWrapper>
    </>
  );
}
