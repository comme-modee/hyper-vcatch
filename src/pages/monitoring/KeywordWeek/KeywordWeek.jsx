import React from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import AdvancedTable from '../Table/AdvancedTable';

const KeywordWeek = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">키워드 관리 - 주간</h4>
                </div>
            </Col>
        </Row>
        <AdvancedTable type={"week"}/>
    </>
  )
}

export { KeywordWeek };