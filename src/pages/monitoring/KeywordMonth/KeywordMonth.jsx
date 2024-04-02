import React from 'react'
import { Row, Col } from 'react-bootstrap';
import AdvancedTable from '../Table/AdvancedTable';

const KeywordMonth = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">키워드 관리 - 월간</h4>
                </div>
            </Col>
        </Row>
        <AdvancedTable type={'month'}/>
    </>
  )
}

export { KeywordMonth };