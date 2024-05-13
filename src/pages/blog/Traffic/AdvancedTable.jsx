import { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Spinner } from '@/components';
import { Pagination } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import useBlogCounter from './useBlogCounter';
import { Link } from 'react-router-dom';
import { useModal } from '@/pages/ui/base/hooks';
import './css/BlogCounterTable.style.css';
import useErrorAni from '@/hooks/useErrorAni';

const AdvancedTable = () => {

  const [ keyword, setKeyword ] = useState('')
  const [ amount, setAmount ] = useState('')
  const { data:counterData, loading, addDataLoading, deleteDataLoading, deleteAllDataLoading, getCounterData, addCounterData, deleteCounterData, showNotification } = useBlogCounter();
  const [ sortData, setSortData ] = useState([])
  const [ rows, setRows ] = useState(100);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ totalPage, setTotalPage ] = useState('');
  
  const [ url, setUrl ] = useState('');
  const [ refUrl, setRefUrl ] = useState('');
  const [ day, setDay ] = useState('');
  const [ count, setCount ] = useState('');
  
  const [ isInputError, setIsInputError ] = useState(false);
  
  const [ seqTemp, setSeqTemp ] = useState('');
  const [ type, setType ] = useState('');
  const { toggleModal } = useModal();
  const [ isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen ] = useState(false);
  const [ isClickedDeleteBtn, setIsClickedDeleteBtn ] = useState(false);

  const { errorAni, handleErrorAni } = useErrorAni();


  useEffect(()=>{
    getCounterData({ page: currentPage, rows: rows })
    window.scrollTo({
      top: 0
    });

    // console.log(currentPage, rows)
  },[])

  
  //추가버튼
  const handleAddVisitor = () => {
    if(url && day && count) {
      setIsInputError(false)
      addCounterData({url, refUrl, day, count})
    } else {
      setIsInputError(true)
      handleErrorAni()
    }
  }
  useEffect(()=>{
    // console.log("===데이터 추가 중===", addDataLoading)
    if(!addDataLoading) {
      getCounterData({ page: currentPage, rows: rows })
      setUrl('')
      setRefUrl('')
      setDay('')
      setCount('')
    }
  },[addDataLoading])
  
  useEffect(()=>{
    // console.log("+++데이터 삭제 중+++", deleteDataLoading)
    // console.log("+++데이터 모두 삭제 중+++", deleteAllDataLoading)
    if(!deleteDataLoading || !deleteAllDataLoading) {
      getCounterData({ page: currentPage, rows: rows })
    }
  },[deleteDataLoading, deleteAllDataLoading])

  //삭제확인 모달창 오픈
  const openConfirmDeleteModal = (seq, type) => {
    setIsConfirmDeleteModalOpen(true)
    setSeqTemp(seq)
    setType(type)
  }

  //삭제여부 확인 후 삭제
  useEffect(()=>{
    if(isClickedDeleteBtn) {
      if(type === 0) {
        deleteCounterData({ seq:seqTemp, type })
      }
      if(seqTemp && type === 1) {
        deleteCounterData({ seq:seqTemp, type })
      }
      setIsConfirmDeleteModalOpen(false)
      setIsClickedDeleteBtn(false)
      setType('')
      setSeqTemp('')
    }

  },[isClickedDeleteBtn])

  //삭제 안하고 닫기 버튼 누르면 seqTemp 초기화
  useEffect(()=>{
    if(!isConfirmDeleteModalOpen) {
      setSeqTemp('')
      setType('')
    }
  },[isConfirmDeleteModalOpen])



  // 받아온 데이터 정리
  useEffect(()=> {
    if(counterData && counterData.list) {
      let temp = counterData.list.map((item) => {
        
        const data = {
          date: item.add_date,
          url: item.blog_url,
          ref_url: item.blog_refererurl,
          count: item.cnt_count,
          day: item.blog_day,
          progress: item.cnt_progress,
          status: item.status,
          seq: item.cnt_seq
        };
        return data;
      });
      setSortData(temp)
      setTotalPage(counterData.totalpage)
    }
  },[counterData])


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
          <div className='mt-3 blog-pagination'>
              <Pagination className="pagination-rounded">
                  <Pagination.Prev />
                  {items}
                  <Pagination.Next />
              </Pagination>
          </div>
      );
  };

  const BlogCounterTable = () => {
    return (
      <>
        <div className='blog-counter-table'>
          <div className='header'>
              <div className='date'>등록시간</div>
              <div className='url'>URL</div>
              <div className='ref-url'>Referer URL</div>
              <div className='count'>등록갯수</div>
              <div className='day'>기간</div>
              <div className='prog'>성공갯수</div>
              <div className='flag'>Flag</div>
              <div className='del'>관리</div>
          </div>
          <div className='body'>
              {sortData.map((item, index) => (
                  <div className='content' key={index}>
                      <div className='date'><p>{item.date}</p></div>
                      <div className='url'><p>{item.url}</p><Link to={item.url}><i className='ri-links-fill'/></Link></div>
                      <div className='ref-url'><p>{item.ref_url}</p></div>
                      <div className='count'><p>{item.count}</p></div>
                      <div className='day'><p>{item.day}</p></div>
                      <div className='prog'><p>{item.progress}</p></div>
                      <div className='flag'>
                            {item.status === '완료' ? <p className='text-primary'>완료</p>:
                             item.status === '대기' ? <p className='text-warning'>대기</p>:
                             item.status === '진행중' ? <p className='text-warning'>진행중</p>: <p>-</p>}
                      </div>
                      <div className='del'>
                          <Button className='del-btn' variant='danger' onClick={() => openConfirmDeleteModal(item.seq, 1)}>삭제</Button>
                      </div>
                  </div>
              ))}
          </div>
        </div>        
      </>
    )
  }


  return (
    <>
          <Card className='blog-counter-card'>
            <Card.Body>
              <div className='search-area'>
                  <div className='url-input'>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='URL 입력' className={`form-control ${isInputError && url === '' ? `error ${errorAni}` : ''}`}/>
                  </div>
                  <div className='ref-url-input'>
                    <input type="text" value={refUrl} onChange={(e) => setRefUrl(e.target.value)} placeholder='Referer URL 입력' className='form-control'/>
                  </div>
                  <div className='day-input'>
                    <input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder='기간(일)' className={`form-control ${isInputError && day === '' ? `error ${errorAni}` : ''}`}/>
                  </div>
                  <div className='count-input'>
                    <input type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder='총갯수' className={`form-control ${isInputError && count === '' ? `error ${errorAni}` : ''}`}/>
                  </div>


                  <Button variant='primary' className='add-btn' onClick={() => handleAddVisitor()}>추가</Button>

                  {deleteAllDataLoading ? 
                      <Button variant='danger' className='delete-all-btn' disabled>
                            <Spinner className="spinner-border-sm me-1" tag="span" color="white"/>
                            삭제 중
                      </Button> :
                      <Button variant='danger' className='delete-all-btn' onClick={() => openConfirmDeleteModal(seqTemp, 0)}>모두 삭제</Button>
                  }
                  

              </div>
            </Card.Body>

            <Card.Body>

              <BlogCounterTable />

              <Modal show={isConfirmDeleteModalOpen} onHide={() => setIsConfirmDeleteModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">클라이언트 삭제</h4>
                </Modal.Header>
                <Modal.Body>
                  정말 삭제하시겠습니까?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light"onClick={() => setIsConfirmDeleteModalOpen(false)}>
                    취소
                  </Button>
                  <Button variant="danger" onClick={() => setIsClickedDeleteBtn(true)}>
                    삭제
                  </Button>
                </Modal.Footer>
              </Modal>

              { totalPage === 0 ? <div className='zero-data-container'>0건의 데이터가 검색되었습니다.</div> : ''}

            </Card.Body>

            <Card.Body>
              <Form.Select defaultValue={10} aria-label="Default select example" onChange={(e) => setRows(parseInt(e.target.value))}>
                <option value="10">10개</option>
                <option value="25">25개</option>
                <option value="50">50개</option>
                <option value="100">100개</option>
              </Form.Select>
              <RoundedPagination/>
            </Card.Body>

            
          </Card>


      
    </>
  );
};

export default AdvancedTable;
