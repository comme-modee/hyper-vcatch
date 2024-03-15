import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CustomDatePicker } from '@/components';
import { Card } from 'react-bootstrap';

// 계정 현황 페이지
const Status = () => {

	return (
		<>
			<Row>
				<Col xs={12}>
					<div className="page-title-box">
						<h4 className="page-title">계정 현황</h4>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<p>등록된 클라이언트 수</p>
							<p>등록된 키워드 수</p>
							<p>최종 순위 체크 시간</p>
							<p>사용중인 기능</p>
							<p>남은 이용기간</p>
							<p>키워드 수집 현황 / 트래픽 현황</p>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { Status };
