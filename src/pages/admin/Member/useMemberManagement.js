import { useNotificationContext } from '@/common';
import { admin } from '@/common/api';
import { useState } from 'react';

export default function useClientManagement() {

	const [ loading, setLoading ] = useState(false);
	const [ haveClientLoading, setHaveClientLoading ] = useState(false);
	const [ addClientLoading, setAddClientLoading ] = useState(false);
	const [ deleteClientLoading, setDeleteClientLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const [ haveClientList, setHaveClientList ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getMemberData = async () => {
		
		setLoading(true);
		try {
			let data = await admin.memberList();
			if (data) {
				setData(data)
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log(error)
			// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	const getHaveClientList = async (id) => {
		
		setHaveClientLoading(true);
		try {
			let data = await admin.haveClientList(id);
			if (data) {
				setHaveClientList(data)
				// console.log(data)
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log(error)
			// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
		} finally {
			setHaveClientLoading(false);
		}
	};

	const addClient = async (values) => {

		const { id, uid, type } = values;
		
		setAddClientLoading(true);
		try {
			let res = await admin.addClient({
				id,
				uid: uid.toString(),
				type
			});
			if (res) {
				// console.log(res)
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log(error)
			// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
		} finally {
			setAddClientLoading(false);
		}
	};

	const deleteClient = async (values) => {

		const { id, uid, type } = values;
		
		setDeleteClientLoading(true);
		try {
			let res = await admin.deleteClient({
				id,
				uid: uid.toString(),
				type
			});
			if (res) {
				// console.log(res)
			} else {
				console.log("데이터없음")
			}
		} catch (error) {
			console.log(error)
			// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
		} finally {
			setDeleteClientLoading(false);
		}
	};
    


	return { data, haveClientList, loading, haveClientLoading, addClientLoading, deleteClientLoading, getMemberData, getHaveClientList, addClient, deleteClient, showNotification };
}
