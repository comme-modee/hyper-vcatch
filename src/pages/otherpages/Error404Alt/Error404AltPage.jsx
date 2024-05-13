import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import notFoundImg from '@/assets/images/svg/file-searching.svg';

const Error404AltPage = () => {
	return (
		<>
			<div className="account-pages pt-4 pt-sm-5 pb-4 pb-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col lg={4}>
							<div className="text-center">
								<img src={notFoundImg} height="90" alt="" />
								<h1 className="text-error mt-4">Sorry</h1>
								<h4 className="text-uppercase text-danger mt-3">이 페이지에 대한 접근 권한이 없습니다.</h4>
								<p className="text-muted mt-3">
									방문하시려는 페이지는 권한이 있는 회원만 보실 수 있습니다.<br/>
									최고 관리자에게 권한을 요청하거나 다른 페이지를 이용해주세요.<br/><br/>
									감사합니다.
								</p>
								<Link className="btn btn-primary mt-3" to="/">
									<i className="mdi mdi-reply"></i> 메인으로 가기
								</Link>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export { Error404AltPage };
