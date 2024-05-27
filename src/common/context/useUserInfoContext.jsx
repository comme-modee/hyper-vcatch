import { createContext, useContext, useState, useCallback } from 'react';

const UserInfoContext = createContext({});

export function useUserInfoContext() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfoContext must be used within an UserInfoProvider');
  }
  return context;
}

export function UserInfoProvider({ children }) {
  const [ userInfo, setUserInfo ] = useState(
    localStorage.getItem('userInfo')
    ? localStorage.getItem('userInfo') || '{}'
    : undefined
  );

  const [ clientUid, setClientUid ] = useState('');
  const [ clientName, setClientName ] = useState('');
  // console.log(clientUid)
  const saveUserInfo = useCallback(
    (userInfo) => {
      setUserInfo(userInfo);
    },
    [setUserInfo]
  );

  const removeUserInfo = useCallback(() => {
    localStorage.removeItem('userInfo');
    setUserInfo(undefined);
    
  }, [setUserInfo]);

  // console.log("uid-------------------", clientUid)
  const saveClientUid = useCallback(
    (clientUid) => {
      setClientUid(clientUid);
    },
    [setClientUid]
  );

  const saveClientName = useCallback(
    (clientName) => {
      setClientName(clientName);
    },
    [setClientName]
  );

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        clientUid,
        clientName,
        saveUserInfo,
        removeUserInfo,
        saveClientUid,
        saveClientName
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
