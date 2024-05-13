import React from 'react'
import { Row, Col } from 'react-bootstrap';
import KeywordTable from './KeywordTable'

const KeywordManagement = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">키워드 목록 관리</h4>
                </div>
            </Col>
        </Row>
        <KeywordTable/>
    </>
  )
}

export { KeywordManagement }