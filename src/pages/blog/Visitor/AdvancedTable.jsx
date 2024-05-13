import { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Spinner } from '@/components';
import { Pagination } from 'react-bootstrap';
import { useModal } from '@/pages/ui/base/hooks';
import Form from 'react-bootstrap/Form';
import useBlogVisitor from './useBlogVisitor';
import useExportExcel from './useExportExcel';
import './css/BlogVisitorTable.style.css';
import useErrorAni from '@/hooks/useErrorAni';

const AdvancedTable = () => {

  const [ keyword, setKeyword ] = useState('')
  const [ amount, setAmount ] = useState('')
  const { data:visitorData, memoData, loading, addDataLoading, deleteDataLoading, getVisitorData, putVisitorData, deleteVisitorData, getMemoData, showNotification } = useBlogVisitor();
  const [ sortData, setSortData ] = useState([])
  const [ rows, setRows ] = useState(100);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ totalPage, setTotalPage ] = useState('');

  const [ memoSeq, setMemoSeq ] = useState(null);
  const [ memoKeyword, setMemoKeyword ] = useState('');
  const [ memoDate, setMemoDate ] = useState('');

  const { isOpen, size, className, toggleModal, openModalWithSize, openModalWithClass } = useModal();
  const { memoExportLoading, handleOnExport } = useExportExcel();

  const [ seqTemp, setSeqTemp ] = useState('');
  const [ type, setType ] = useState('');

  const { toggleConfirmModal } = useModal();
  const [ isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen ] = useState(false);
  const [ isClickedDeleteBtn, setIsClickedDeleteBtn ] = useState(false);

  const [ isInputError, setIsInputError ] = useState(false);
  const { errorAni, handleErrorAni } = useErrorAni();

  useEffect(()=>{
    getVisitorData({ page: currentPage, rows: rows })
    window.scrollTo({
      top: 0
    });

    // console.log(currentPage, rows)
  },[])

  
  //추가버튼
  const handleAddVisitor = () => {
    if(keyword && amount) {
      setIsInputError(false)
      putVisitorData({keyword, amount})
    } else {
      setIsInputError(true)
      handleErrorAni()
    }
  }
  useEffect(()=>{
    // console.log("=====", addDataLoading)
    if(!addDataLoading) {
      getVisitorData({ page: currentPage, rows: rows })
      setKeyword('')
      setAmount('')
    }
  },[addDataLoading])
  
  useEffect(()=>{
    // console.log("++++++", deleteDataLoading)
    if(!deleteDataLoading) {
      getVisitorData({ page: currentPage, rows: rows })
    }
  },[deleteDataLoading])

  //MEMO 버튼
  const handleMemoBtn = (seq, date, keyword) => {
      setMemoSeq(seq)
      setMemoDate(date)
      setMemoKeyword(keyword)
      getMemoData(seq)
      openModalWithSize('lg')
      openModalWithClass('memo-modal modal-dialog-centered')
  }


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
        deleteVisitorData({ seq:seqTemp, type })
      }
      if(seqTemp && type === 1) {
        deleteVisitorData({ seq:seqTemp, type })
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
    if(visitorData && visitorData.list) {
      let temp = visitorData.list.map((item) => {
        
        const data = {
          date: item.visitor_date,
          condition: item.visitor_condition,
          keyword: item.visitor_keyword,
          amount: item.visitor_amount,
          seq: item.visitor_seq
        };
        return data;
      });
      setSortData(temp)
      setTotalPage(visitorData.totalpage)
    }
  },[visitorData])


  const handleShowBtn = (e) => {
    const clickedContent = e.currentTarget; // 클릭된 요소 가져오기
    const target = e.target;
    // console.log("target: ",target)

    const allContentElements = document.querySelectorAll('.content');

    // 모든 content 요소들을 순회하면서 클릭된 요소가 아닌 경우에만 show 클래스를 제거
    allContentElements.forEach(content => {
      if (content !== clickedContent && content.classList.contains('show')) {
        content.classList.remove('show');
      }
    });
  
    // 클릭된 요소가 버튼 래퍼 요소에 포함되어 있다면 아무 작업도 하지 않음
    if (target.classList.contains('btn-wrap') || target.classList.contains('memo-btn') || target.classList.contains('del-btn')) {
      return;
    }
  
    // 클릭된 요소에 show 클래스가 있는지 확인하여 토글
    if (clickedContent.classList.contains('show')) {
      clickedContent.classList.remove('show');
    } else {
      clickedContent.classList.add('show');
    }
  };

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

  const BlogVisitorTable = () => {
    return (
      <>
        <div className='blog-visitor-table'>
          <div className='header'>
              <div className='date'>진행시간</div>
              <div className='condition'>작업 상태</div>
              <div className='keyword'>키워드</div>
              <div className='amount'>설정 페이지</div>
              <div className='memo'>결과</div>
              <div className='del'>삭제</div>
          </div>
          <div className='body'>
              {sortData.map((item, index) => (
                  <div key={index} className='content hide' onClick={(e) => handleShowBtn(e)}>
                    <div className='date'><p>{item.date || '-'}</p></div>
                    <div className='condition'>
                        {item.condition === 'Y' ? <p className='text-primary'>성공</p> :
                          item.condition === 'N' ? <p className='text-warning'>대기중</p> :
                          item.condition === 'L' ? <p className='text-danger'>작업중</p> : <p>-</p>}
                    </div>
                    <div className='keyword'><p>{item.keyword}</p></div>
                    <div className='amount'><p>{item.amount}</p></div> 
                    <div className='btn-wrap'>
                      <div className='memo'><Button className='memo-btn' onClick={() => handleMemoBtn(item.seq, item.date, item.keyword)}>MEMO</Button></div>
                      <div className='del'><Button className='del-btn' variant='danger' onClick={() => openConfirmDeleteModal(item.seq, 1)}>삭제</Button></div>
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
          <Card className='blog-visitor-card'>
            <Card.Body>
              <div className='search-area'>
                  <div className='keyword-input'>
                    <input type="text" className={`form-control ${isInputError && keyword === '' ? `error ${errorAni}` : ''}`}value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='키워드를 입력하세요'/>
                  </div>
                  <div className='amount-input'>
                    <input type="number" className={`form-control ${isInputError && amount === '' ? `error ${errorAni}` : ''}`} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='기준방문자 횟수'/>
                  </div>
 
                  <Button variant='primary' className='add-btn' onClick={() => handleAddVisitor()}>추가</Button>

                  {deleteDataLoading ? 
                      <Button variant='danger' className='delete-all-btn' disabled>
                            <Spinner className="spinner-border-sm me-1" tag="span" color="white"/>
                            삭제 중
                      </Button> :
                      <Button variant='danger' className='delete-all-btn' onClick={() => openConfirmDeleteModal(seqTemp, 0)}>모두 삭제</Button>
                  }
                  

              </div>
            </Card.Body>

            <Card.Body>

              <BlogVisitorTable />

              <Modal show={isConfirmDeleteModalOpen} onHide={() => setIsConfirmDeleteModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
                <Modal.Header onHide={toggleConfirmModal} closeButton>
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

              <Modal show={isOpen} onHide={toggleModal} dialogClassName={className} size={size}>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">방문자 결과 내역 <span className='text-primary'>TOTAL: {memoData && memoData.list.length}</span></h4>
                </Modal.Header>
                <Modal.Body className='memo-table'>
                  <div className='header'>
                      <div className='id'>Naver ID</div>
                      <div className='url'>URL</div>
                      <div className='visitor'>방문자 수 (3일 평균)</div>
                      <div className='ranking'>블로그 랭킹</div>
                  </div>
                  {memoData && memoData.list.length === 0 ? <div className='no-memo-data'>내역이 없습니다.</div> :
                      <div className='body'>
                        {memoData && memoData.list.map((item, index)=> (
                          <div className='content' key={index}>
                            <div className='id'><p>{item.stats_id}</p></div>
                            <div className='url'><p><Link to={item.stats_url}>{item.stats_url}</Link></p></div>
                            <div className='visitor'><p>{item.stats_amount}</p></div>
                            <div className='ranking'><p>{item.stats_rank}</p></div>
                          </div>
                        ))}
                      </div>
                  }
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleOnExport({data:memoData, date:memoDate, keyword:memoKeyword})}>
                    엑셀 출력
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
