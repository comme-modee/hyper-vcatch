import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

export let users = [
	{
		role: '',
		phone: '',
		email: '',
		token: '',
		username: '',
	}
];

export default function configureFakeBackend() {
	mock.onPost('/login/').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				let params = JSON.parse(config.data);

				console.log("유저가 로그인 시도한 정보: ", params)
				

				const apiUrl = 'http://211.252.30.69:8080/api/auth/login';


				try {
					fetch(apiUrl, {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json',
						},
						body: JSON.stringify({username: params.username, password: params.password}),
					})
					.then(response => {
						if (response.ok) {
							data=response.json(); 
						} else {
							console.log("로그인실패")
							throw new Error(response.statusText);
						}
					})
					.then(data => {
						users = [
							{
								role: data.role,
								phone: data.phone,
								email: data.email,
								token: data.token,
								username: data.username,
							}
						];
						console.log('users:', users);
						localStorage.setItem('jwtToken',data.token); 
						resolve([200, users[0]]);
					})
					.catch(error => {
						console.error(error);
						reject("아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.");
					});
				} catch (error) {
					console.error('오류 발생:', error);
				}




				// find if any user matches login credentials
				// let filteredUsers = users.filter((user) => {
				// 	return user.userid === params.userid && user.password === params.password;
				// });
				// if (filteredUsers.length) {
				// 	// if login details are valid return user details and fake jwt token
				// 	let user = filteredUsers[0];
				// 	resolve([200, user]);
				// } else {
				// 	// else return error
				// 	resolve([401, { message: 'Email or Password is incorrect' }]);
				// }
			}, 500);
		});
	});

	mock.onPost('/register/').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				let params = JSON.parse(config.data);
				
				console.log("유저가 입력한 정보", params)
				
				const apiUrl = 'http://211.252.30.69:8080/api/join';
				
				
				try {
					fetch(apiUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username: params.username,
							password: params.password,
							phone: params.phone,
							email: params.email
						}),
					})
					.then(response => {
						if (response.ok) {
							return response.json(); 
						} else {
							throw new Error(response.statusText);
						}
					})
					.then(data => {
						if(data) {
							console.log("가입:", data)
							resolve([200]);
						} else {
							console.log("가입:", data)
							reject("동일한 아이디가 존재합니다. 다른 아이디를 입력해주세요.");
						}
					})
				} catch (error) {
					console.error('오류 발생:', error);
				}
			}, 500);
		});
	});

	mock.onPost('/forget-password/').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				let params = JSON.parse(config.data);

				// find if any user matches login credentials
				let filteredUsers = users.filter((user) => {
					return user.email === params.email;
				});

				if (filteredUsers.length) {
					// if login details are valid return user details and fake jwt token
					let responseJson = {
						message:
							"We've sent you a link to reset password to your registered email.",
					};
					resolve([200, responseJson]);
				} else {
					// else return error
					resolve([
						401,
						{
							message:
								'Sorry, we could not find any registered user with entered email',
						},
					]);
				}
			}, 1000);
		});
	});
}
