import HttpClient from '../helpers/httpClient';



function Monitoring() {

  return {
    keywordWeek: (data) => {
      console.log("keywordWeek", data)

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

    keyword24hour: (data) => {
      console.log("keyword24hour", data)

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

    keywordMonth: (data) => {
      console.log("keywordMonth", data)

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

    clientList: (username) => {
      // console.log("client", username)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/keyword/client_list', {
                client: "",
                id: username
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

    platformList: () => {

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/keyword/platform_list', {})
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
    }

  };
}

export default Monitoring();
