import React from 'react'
import { Col, Row } from 'react-bootstrap'
import AdvancedTable from './AdvancedTable'

const Visitor = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">방문자</h4>
                </div>
            </Col>
        </Row>
        <AdvancedTable/>
    </>
  )
}

export default Visitor