import HttpClient from '../helpers/httpClient';



function exportReport() {

  return {
    day_data: (values) => {
      console.log("day_data22", values)

      return new Promise(function (resolve, reject) {    
        
          try {
            HttpClient.post('/report/day_data', {
              client: values.client,
              daytime: values.daytime,
              startdate: values.startdate,
              enddate: values.enddate
            })
            .then(response => {
              console.log("response", response)
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

    total_data: (values) => {
      console.log("total_data", values)

      return new Promise(function (resolve, reject) { 
        
        try {
            HttpClient.post('/report/total_data', {
              client: values.client,
              daytime: values.daytime,
              month: values.month,
              year: values.year
            })
            .then(response => {
              console.log("response", response)
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

    // total_choice_data: (values) => {
    //   console.log("total_choice_data", values)

    //   return new Promise(function (resolve, reject) { 
        
    //     try {
    //         HttpClient.post('/report/day_data', {
    //           client: values.client,
    //           daytime: values.daytime,
    //           startdate: values.startDate,
    //           enddate: values.endDate
    //         })
    //         .then(response => {
    //           console.log("response", response)
    //           resolve(response);
              
    //           // resolve([200, users]);
    //         })
    //         .catch(error => {
    //           console.error(error, "1");
    //           reject(error);
    //         });
    //       } catch (error) {
    //         console.error('오류 발생:', error);
    //       }

    //   });
    // }

  };
}

export default exportReport();
