import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import useExportExcel from '../Table/useExportExcel';
import { useState } from 'react';
import { CustomDatePicker, Spinner } from '@/components';
import { useEffect } from 'react';
import useGetClientList from '@/layouts/Topbar/useGetClientList';
import './Report.style.css';
import { useUserInfoContext } from '@/common';

const Report = () => {
  const { weekReportLoading, hourReportLoading, handleOnExport } = useExportExcel();
  const [ userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')));
  // const { data:clientListData, getClientList } = useGetClientList();
  // const [ clientName, setClientName ] = useState('');
  const reportTypeList = [ '현재 주간', '주간 선택', '날짜 선택', '월간' ];
  const [ currentWeek, setCurrentWeek ] = useState(new Date());
  const [ selectedWeek, setSelectedWeek ] = useState('');
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ selectedMonth, setSelectedMonth ] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear().toString());
  const [ reportType, setReportType ] = useState('');
  const [ week, setWeek ] = useState('');
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, setEndDate ] = useState(new Date());
  const [ selectedStartDate, setSelectedStartDate ] = useState(new Date());
  const [ selectedEndDate, setSelectedEndDate ] = useState(new Date());
  const [ showReportType, setShowReportType ] = useState(false);
  const [ daytime, setDaytime ] = useState('');
  
  const { clientUid, clientName } = useUserInfoContext(); 
  
  const [hoveredDate, setHoveredDate] = useState(null);


  //년, 월 선택
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, index) => currentYear - 10 + index);
  years.sort((a, b) => b - a);

  useEffect(()=>{
		if(clientUid === '') {
      setShowReportType(false)
		} else {
			setShowReportType(true)
    }
    
    if(reportType === '' || reportType === '기간 선택') {
      setReportType('')
    } else {
      // setShowClient(true)
      if(reportType === '현재 주간') {
        const date = new Date();
        setCurrentWeek(editedWeek(date))
        getWeek(date)
      } else if(reportType === '주간 선택') {
        setSelectedWeek(editedWeek(selectedDate))
      } else if(reportType === '날짜 선택') {
        setStartDate(editedWeek(selectedStartDate))
        setEndDate(editedWeek(selectedEndDate))
      }
    }
    
    if(clientUid && daytime) {
      if(currentWeek || selectedWeek || (startDate && endDate) || (selectedYear && selectedMonth)){
        handleOnExport({ reportType, client:clientUid, clientName, daytime, currentWeek, selectedWeek, startDate, endDate, month:selectedMonth, year:selectedYear })
        setDaytime('')
      } 
    }
    
    
    // console.log("daytime: ", daytime)
    // console.log("client: ", client)
    // console.log("reportType: ", reportType)
    // console.log("currentWeek: ", currentWeek)
    // console.log("selectedWeek: ", selectedWeek)
    // console.log(selectedYear,'년', selectedMonth,'월')
    // console.log('시작날짜: ', selectedStartDate)
    // console.log('종료날짜: ', selectedEndDate)
      
	},[userInfo, selectedDate, clientUid, clientName, daytime, selectedStartDate, selectedEndDate, startDate, endDate, reportType, currentWeek, selectedWeek, selectedYear, selectedMonth ])
  
  

  const getWeek = (date) => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // 월요일
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // 금요일
    setWeek(`${monday.toLocaleDateString().slice(0, -1).replace('.', '년').replace('.', '월')}일 ~ ${friday.toLocaleDateString().slice(9, -1)}일`);
  };

  const editedWeek = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }


  const exportReport = (value) => {
      setDaytime(parseInt(value));
  }



  return (
    <>
      <Row>
          <Col xs={12}>
              <div className="page-title-box">
                  <h4 className="page-title">보고서 마법사</h4>
              </div>
          </Col>
      </Row>
      <div className='report-wrapper'>
        
        <Row className="justify-content-center position-relative z-1">
						<Col xl={5} lg={7} md={7} sm={9} xs={9}>
							<div className="horizontal-steps mt-4 mb-4 pb-5" >
								<div className="horizontal-steps-content">
									<div className={`step-item ${clientUid === '' ? 'current' : ''}`} style={{whiteSpace: 'nowrap'}}>
											<span>클라이언트 선택</span>
									</div>
									<div className={`step-item ${clientUid !== '' && reportType === '' ? 'current' : ''}`} style={{whiteSpace: 'nowrap'}}>
											<span>기간 선택</span>
									</div>
									<div className={`step-item ${clientUid !== '' && reportType !== '' ? 'current' : ''}`} style={{whiteSpace: 'nowrap'}}>
										<span>보고서 완성</span>
									</div>
								</div>

								<div className="process-line report-process-line" style={{ width: clientUid !== '' && reportType !== '' ? '100%' : clientUid !== '' && reportType === '' ? '50%' : '0%' }}></div>
							</div>
						</Col>
				</Row>
        <div className='pe-2 ps-2 position-relative z-2'>
          {showReportType && 
            <Row className="justify-content-center">
                <Col xl={3} lg={3} md={3} sm={3} xs={9}>
                    <div className='mb-3'>
                      <Form.Select onChange={(e) => setReportType(e.target.value)}>
                          <option>기간 선택</option>
                          {reportTypeList.map(type => <option key={type}>{type}</option>)}
                      </Form.Select>
                    </div>
                </Col>
                {
                    reportType==='현재 주간' ? 
                    <Col xl={3} lg={3} md={4} sm={5} xs={9} className='mb-3'>
                      <input className='form-control form-control-light' readOnly value={week}/>
                    </Col>  
                    :
                    reportType==='주간 선택' ?
                    <Col xl={3} lg={3} md={4} sm={5} xs={9} className='mb-3'>
                      <CustomDatePicker
                        className='test'
                        hideAddon={false}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        value={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                        }}
                      /> 
                    </Col>
                    :
                    reportType==='월간' ?
                    <Col xl={3} lg={4} md={5} sm={6} xs={9} className='mb-3'>
                      <div className='d-flex gap-1'>
                          <Form.Select id='year-select' className='form-control form-control-light' defaultValue={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                              {years.map((year => <option key={year} value={year.toString()}>{`${year}년`}</option>))}
                          </Form.Select>
                          <Form.Select id='month-select' className='form-control form-control-light' defaultValue={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                              {months.map((month => <option key={month} value={month.toString().padStart(2, '0')}>{`${month}월`}</option>))}
                          </Form.Select>
                      </div>  
                    </Col>
                    : 
                    reportType==='날짜 선택' ? 
                    <Col xl={6} lg={6} md={7} sm={8} xs={12} className='mb-3'>
                      <div className='d-flex gap-1'>
                        <CustomDatePicker
                          hideAddon={false}
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                          value={selectedStartDate}
                          onChange={(date) => {
                            setSelectedStartDate(date);
                          }}
                        /> 
                        <span className='tilde-sign'>~</span>
                        <CustomDatePicker
                          hideAddon={false}
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                          value={selectedEndDate}
                          onChange={(date) => {
                            setSelectedEndDate(date);
                          }}
                        />
                      </div>
                    </Col>  
                    : 
                    <Col xl={3} lg={3} md={4} sm={5} xs={9} className='mb-3'>
                      <input className='form-control form-control-light' readOnly value='기간을 선택해주세요'/>
                    </Col>
                }
            </Row>
          }
          
          {/* <Row className="justify-content-center">
              <Col xl={4} lg={4} md={5} sm={6} xs={9}>
                  <div className='mb-3'>
                    {showClient ? 
                        <Form.Select defaultValue={clientUid} aria-label="Default select example" onChange={(e) => setClient(e.target.value)}>
                          <option value=''>클라이언트 검색</option>
                          {clientListData && clientListData.map((client) => <option key={client.client_uid} value={client.client_uid}>{client.client_name}</option>)}
                        </Form.Select>
                    : ''}
                  </div>
              </Col>
          </Row> */}
          <Row className="justify-content-center">
              <Col lg={5} md={4} sm={5} className='report-btn-wrapper'>
                  {clientUid !== '' && reportType !== '' ? 
                      <>{weekReportLoading ? <Button variant='info' value='1' className='report-btn-week' disabled>
                                                          <Spinner className="spinner-border-sm me-1" tag="span" color="white"/>
                                                          Loading...
                                                    </Button>
                                                    : <Button variant='info' value='1' className='report-btn-week' onClick={(e) => exportReport(e.target.value)}>주간 보고서 출력</Button>}
                        
                        {hourReportLoading ? <Button variant='warning' value='2' className='report-btn-24hour' disabled>
                                                          <Spinner className="spinner-border-sm me-1" tag="span" color="white"/>
                                                          Loading...
                                                    </Button>
                                                    : <Button variant='warning' value='2' className='report-btn-24hour' onClick={(e) => exportReport(e.target.value)}>24시간 보고서 출력</Button>}
                  </>: ''}
              </Col>
          </Row> 
        </div>
      </div>
    </>
  )
}

export { Report };