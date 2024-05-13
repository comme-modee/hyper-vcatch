import { useState, useEffect } from 'react';
import { Card, Button, Toast } from 'react-bootstrap';
import useMemberManagement from './useMemberManagement';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components';
import './css/MemberTable.style.css';
import notFoundImg from '@/assets/images/svg/file-searching.svg';
import { useToggle } from '@/hooks';


const MemberTable = () => {

  // const [ client, setClient ] = useState('');
  const { data:memberData, haveClientList, loading, haveClientLoading, addClientLoading, deleteClientLoading, getMemberData, getHaveClientList, addClient, deleteClient, showNotification } = useMemberManagement();
  const [ filteredData, setFilteredData ] = useState('');
  const [ filteredHaveClientData, setFilteredHaveClientData ] = useState('');
  const [ filteredHaveNotClientData, setFilteredHaveNotClientData ] = useState('');
  const [ user, setUser ] = useState('');
  const [ haveNotClient, setHaveNotClient ] = useState('');
  const [ haveClient, setHaveClient ] = useState('');
  const [ id, setId ] = useState('');
  const [ clientUid, setClientUid ] = useState('');
  const [isOpenCustom1, hideCustom1] = useToggle(true);

  const isMobile = window.innerWidth <= 768;

  const navigator = useNavigate();

  useEffect(()=>{
    getMemberData()
  },[])

  useEffect(()=>{
    let temp = [];
    if(memberData) {
      memberData.userlist.map(mem => {
        temp.push(mem.id);
      })
    }
    setFilteredData(temp)
  },[memberData])

  useEffect(()=>{
    if(haveClientList) {
      setFilteredHaveNotClientData(haveClientList.havenot)
      setFilteredHaveClientData(haveClientList.have)
    }

  },[haveClientList])

  const searchUser = () => {
    let temp = [];
    memberData.userlist.map(mem => {
      if (mem.id.includes(user)) {
          temp.push(mem.id);
      }
    });
    setFilteredData(temp)
  }

  const searchHaveNotClient = () => {
    let temp = [];
    haveClientList.havenot.map(list => {
      if (list.client_name.includes(haveNotClient)) {
          temp.push(list);
      }
    })
    setFilteredHaveNotClientData(temp)
  }

  const searchHaveClient = () => {
    let temp = [];
    haveClientList.have.map(list => {
      if (list.client_name.includes(haveClient)) {
          temp.push(list);
      }
    })
    setFilteredHaveClientData(temp)
  }

  const handleHaveClientList = (id) => {
    if(id) {
      getHaveClientList(id)
      setId(id)
      setClientUid('')
    }
  }

  const handleAddClient = () => {
    addClient({id, uid:clientUid, type:'add'})
    setClientUid('')
  }

  const handleDeleteClient = () => {
    deleteClient({id, uid:clientUid, type:'del'})
    setClientUid('')
  }

  useEffect(()=>{
    if(!addClientLoading || !deleteClientLoading) {
      handleHaveClientList(id)
    }
  },[addClientLoading, deleteClientLoading])

  return (
    <>
          <Card className='member-card'>

            <Card.Body>

            <div className='mem-manage-table member-table'>
              <div className='header'>
                <p>User</p>
                <input type='text' className='form-control' value={user} onChange={(e) => setUser(e.target.value)} onKeyUp={() => searchUser()}placeholder='유저 검색'/>
              </div>
              <div className='body'>
              {isMobile &&
                <Toast
                  className="member-table-toast"
                  show={isOpenCustom1}
                  onClose={hideCustom1}
                  delay={2000}
                  autohide
                >
                  <Toast.Body>아래로 스크롤하세요</Toast.Body>
                </Toast>
              }
                  {loading ? <div className='mem-spinner-wrapper'><Spinner className='mem-spinner' size='sm' color='primary'></Spinner></div> :

                  <div>
                    {filteredData && filteredData.length > 0 ? filteredData.map((mem, index) => (
                      <div className={`item ${id === mem ? 'active' : ''}`} key={index} onClick={() => handleHaveClientList(mem)}><i className='ri-user-fill'></i><span>{mem}</span></div>
                    ))
                    : <div className='no-user'><img src={notFoundImg} alt='notFoundImg'/><div>검색 결과가 없습니다</div></div>}
                  </div>
                  }
              </div>
            </div>

            <div className='mem-manage-table have-not-client-table'>
              <div className='header'>
                <input type='text' className='form-control' value={haveNotClient} onChange={(e) => setHaveNotClient(e.target.value)} onKeyUp={() => searchHaveNotClient()} placeholder='전체 클라이언트 검색'/>
              </div>
              <div className='body'>
                  {haveClientLoading ? <div className='have-not-spinner-wrapper'><Spinner className='have-not-spinner' size='sm' color='primary'></Spinner></div> : 

                  <div>
                    {filteredHaveNotClientData && filteredHaveNotClientData.map((client, index) => (
                      <div className={`item ${clientUid === client.client_uid ? 'active' : ''}`} key={index} onClick={() => setClientUid(client.client_uid)}><i className='ri-user-fill'></i><span>{client.client_name}</span></div>
                    ))}
                  </div>
                  }
                  
              </div>
            </div>


            <div className='edit-btn-wrapper'>
              <Button onClick={() => handleAddClient()}>추가<i className='ri-arrow-right-s-fill'></i></Button>
              <Button onClick={() => handleDeleteClient()} variant='danger'><i className='ri-arrow-left-s-fill'></i>삭제</Button>
            </div>

            <div className='edit-btn-wrapper edit-btn-wrapper-m'>
              <Button onClick={() => handleAddClient()}>추가<i className='ri-arrow-down-s-fill'></i></Button>
              <Button onClick={() => handleDeleteClient()} variant='danger'><i className='ri-arrow-up-s-fill'></i>삭제</Button>
            </div>


            <div className='mem-manage-table have-client-table'>
              <div className='header'>
                <input type='text' className='form-control' value={haveClient} onChange={(e) => setHaveClient(e.target.value)} onKeyUp={() => searchHaveClient()} placeholder='보유 클라이언트 검색'/>
              </div>
              <div className='body'>
                  {haveClientLoading ? <div className='have-spinner-wrapper'><Spinner className='have-spinner' size='sm' color='primary'></Spinner></div> : 
                  
                  <div>
                    {filteredHaveClientData && filteredHaveClientData.map((client, index) => (
                      <div className={`item ${clientUid === client.client_uid ? 'active' : ''}`} key={index} onClick={() => setClientUid(client.client_uid)}><i className='ri-user-fill'></i><span>{client.client_name}</span></div>
                    ))}
                  </div>
                  }
              </div>
            </div>

            </Card.Body>

            
          </Card>


      
    </>
  );
};

export default MemberTable;
