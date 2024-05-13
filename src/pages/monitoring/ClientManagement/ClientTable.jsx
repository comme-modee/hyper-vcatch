import { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { useModal } from '@/pages/ui/base/hooks';
import Form from 'react-bootstrap/Form';
import useClientManagement from './useClientManagement';
import { useUserInfoContext } from '@/common';
import { useNavigate } from 'react-router-dom';

import './css/ClientTable.style.css';
import useErrorAni from '@/hooks/useErrorAni';

const AdvancedTable = () => {

  const [ currentPage, setCurrentPage ] = useState(1);
  const [ rows, setRows ] = useState(10);
  const [ client, setClient ] = useState('')
  const { data:ClientData, addDataLoading, editDataLoading, deleteDataLoading, getClientData, addClientData, deleteClientData, editClientData, showNotification } = useClientManagement();
  const [ sortData, setSortData ] = useState([])
  const [ totalPage, setTotalPage ] = useState('');
  const [ clientName, setClientName ] = useState('');
  const [ clientMemo, setClientMemo ] = useState('');
  
  const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
  const [ isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen ] = useState(false);
  const [ editModalClient, setEditModalClient ] = useState('');
  const [ editModalSeq, setEditModalSeq ] = useState('');
  const [ editModalMemo, setEditModalMemo ] = useState('');
  const { toggleModal } = useModal();
  const [ isInputError, setIsInputError ] = useState(false);
  
  const [ isClickedDeleteBtn, setIsClickedDeleteBtn ] = useState(false);
  const [ seqTemp, setSeqTemp ] = useState('');

  const { errorAni, handleErrorAni } = useErrorAni();
  
  const navigator = useNavigate();

  useEffect(()=>{

    getClientData({ page: currentPage, rows: rows, client })

    window.scrollTo({
      top: 0
    });

  },[rows, currentPage])

  //클라이언트 생성 모달창 오픈
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  //클라이언트 수정 모달창 오픈
  const openEditModal = (client, seq, memo) => {
    setEditModalClient(client)
    setEditModalSeq(seq)
    setEditModalMemo(memo)
    setIsEditModalOpen(true);
  };

  //삭제확인 모달창 오픈
  const openConfirmDeleteModal = (seq) => {
    setIsConfirmDeleteModalOpen(true)
    setSeqTemp(seq)
  }

  //삭제여부 확인 후 삭제
  useEffect(()=>{
    if(seqTemp !== '' && isClickedDeleteBtn) {
      deleteClientData(seqTemp)
      setIsConfirmDeleteModalOpen(false)
      setIsClickedDeleteBtn(false)
      setSeqTemp('')
    }
  },[isClickedDeleteBtn])

  //삭제 안하고 닫기 버튼 누르면 seqTemp 초기화
  useEffect(()=>{
    if(!isConfirmDeleteModalOpen) {
      setSeqTemp('')
    }
  },[isConfirmDeleteModalOpen])

  //클라이언트 검색창 input onKeyUp시 데이터 호출
  const handleClientSearchInput = () => {
    getClientData({ page: currentPage, rows: rows, client })
  }

  //추가&삭제&수정 끝난 뒤 데이터 재호출
  useEffect(()=>{

    if(!addDataLoading || !deleteDataLoading || !editDataLoading ) {
      getClientData({ page: currentPage, rows: rows, client })
    }

  },[addDataLoading, deleteDataLoading, editDataLoading])
  

  //생성버튼
  const handleAddClient = () => {
    if(clientName) {
      setIsInputError(false)
      setIsAddModalOpen(false)
      addClientData({clientName, clientMemo})
    } else {
      setIsInputError(true)
      handleErrorAni()
    }
  }

  //생성 안하고 닫기 누르면 인풋 빨간테두리 사라짐
  useEffect(()=>{
    if(!isAddModalOpen) {
      setIsInputError(false)
    }
  },[isAddModalOpen])


  //수정버튼
  const handleEditClient = (seq, memo) => {
    editClientData({ seq,memo })
    setIsEditModalOpen(false)
  }
  

  // 받아온 데이터 정리
  useEffect(()=> {
    if(ClientData && ClientData.list) {
      let temp = ClientData.list.map((item) => {
        
        const data = {
          client: item.name,
          regist: item.date,
          keyword: item.keyword,
          related: item.relation_count,
          connect: item.account,
          memo: item.memo,
          seq: item.seq
        };
        return data;
      });
      setSortData(temp)
      setTotalPage(ClientData.totalpage)
    }
  },[ClientData, seqTemp])

  //clientUid 저장
  const { saveClientUid } = useUserInfoContext(); 

  const navigateToKeywordWeek = (clinet) => {
    console.log(clinet)
    saveClientUid(clinet.toString())
    navigator('/monitoring/keyword-week')
  }

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

  const ClientTable = () => {
    return (
      <>
        <div className='client-table'>
          <div className='header'>
              <div className='num'>No</div>
              <div className='client'>클라이언트명</div>
              <div className='regist'>등록일</div>
              <div className='keyword'>키워드 수</div>
              <div className='connect'>연결 계정 수</div>
              <div className='memo'>메모</div>
              <div className='edit'>수정</div>
              <div className='del'>삭제</div>
          </div>
          <div className='body'>
              {sortData.map((item, index) => (
                  <div key={index} className='content'>
                    <div className='num'><p>{index+1}</p></div>
                    <div className='client'><p>{item.client}</p></div>
                    <div className='regist'><p>{item.regist}</p></div>
                    <div className='keyword text-info' onClick={() => navigateToKeywordWeek(item.seq)}><p>{item.keyword}</p></div>
                    <div className='connect'><p>{item.connect}</p></div>
                    <div className='memo'><p>{item.memo}</p></div>
                    <div className='edit' onClick={() => openEditModal(item.client, item.seq, item.memo)}><i className='ri-pencil-line text-primary'></i></div>
                    <div className='del' onClick={() => openConfirmDeleteModal(item.seq)}><i className='ri-delete-bin-line text-danger'></i></div>
                  </div>
              ))}
          </div>
        </div>        
      </>
    )
  }


  return (
    <>
          <Card className='client-card'>
            <Card.Body>
              <div className='search-area'>
                  <input type="text" value={client} onChange={(e) => setClient(e.target.value)} onKeyUp={handleClientSearchInput} placeholder='클라이언트 검색' className='form-control'/>
                  <Button variant='primary' className='add-btn' onClick={openAddModal}><i className='mdi mdi-account-plus'></i> 신규 클라이언트 생성</Button>
              </div>
            </Card.Body>

            <Card.Body>

              <ClientTable />

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


              <Modal show={isAddModalOpen} onHide={() => setIsAddModalOpen(false)} dialogClassName='new-client-modal modal-dialog-centered' size='md'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">신규 클라이언트 생성</h4>
                </Modal.Header>
                <Modal.Body>
                  <div className='mb-2'>
                    <label htmlFor='client-group'>클라이언트 그룹명</label>
                    <input id='client-group' className={`form-control ${isInputError && clientName === '' ? `error ${errorAni}` : ''}`} value={clientName} onChange={(e) => setClientName(e.target.value)}></input>
                  </div>
                  <div>
                    <label htmlFor='client-memo'>메모</label>
                    <input id='client-memo' className='form-control' value={clientMemo} onChange={(e) => setClientMemo(e.target.value)}></input>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleAddClient()}>
                    생성
                  </Button>
                  <Button variant="light" onClick={() => setIsAddModalOpen(false)}>
                    닫기
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)} dialogClassName='edit-client-modal modal-dialog-centered' size='md'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">클라이언트 수정</h4>
                </Modal.Header>
                <Modal.Body>
                  <div className='mb-2'>
                    <label htmlFor='client-group'>클라이언트 그룹명</label>
                    <input id='client-group' className='form-control form-control-light' value={editModalClient} readOnly></input>
                  </div>
                  <div>
                    <label htmlFor='client-memo'>메모</label>
                    <input id='client-memo' className='form-control' value={editModalMemo} onChange={(e) => setEditModalMemo(e.target.value)}></input>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleEditClient(editModalSeq, editModalMemo)}>
                    수정
                  </Button>
                  <Button variant="light" onClick={() => setIsEditModalOpen(false)}>
                    닫기
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
