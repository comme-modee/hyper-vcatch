import HttpClient from '../helpers/httpClient';


function Blog() {

  return {

    //블로그 방문자

    visitorList: (value) => {
      // console.log("visitor_list", value)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/helper/visitor_list', {
                page: value.page,
                rows: value.rows
            })
            .then(response => {
              // console.log("1", response)
              resolve(response);
              
              // resolve([200, users]);
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

    visitorMemo: (value) => {
      // console.log("visitor_stats", value)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.post('/helper/visitor_stats', {
                seq: value.seq,
            })
            .then(response => {
              // console.log("1", response)
              resolve(response);
              
              // resolve([200, users]);
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

    visitorAdd: (value) => {
      // console.log("visitor_add", value)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.put('/helper/visitor_add', {
                keyword: value.keyword,
                amount: value.amount
            })
            .then(response => {
              // console.log("1", response)
              resolve(response);
              
              // resolve([200, users]);
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

    visitorDelete: (value) => {
      // console.log("visitor_del", value)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.delete('/helper/visitor_del', {
                data: {
                  seq: value.seq,
                  type: value.type
                }
            })
            .then(response => {
              // console.log("1", response)
              resolve(response);
              
              // resolve([200, users]);
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

    

    //블로그 카운터

    cntList: (value) => {
      // console.log("cnt_list", value);
    
      return new Promise(function (resolve, reject) { 
        try {
          HttpClient.get('/helper/blog_cnt', {
            params: {
              page: value.page,
              rows: value.rows
            }
          })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
        } catch (error) {
          console.error('오류 발생:', error);
        }
      }); 
    },

    cntAdd: (value) => {
      // console.log("add_cnt", value);
    
      return new Promise(function (resolve, reject) { 
        try {
          HttpClient.post('/helper/blog_cnt', {
              url: value.url,
              ref_url: value.refUrl,
              day: value.day,
              count: value.count
          })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
        } catch (error) {
          console.error('오류 발생:', error);
        }
      }); 
    },

    cntDelete: (value) => {
      // console.log("del_cnt", value)

      return new Promise(function (resolve, reject) { 
        
          try {
            HttpClient.delete('/helper/blog_cnt', {
                data: {
                  seq: value.seq,
                  type: value.type
                }
            })
            .then(response => {
              // console.log("1", response)
              resolve(response);
              
              // resolve([200, users]);
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

export default Blog();
