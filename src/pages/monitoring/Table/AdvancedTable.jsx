import { Row, Col, Card, Button, CardBody } from 'react-bootstrap';
import { Table, CustomDatePicker } from '@/components';
import { useState } from 'react';
import useMonitoringKeyword from './useMonitoringKeyword';
import { useEffect } from 'react';
import MonitoringTable from './MonitoringTable';
import Form from 'react-bootstrap/Form';
import { Pagination } from 'react-bootstrap';
import { useUserInfoContext } from '@/common';
import usePlatformList from './usePlatformList';

const AdvancedTable = ( {type} ) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [editedSelectedDate, setEditedSelectedDate] = useState(new Date())
  const [platform, setPlatform] = useState('')
  const [keyword, setKeyword] = useState('')
  const { data:MonitoringData, loading, searchKeyword, showNotification } = useMonitoringKeyword(type);
  const [sortData, setSortData] = useState([])
  const [rows, setRows] = useState(100);
  const [totalPage, setTotalPage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { clientUid } = useUserInfoContext(); 
  const { data:platformListData, getPlatformList } = usePlatformList();
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [weekBtn, setWeekBtn] = useState(true);
  const [hourBtn, setHourBtn] = useState(false);
  let dataType = '';

  useEffect(()=>{
    if(selectedDate || (clientUid || clientUid === '') || platform || (keyword || keyword === '') || rows || currentPage || selectedMonth || selectedYear ) {
      const editedDate = selectedDate.toISOString().split('T')[0];
      setEditedSelectedDate(editedDate)
      // console.log("1 w: ",weekBtn, "h:", hourBtn)
      console.log('keyword: ', keyword)

      if(weekBtn) {
        dataType = "y";
      } else if (hourBtn) {
        dataType = "n";
      }
      searchKeyword({ editedSelectedDate, clientUid, platform, keyword, rows, currentPage, selectedMonth, selectedYear, dataType })

      window.scrollTo({
        top: 0
      });
      
      getPlatformList();

    }
  },[clientUid, platform, keyword, rows, currentPage, selectedMonth, selectedYear, weekBtn, hourBtn, selectedDate, editedSelectedDate])



  //받아온 데이터 정리
  useEffect(()=> {
    if(MonitoringData.list) {
      let temp = MonitoringData.list.map((item) => {
          const setHour = (value) => {
            return value.toString().padStart(2, '0');
          }
          
          const data = {
              client: item.client_name,
              platform: item.info_platform,
              keyword: item.info_keyword,
              goalrank: item.info_goalrank,
              title: item.info_title,
              url: item.info_url,
              h24: item.h24,
          };

          if (type === 'week') {
              for(let i = 9; i<=17; i++) {
                if(i !== 12) {
                  data[`h${setHour(i)}`] = item[`h${setHour(i)}`];
                }
              }
          } else if (type === '24hour') {
              for (let i = 0; i <= 23; i++) {
                  data[`h${setHour(i)}`] = item[`h${setHour(i)}`];
              }
          } else if (type === 'month') {
            delete data.goalrank;
            delete data.h24;
            for ( let i = 1; i <=31; i++) {
              data[`d${i.toString()}`] = item[`d${i.toString()}`];
            }
          }
          return data;
      });
      setSortData(temp)

      setTotalPage(MonitoringData.totalpage)
    }
  },[MonitoringData])

  const RoundedPagination = () => {
      let items = [];
      // console.log("totalPage 2",totalPage)
      for (let number = 1; number <= totalPage; number++) {
          items.push(
              <Pagination.Item key={number.toString()} onClick={()=>setCurrentPage(number)} active={number === currentPage}>
                  {number}
              </Pagination.Item>
          );
      }
      return (
          <div className='mt-3 monitoring-pagination'>
              <Pagination className="pagination-rounded">
                  <Pagination.Prev />
                  {items}
                  <Pagination.Next />
              </Pagination>
          </div>
      );
  };

  const SelectDate = () => {
    if( type === 'week' || type === '24hour') {
      return (
          <div>
            <CustomDatePicker
              maxDate={new Date()}
              hideAddon={false}
              dateFormat="yyyy-MM-dd"
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>
      )
    } else if( type === 'month' ) {
      const months = Array.from({ length: 12 }, (_, index) => index + 1);
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 11 }, (_, index) => currentYear - 10 + index);
      years.sort((a, b) => b - a);

      return (
        <>
          <Form.Select id='year-select' className='form-control form-control-light' defaultValue={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map((year => <option key={year} value={year}>{`${year}년`}</option>))}
          </Form.Select>
          <Form.Select id='month-select' className='form-control form-control-light' defaultValue={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((month => <option key={month} value={month.toString().padStart(2, '0')}>{`${month}월`}</option>))}
          </Form.Select>
        </>
      )
    }
  }

  const KeywordInput = () => {
    if( type === 'week' || type === '24hour') {
      return (
        <div>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value||'')} placeholder='키워드' className='form-control'/>
        </div>
      )
    } 
  }
  
  return (
    <>
          <Card className={`monitoring-card ${type === 'month' ? 'monitoring-card-month' : ''}`}>
            <Card.Body>
              <div className='search-area'>

                  <Form.Select id='platform-select' defaultValue='' aria-label="Default select example" onChange={(e) => setPlatform(e.target.value)}>
                    <option value=''>플랫폼 검색</option>
                    {platformListData && platformListData.map((platform, index) => <option key={index} value={platform.type}>{platform.name}</option>)}
                  </Form.Select>

                  {type === 'week' || type === '24hour' ? 
                  <div>
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value||'')} placeholder='키워드' className='form-control'/>
                  </div> : ''}

                  <SelectDate/>

                  {type === 'month' ? 
                    <>
                      <Button onClick={() => {setWeekBtn(true), setHourBtn(false)}} variant={`${weekBtn ? 'info' : 'light'}`} className='week-btn'>주간</Button>
                      <Button onClick={() => {setHourBtn(true), setWeekBtn(false)}} variant={`${hourBtn ? 'info' : 'light'}`} className='hour-bth'>24시</Button>
                    </>
                  : ''}

              </div>
            </Card.Body>

            <Card.Body>

              <MonitoringTable type={type} data={sortData}/>

            </Card.Body>

            <Card.Body>
              <Form.Select defaultValue={100} aria-label="Default select example" onChange={(e) => setRows(parseInt(e.target.value))}>
                <option value="50">50개</option>
                <option value="100">100개</option>
                <option value="200">200개</option>
              </Form.Select>
              <RoundedPagination/>
            </Card.Body>

            
          </Card>


      
    </>
  );
};

export default AdvancedTable;
