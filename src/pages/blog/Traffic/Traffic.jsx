import React from 'react'
import { Col, Row } from 'react-bootstrap'
import AdvancedTable from './AdvancedTable'

const Traffic = () => {
  return (
    <>
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="page-title">트래픽</h4>
                </div>
            </Col>
        </Row>
        <AdvancedTable/>
    </>
  )
}

export default Traffic