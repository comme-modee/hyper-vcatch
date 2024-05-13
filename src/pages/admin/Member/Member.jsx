import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MemberTable from './MemberTable'

const Member = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">클라이언트 권한 설정</h4>
                </div>
            </Col>
        </Row>
        <MemberTable/>
    </>
  )
}

export default Member