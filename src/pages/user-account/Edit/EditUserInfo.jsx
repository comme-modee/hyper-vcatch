import * as yup from 'yup';
import { useState } from 'react';
import { authApi, useNotificationContext } from '@/common';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { Form, PasswordInput, TextInput } from '@/components';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../components/Spinner'


const EditUserInfo = () => {
  const [loading, setLoading] = useState(false);

  //로그인한 사용자 정보
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const { t } = useTranslation();
  const { showNotification } = useNotificationContext();

	const schema = yup.object().shape({
		email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i, 'email형식에 맞지 않습니다.')
      .required(t('email을 입력해주세요')),
    phone: yup
			.string()
			.required(t('휴대폰번호를 입력해주세요'))
			.matches(/^01\d{8,9}$/, '01012345678의 형태로 입력해주세요'),
		password: yup.string().required(t('비밀번호를 입력해주세요')),
	});


  const editUserInfo = async (data) => {
    setLoading(true);
    // console.log("editUserInfo", data)
    try {
      const res = await authApi.editUserInfo(data)

      if(res){
        showNotification({ message: '계정 정보 변경이 완료되었습니다.', type: 'success' });
      }
    } catch(error) {
      showNotification({ message: '계정 정보 변경에 실패하였습니다. 다시 한번 시도해주세요.', type: 'error' });
      console.log(error)
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
			<Row>
				<Col xs={12}>
					<div className="page-title-box">
						<h4 className="page-title">계정 정보 변경</h4>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>


							<Form 
                onSubmit={editUserInfo}
                schema={schema}
                defaultValues={{
                  username: userInfo.username,
                  phone: userInfo.phone,
                  email: userInfo.email,
                }}
                className= 'editInfo-form'
              >

                <TextInput
                  label={t('ID')}
                  type="text"
                  name="username"
                  readOnly
                  className='form-control-light'
                />

                <TextInput
                  label={t('Phone Number')}
                  type="number"
                  name="phone"
                  placeholder={t('휴대폰번호')}
                />

                <TextInput
                  label={t('Email Address')}
                  type="text"
                  name="email"
                  placeholder={t('이메일 주소')}
                />

                <PasswordInput
                  label={t('Password')}
                  name="password"
                  placeholder={t('비밀번호 입력')}
                />

                <div className="mb-3 text-center">
                    {loading ?
                    <Spinner color='primary' size='sm' className='m-auto'/>
                    :
                    <Button variant="primary" type="submit">
                      {t('정보 수정')}
                    </Button>
                    }
                </div>
            
							</Form>
							


						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
  )
}

export default EditUserInfo