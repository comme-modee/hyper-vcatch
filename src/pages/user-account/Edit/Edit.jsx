import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CustomDatePicker } from '@/components';
import { Card } from 'react-bootstrap';

// 계정 정보 변경
const Edit = () => {

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
							계정 정보 변경 내용
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { Edit };
