import HttpClient from '../helpers/httpClient';


function Admin() {

  return {

    //클라이언트 권한 관리

    memberList: () => {

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.get('/admin/member')
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              console.error(error, "1");
              reject(error);
            });
          } catch (error) {
            console.error('오류 발생:', error);
          }

      }); 
    },

    haveClientList: (id) => {

      // console.log('haveClientList: ', id)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.get('/admin/client/' + id)
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              console.error(error, "1");
              reject(error);
            });
          } catch (error) {
            console.error('오류 발생:', error);
          }

      }); 
    },

    addClient: (values) => {

      // console.log('addClient: ', values)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/admin/member', {
              id: values.id,
              uid: values.uid,
              type: values.type,
            })
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              console.error(error, "1");
              reject(error);
            });
          } catch (error) {
            console.error('오류 발생:', error);
          }

      }); 
    },

    deleteClient: (values) => {

      // console.log('deleteClient: ', values)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/admin/member', {
              id: values.id,
              uid: values.uid,
              type: values.type,
            })
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              console.error(error, "1");
              reject(error);
            });
          } catch (error) {
            console.error('오류 발생:', error);
          }

      }); 
    },

  };
}

export default Admin();
