import HttpClient from '../helpers/httpClient';


function Monitoring() {

  return {
    keywordWeek: (data) => {
      // console.log("keywordWeek", data)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/keyword/all', {
                client: data.client,
                keyword: data.keyword,
                platform: data.platform,
                page: data.page,
                day: data.day,
                rows: data.rows
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

    keyword24hour: (data) => {
      // console.log("keyword24hour", data)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/keyword/all24', {
                client: data.client,
                keyword: data.keyword,
                platform: data.platform,
                page: data.page,
                day: data.day,
                rows: data.rows
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

    keywordMonth: (data) => {
      // console.log("keywordMonth", data)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/keyword/keyword_month', {
                client: data.client,
                keyword: data.keyword,
                platform: data.platform,
                page: data.page,
                month: data.month,
                year: data.year,
                type: data.type,
                rows: data.rows,
                id: data.id
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

    clientList: (username) => {
      // console.log("client", username)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/keyword/client_list', {
                client: "",
                id: username
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

    platformList: () => {

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/keyword/platform_list', {})
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


    // 클라이언트 목록 관리
    client: (values) => {
      // console.log('client: ', values)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.get('/client/client', {
              params: {
                page: values.page,
                rows: values.rows,
                client: values.client
              }
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

    addClient: (values) => {
      // console.log('add client: ', values)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/client/client', {
              client_name: values.client_name,
              client_memo: values.client_memo
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

    deleteClient: (seq) => {
      // console.log("delete client: ", seq)

      return new Promise(function (resolve, reject) { 
        
        HttpClient.delete('/client/client/'+seq, {})
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });

      });
    },


    editClient: (values) => {
      // console.log("edit client: ", values)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.put('/client/client', {
              client_uid: values.client_uid,
              client_name: values.client_name,
              client_memo: values.client_memo
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


    // 키워드 목록 관리
    keyword: (values) => {
      // console.log('keyword: ', values)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.get('/keyword/keyword', {
              params: {
                page: values.page,
                rows: values.rows,
                client_uid: values.client,
                platform: values.platform,
                keyword: values.keyword,
              }
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

    singleKeyword: (seq) => {
      // console.log('single keyword: ', seq)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.get('/keyword/keyword/'+seq, {})
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

    addKeyword: (values) => {
      // console.log('add keyword: ', values)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/keyword/keyword', {
              platform: values.platform,
              keyword: values.keyword,
              url: values.url,
              goalrank: values.goalrank,
              client_uid: values.client_uid,
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

    deleteKeyword: (seq) => {
      // console.log("delete keyword: ", seq)

      return new Promise(function (resolve, reject) { 
        
        HttpClient.delete('/keyword/keyword/'+seq, {})
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });

      });
    },

    editKeyword: (values) => {
      // console.log("edit keyword: ", values)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.put('/keyword/keyword', {
                seq: values.seq,
                platform: values.platform,
                keyword: values.keyword,
                url: values.url,
                goalrank: values.goalrank,
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

    sortData: (seqlist) => {

      // console.log('2', seqlist)

      return new Promise(function (resolve, reject) { 
        
        try {
          HttpClient.put('/keyword/sort', {
              seqlist: seqlist
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
    }
  };
}

export default Monitoring();
