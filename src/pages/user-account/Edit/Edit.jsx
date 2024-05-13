import * as yup from 'yup';
import { authApi, useNotificationContext } from '@/common';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { Form, PasswordInput, TextInput } from '@/components';
import { useState } from 'react';
import Spinner from '../../../components/Spinner';
import './Edit.style.css';
import useErrorAni from '@/hooks/useErrorAni';

// 계정 정보 변경
const Edit = () => {
	const { t } = useTranslation();
	const [ loading, setLoading ] = useState(false);
	const { showNotification } = useNotificationContext();
	const { errorAni, handleErrorAni } = useErrorAni();
	const navigate = useNavigate();

	//로그인한 사용자 정보
	const userInfo = JSON.parse(localStorage.getItem('userInfo'));

	const schema = yup.object().shape({
		password: yup.string().required('비밀번호를 입력해주세요'),
	});
	
	const confirmUserInfo = async (value) => {
		setLoading(true)
		const { username, password } = value;
		// console.log("userInfo: ", value)

		try {
			const res = await authApi.confirmUserInfo(value);
            if(res) {
				navigate('/user-account/edit-user')
            } else {
                showNotification({ message: "비밀번호가 일치하지 않습니다. 다시 확인해주세요.", type: 'error' });
            }
        } catch(error) {
			console.log(error)
        } finally {
			setLoading(false)
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


							{/* <Form onSubmit={confirmUserInfo}>
								<Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
									<Form.Label column sm="2">
									ID
									</Form.Label>
									<Col sm="10">
									<Form.Control plaintext readOnly defaultValue={userInfo.username} />
									</Col>
								</Form.Group>

								<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
									<Form.Label column sm="2">
									Password
									</Form.Label>
									<Col sm="10">
									<Form.Control type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
									</Col>
								</Form.Group>
								<Button variant='primary' type='submit'>확인</Button>
							</Form> */}



							<Form
								onSubmit={confirmUserInfo}
								schema={schema}
								defaultValues={{
								username: userInfo.username,
								}}
								className='edit-form'
							>

								<TextInput
									label={t('ID')}
									type="text"
									name="username"
									readOnly
									className='form-control-light'
								/>

								<PasswordInput
									label={t('Password')}
									name="password"
									placeholder={t('비밀번호')}
									className={`${errorAni}`}
								/>

								<div className="mb-3 text-center">
									{loading ?
									<Spinner color='primary' size='sm' className='m-auto'/>
									:
									<Button variant="primary" type="submit" onClick={() => handleErrorAni()}>
										{t('확인')}
									</Button>
									}
								</div>
            
							</Form>
							


						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { Edit };
