import { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { useModal } from '@/pages/ui/base/hooks';
import Form from 'react-bootstrap/Form';
import useKeywordManagement from './useKeywordManagement';
import usePlatformList from '../Table/usePlatformList';
import useGetClientList from '@/layouts/Topbar/useGetClientList';
import './css/KeywordTable.style.css';
import useErrorAni from '@/hooks/useErrorAni';

const KeywordTable = () => {
  const [ userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const { data:platformListData, getPlatformList } = usePlatformList();
  const [ currentPage, setCurrentPage ] = useState('1');
  const [ rows, setRows ] = useState('100');
  const [ client, setClient ] = useState('')
  const [ keyword, setKeyword ] = useState('')

  const [ platform, setPlatform ] = useState('')
  const { data:KeywordData, singleData, loading, singleDataLoading, addDataLoading, editDataLoading, deleteDataLoading, getKeywordData, getSingleKeywordData, addKeywordData, deleteKeywordData, editKeywordData, showNotification } = useKeywordManagement();
  const [ sortData, setSortData ] = useState([])
  const [ totalPage, setTotalPage ] = useState('');
  const [ seqTemp, setSeqTemp ] = useState(null);

  const [ addPlatform, setAddPlatform ] = useState('');
  const [ addClient, setAddClient ] = useState('');
  const [ addKeyword, setAddKeyword ] = useState('');
  const [ addUrl, setAddUrl ] = useState('');
  const [ addGoalrank, setAddGoalrank ] = useState('5');
  const goalrankNumber = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 ];

  const [ editPlatform, setEditPlatform ] = useState('');
  const [ editSeq, setEditSeq ] = useState('');
  const [ editClient, setEditClient ] = useState('');
  const [ editKeyword, setEditKeyword ] = useState('');
  const [ editUrl, setEditUrl ] = useState('');
  const [ editGoalrank, setEditGoalrank ] = useState('5');

  const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
  const [ isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen ] = useState(false);
  const [ isClickedDeleteBtn, setIsClickedDeleteBtn ] = useState(false);

  const { toggleModal } = useModal();
  const { data:clientListData, getClientList } = useGetClientList();

  const [ isAddModalError, setIsAddModalError ] = useState(false);
  const [ isEditModalError, setIsEditModalError ] = useState(false);

  const { errorAni, handleErrorAni } = useErrorAni();
  
  useEffect(()=>{
    if(userInfo) {
      getPlatformList();
      getClientList(userInfo.username);
    }
  },[userInfo])

  useEffect(()=>{
    if(!singleDataLoading && singleData) {
      setIsEditModalOpen(true);
      setEditPlatform(singleData.info_platform)
      setEditKeyword(singleData.info_keyword)
      setEditUrl(singleData.info_url)
      setEditGoalrank(singleData.info_goalrank.toString())
      setEditSeq(singleData.client_collect_seq)
      clientListData.filter(client => client.client_uid === singleData.client_uid ? setEditClient(client.client_name) : '')
    }
  },[singleDataLoading])


  useEffect(()=>{
    if(!isAddModalOpen) {
      setIsAddModalError(false)
      setAddKeyword('')
      setAddUrl('')
      setAddPlatform('')
      setAddClient('')
    }
    if(!isEditModalOpen) {
      setIsEditModalError(false)
    }
  },[isAddModalOpen, isEditModalOpen])


  useEffect(()=>{
    // console.log(keyword)
    getKeywordData({ page: currentPage, rows: rows, client, keyword, platform })
    
    window.scrollTo({
      top: 0
    });
  },[currentPage, rows, client, platform])

  //키보드 keyUp하면 자료호출(키워드 onChange에서는 keyword만 업데이트)
  const handleKeywordInput = () => {
    // console.log('키업')
    getKeywordData({ page: currentPage, rows: rows, client, keyword, platform })
  }

  useEffect(()=>{
    // console.log('---loading---')
    if(!addDataLoading || !deleteDataLoading || !editDataLoading ) {
      getKeywordData({ page: currentPage, rows: rows, client, keyword, platform })
    } 

  },[addDataLoading, deleteDataLoading, editDataLoading])
  
  //키워드 추가 모달창 오픈
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  //추가버튼
  const handleAddKeyword = () => {
    if(addPlatform && addClient && addKeyword && addUrl && addGoalrank) {
      addKeywordData({ platform:addPlatform, client:addClient, keyword:addKeyword, url:addUrl, goal:addGoalrank })
      setIsAddModalOpen(false)
      setIsAddModalError(false)
    } else { 
      setIsAddModalError(true)
      handleErrorAni()
    }
  }

  //수정버튼
  const handleEditKeyword = () => {
    if(editSeq && editPlatform && editKeyword && editUrl && editGoalrank) {
      editKeywordData({ seq:editSeq, platform:editPlatform, keyword:editKeyword, url:editUrl, goalrank:editGoalrank })
      setIsEditModalOpen(false)
      setIsEditModalError(false)
    } else {
      setIsEditModalError(true)
      if (errorAni === 'error-ani') {
        setErrorAni('');
        setTimeout(() => {
          setErrorAni('error-ani');
        }, 0);
      } else {
        setErrorAni('error-ani');
      }
    }
  }

  //삭제확인 모달창 오픈
  const openConfirmDeleteModal = (seq) => {
    setIsConfirmDeleteModalOpen(true)
    setSeqTemp(seq)
  }

  //삭제여부 확인 후 삭제
  useEffect(()=>{
    if(seqTemp !== '' && isClickedDeleteBtn) {
      deleteKeywordData(seqTemp)
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

  // 받아온 데이터 정리
  useEffect(()=> {
    if(KeywordData && KeywordData.list) {
      let temp = KeywordData.list.map((item) => {
        
        const data = {
          client: item.client_name,
          platform: item.platform,
          keyword: item.keyword,
          goalrank: item.infogoalrank,
          currentrank: item.rank,
          title: item.title,
          url: item.url,
          seq: item.seq,
        };
        return data;
      });
      setSortData(temp)
      setTotalPage(KeywordData.totalpage)
    }
  },[KeywordData])



  const RoundedPagination = () => {
      let items = [];
      // console.log("totalPage 2",totalPage)
      for (let number = 1; number <= totalPage; number++) {
          items.push(
              <Pagination.Item key={number.toString()} onClick={()=>setCurrentPage(number.toString())} active={number === parseInt(currentPage, 10)}>
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

  const KeywordTable = () => {
    return (
      <>
        <div className='keyword-table'>
          <div className='header'>
              <div className='num'>No</div>
              <div className='client'>클라이언트명</div>
              <div className='platform'>플랫폼</div>
              <div className='keyword'>키워드</div>
              <div className='goal'>목표순위</div>
              <div className='current'>현재순위</div>
              <div className='title'>타이틀</div>
              <div className='url'>타겟</div>
              <div className='edit'>수정</div>
              <div className='del'>삭제</div>
          </div>
          <div className='body'>
              {sortData.map((item, index) => (
                  <div key={`${item.client}${index}`} className='content'>
                    <div className='num'><p>{index+1}</p></div>
                    <div className='client'><p>{item.client}</p></div>
                    <div className='platform'><p>{item.platform}</p></div>
                    <div className='keyword'><p>{item.keyword}</p></div>
                    <div className='goal'><p>{item.goalrank}</p></div>
                    <div className='current'><p>{item.currentrank}</p></div>
                    <div className='title'><p>{item.title}</p></div>
                    <div className='url'><p>{item.url}</p></div>
                    <div className='edit' onClick={() => getSingleKeywordData(item.seq)}><i className='ri-pencil-line text-primary'></i></div>
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
          <Card className='keyword-card'>
            <Card.Body>
              <div className='search-area'>
                  <div>
                    <Form.Select id='platform-select' defaultValue='' aria-label="Default select example" onChange={(e) => setPlatform(e.target.value)}>
                      <option value=''>플랫폼 선택</option>
                      {platformListData && platformListData.map((platform, index) => <option key={`${platform.type}${index}`} value={platform.type}>{platform.name}</option>)}
                    </Form.Select>
                    <Form.Select id='client-select' defaultValue='' aria-label="Default select example" onChange={(e) => setClient(e.target.value)}>
                      <option value=''>클라이언트 선택</option>
                      {clientListData && clientListData.map((client, index) => <option key={`${client.client_uid}${index}`} value={client.client_uid}>{client.client_name}</option>)}
                    </Form.Select>
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyUp={handleKeywordInput} placeholder='키워드 검색' className='form-control'/>
                  </div>
                  {/* <Button onClick={()=>searchByKeyword()}>키워드 검색</Button> */}
                  <Button variant='primary' className='add-btn' onClick={openAddModal}><i className='uil uil-plus'></i> 키워드 등록</Button>
              </div>

            </Card.Body>

            <Card.Body>

              <KeywordTable />
              
              <Modal show={isConfirmDeleteModalOpen} onHide={() => setIsConfirmDeleteModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">키워드 삭제</h4>
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

              <Modal show={isAddModalOpen} onHide={() => setIsAddModalOpen(false)} dialogClassName='new-keyword-modal modal-dialog-centered' size='md'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">키워드 등록</h4>
                </Modal.Header>
                <Modal.Body>
                  <div className='d-flex gap-1 mb-2'>
                    <div className='w-50'>
                      <Form.Select id='platform-select' className={`${isAddModalError && addPlatform === '' ? `error ${errorAni}` : ''}`} defaultValue='' aria-label="Default select example" onChange={(e) => setAddPlatform(e.target.value)}>
                        <option value=''>플랫폼 선택</option>
                        {platformListData && platformListData.map((platform, index) => <option key={`${platform.type}${index}`} value={platform.type}>{platform.name}</option>)}
                      </Form.Select>
                    </div>
                    <div className='w-50'>
                      <Form.Select id='client-select' className={`${isAddModalError && addClient === '' ? `error ${errorAni}` : ''}`} defaultValue='' aria-label="Default select example" onChange={(e) => setAddClient(e.target.value)}>
                        <option value=''>클라이언트 선택</option>
                        {clientListData && clientListData.map((client, index) => <option key={`${client.client_uid}${index}`} value={client.client_uid}>{client.client_name}</option>)}
                      </Form.Select>
                    </div>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='new-keyword'>키워드</label>
                    <input id='new-keyword' className={`form-control ${isAddModalError && addKeyword === '' ? `error ${errorAni}` : ''}`} value={addKeyword} onChange={(e) => setAddKeyword(e.target.value)}></input>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='url'>URL</label>
                    <input id='url' className={`form-control ${isAddModalError && addUrl === '' ? `error ${errorAni}` : ''}`} value={addUrl} onChange={(e) => setAddUrl(e.target.value)}></input>
                  </div>
                  <div>
                    <label htmlFor='goal'>모니터링 목표순위</label>
                    <Form.Select id='goal-select' defaultValue='5' aria-label="Default select example" onChange={(e) => setAddGoalrank(e.target.value)}>
                      {goalrankNumber && goalrankNumber.map((num) => <option key={num} value={num}>{num}위</option>)}
                    </Form.Select>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleAddKeyword()}>
                    등록
                  </Button>
                  <Button variant="light" onClick={() => setIsAddModalOpen(false)}>
                    닫기
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)} dialogClassName='edit-keyword-modal modal-dialog-centered' size='md'>
                <Modal.Header onHide={toggleModal} closeButton>
                  <h4 className="modal-title">키워드 수정</h4>
                </Modal.Header>
                <Modal.Body>
                  <div className='mb-2'>
                    <Form.Select id='platform-select' className={isEditModalError && editPlatform === '' ? `error ${errorAni}` : ''}defaultValue={editPlatform} aria-label="Default select example" onChange={(e) => setEditPlatform(e.target.value)}>
                        <option value=''>플랫폼 선택</option>
                        {platformListData && platformListData.map((platform, index) => <option key={`${platform.type}${index}`} value={platform.type}>{platform.name}</option>)}
                    </Form.Select>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='client-group'>클라이언트</label>
                    <input id='client-group' className='form-control form-control-light' value={editClient} readOnly></input>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='edit-keyword'>키워드</label>
                    <input id='edit-keyword' className={`form-control ${isEditModalError && editKeyword === '' ? `error ${errorAni}` : ''}`} value={editKeyword} onChange={(e) => setEditKeyword(e.target.value)}></input>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='edit-url'>URL</label>
                    <input id='edit-url' className={`form-control ${isEditModalError && editUrl === '' ? `error ${errorAni}` : ''}`} value={editUrl} onChange={(e) => setEditUrl(e.target.value)}></input>
                  </div>
                  <div>
                    <label htmlFor='goal'>모니터링 목표순위</label>
                    <Form.Select id='goal-select' defaultValue={editGoalrank} aria-label="Default select example" onChange={(e) => setEditGoalrank(e.target.value)}>
                      {goalrankNumber && goalrankNumber.map((num) => <option key={num} value={num}>{num}위</option>)}
                    </Form.Select>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => handleEditKeyword()}>
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
              <Form.Select defaultValue={'100'} aria-label="Default select example" onChange={(e) => setRows(e.target.value)}>
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

export default KeywordTable;
