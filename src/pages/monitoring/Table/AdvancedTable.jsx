import { Card, Button } from 'react-bootstrap';
import { CustomDatePicker, Spinner } from '@/components';
import { useState, useEffect } from 'react';
import useMonitoringKeyword from './useMonitoringKeyword';
import MonitoringTable from './MonitoringTable';
import Form from 'react-bootstrap/Form';
import { Pagination } from 'react-bootstrap';
import { useUserInfoContext } from '@/common';
import usePlatformList from './usePlatformList';
import './css/MonitoringTable-common.style.css';
import './css/Switch.css';

const AdvancedTable = ( {type} ) => {
  const [ selectedDate, setSelectedDate ] = useState(new Date())
  const [ editedSelectedDate, setEditedSelectedDate ] = useState(new Date().toISOString().split('T')[0])
  const [ platform, setPlatform ] = useState('')
  const [ keyword, setKeyword ] = useState('')
  const { data:MonitoringData, loading, searchKeyword, showNotification } = useMonitoringKeyword(type);
  const [ sortData, setSortData ] = useState([])
  const [ rows, setRows ] = useState(100);
  const [ totalPage, setTotalPage ] = useState('');
  const [ currentPage, setCurrentPage ] = useState(1);
  const { clientUid } = useUserInfoContext(); 
  const { data:platformListData, getPlatformList } = usePlatformList();
  const [ selectedMonth, setSelectedMonth ] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
  const [ weekBtn, setWeekBtn ] = useState(true);
  const [ hourBtn, setHourBtn ] = useState(false);
  const [ today, setToday ] = useState(new Date().toISOString().split('T')[0])
  const [ isToday, setIsToday ] = useState(true);
  let dataType = '';

  const [ isSwitchOn, setIsSwitchOn ] = useState(false);
  // const [ isSwitchShow, setIsSwitchShow ] = useState(false);

  useEffect(()=>{
    if(selectedDate) {
      const editedDate = selectedDate.toISOString().split('T')[0];
      setEditedSelectedDate(editedDate)
    }
    // console.log("1111111111", selectedDate, editedSelectedDate)

  },[selectedDate])

  useEffect(()=>{
    if(today === editedSelectedDate) {
      setIsToday(true)
    } else {
      setIsToday(false)
    }
    // console.log("오늘인지: ", isToday)
    // console.log("2222222222", selectedDate, editedSelectedDate)
    if(editedSelectedDate || (clientUid || clientUid === '') || platform || (keyword || keyword === '') || rows || currentPage || selectedMonth || selectedYear ) {
      // console.log("1 w: ",weekBtn, "h:", hourBtn)
      // console.log('keyword: ', keyword)

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

  },[clientUid, platform, rows, currentPage, selectedMonth, selectedYear, weekBtn, hourBtn, editedSelectedDate, today, isToday])

  useEffect(()=>{
    if(clientUid !== '') {
      setIsSwitchOn(true)
    } else {
      setIsSwitchOn(false)
    }
  },[clientUid])

  const handleKeywordInput = () => {
    searchKeyword({ editedSelectedDate, clientUid, platform, keyword, rows, currentPage, selectedMonth, selectedYear, dataType })
  }


  
  // useEffect(()=>{
  //   // 1초마다 searchKeyword 호출
  //   const intervalCallAPI= setInterval(() => {
  //     searchKeyword({ editedSelectedDate, clientUid, platform, keyword, rows, currentPage, selectedMonth, selectedYear, dataType })
  //     console.log("데이터불러옴")
  //   }, 5000);

  //   // 컴포넌트가 언마운트될 때 clearInterval을 통해 interval 정리
  //   return () => clearInterval(intervalCallAPI);
  // },[])

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
              seq: item.client_collect_seq
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
      if(totalPage === 0) {
        items.push( <Pagination.Item key={1} active={1}> 1 </Pagination.Item> );
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



  // const handleSwitchChange = (e) => {
  //   if (e.target.checked) {
  //     setIsSwitchOn(true)
  //   } else {
  //     setIsSwitchOn(false)
  //   }
  // };

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
  
  return (
    <>
          <Card className={`monitoring-card ${type === 'month' ? 'monitoring-card-month' : ''}`}>
            <Card.Body className='d-flex justify-content-between'>
              <div className='search-area'>

                  <Form.Select id='platform-select' defaultValue='' aria-label="Default select example" onChange={(e) => setPlatform(e.target.value)}>
                    <option value=''>플랫폼 선택</option>
                    {platformListData && platformListData.map((platform, index) => <option key={index} value={platform.type}>{platform.name}</option>)}
                  </Form.Select>

                  {type === 'week' || type === '24hour' ? 
                  <div>
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value||'')} onKeyUp={handleKeywordInput} placeholder='키워드' className='form-control'/>
                  </div> : ''}

                  <SelectDate/>

                  {type === 'month' ? 
                    <>
                      <Button onClick={() => {setWeekBtn(true), setHourBtn(false)}} variant={`${weekBtn ? 'info' : 'light'}`} className='week-btn'>주간</Button>
                      <Button onClick={() => {setHourBtn(true), setWeekBtn(false)}} variant={`${hourBtn ? 'info' : 'light'}`} className='hour-bth'>24시</Button>
                    </>
                  : ''}
              </div>
              {/* {isSwitchShow ? 
                <>
                  <input
                    className="react-switch-checkbox"
                    id={`react-switch-new`}
                    type="checkbox"
                    onChange={(e) => handleSwitchChange(e)}
                  />
                  <label
                    className="react-switch-label"
                    htmlFor={`react-switch-new`}
                  >
                    <span className={`react-switch-button`}/>
                  </label>
                </> : ''
              } */}
            </Card.Body>

            <Card.Body>

              { loading ? <div className='spinner-container'><Spinner color='primary' size='md' className='m-auto'/></div> : <MonitoringTable type={type} data={sortData} isToday={isToday} isSwitchOn={isSwitchOn}/> }
              { totalPage === 0 ? <div className='zero-data-container'>0건의 데이터가 검색되었습니다.</div> : ''}

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
