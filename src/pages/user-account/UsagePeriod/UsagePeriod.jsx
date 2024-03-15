import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

// 사용 기간 관리
const UsagePeriod = () => {

	return (
		<>
			<Row>
				<Col xs={12}>
					<div className="page-title-box">
						<h4 className="page-title">사용 기간 관리</h4>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
                            사용 기간 관리 내용
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { UsagePeriod };
