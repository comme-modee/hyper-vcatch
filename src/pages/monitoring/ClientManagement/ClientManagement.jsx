import React from 'react'
import { Row, Col } from 'react-bootstrap';
import ClientTable from './ClientTable';

const ClientManagement = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">클라이언트 목록 관리</h4>
                </div>
            </Col>
        </Row>
        <ClientTable/>
    </>
  )
}

export { ClientManagement }