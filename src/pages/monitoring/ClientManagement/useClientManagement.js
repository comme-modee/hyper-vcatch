import { useNotificationContext } from '@/common';
import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function useClientManagement() {

	const [ loading, setLoading ] = useState(false);
	const [ addDataLoading, setAddDataLoading ] = useState(false);
	const [ deleteDataLoading, setDeleteDataLoading ] = useState(false);
	const [ editDataLoading, setEditDataLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getClientData = async (values) => {
		// console.log('1', values)
		
		const { page, rows, client } = values;
		setLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let data = await monitoring.client({
					page,
					rows,
                    client
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					// console.log("클라이언트 목록: ", data)
				} else {
					console.log("데이터없음")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setLoading(false);
			}
		}
	};

    const addClientData = async (values) => {
		// console.log('2', values)

        const { clientName, clientMemo } = values;
		setAddDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let res = await monitoring.addClient({
					client_name: clientName,
					client_memo: clientMemo,
				});
				// console.log("3", data)
				if (res) {
					// console.log("클라이언트 추가: ", res)
                    showNotification({ message: '클라이언트 생성이 완료되었습니다.', type: 'success' });
					setAddDataLoading(false);
				} else {
					showNotification({ message: '이미 존재하는 클라이언트명입니다.', type: 'error' });
					console.log("클라이언트 추가 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} 
		}
		
	};

	const deleteClientData = async (seq) => {
		// console.log('3', seq)

		setDeleteDataLoading(true);

		if( seq ) {
			try {
				console.log("2", seq)
				
                let response = await monitoring.deleteClient(seq);
				// console.log("3", data)
				if (response) {
					// console.log("결과: ", response)
                    showNotification({ message: '클라이언트 삭제가 완료되었습니다.', type: 'success' });
				} else {
					console.log("삭제 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setDeleteDataLoading(false);
			}
		}
	};

    const editClientData = async (values) => {
		// console.log('4', values)

		setEditDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let response = await monitoring.editClient({
					client_uid: values.seq,
					client_name: values.client,
					client_memo: values.memo,
				});
				// console.log("3", data)
				if (response) {
					// console.log("결과: ", response)
                    showNotification({ message: '수정이 완료되었습니다.', type: 'success' });
				} else {
					console.log("수정 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setEditDataLoading(false);
			}
		}
    }

	return { data, loading, addDataLoading, editDataLoading, deleteDataLoading, getClientData, addClientData, deleteClientData, editClientData, showNotification };
}
