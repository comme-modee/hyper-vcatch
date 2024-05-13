import { useNotificationContext } from '@/common';
import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function useGetClientList() {

	const [ loading, setLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getClientList = async ( username ) => {

		setLoading(true);
		
		try {
			// console.log("2", username)
			let data = await monitoring.clientList(username);
			// console.log("3", data)
			if (data) {
                setData(data)
				// console.log("4", data)
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log("여기")
			// showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, getClientList, showNotification };
}
