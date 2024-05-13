import { useNotificationContext } from '@/common';
import { blog } from '@/common/api';
import { useState } from 'react';

export default function useBlogCounter() {

	const [ loading, setLoading ] = useState(false);
	const [ addDataLoading, setAddDataLoading ] = useState(false);
	const [ deleteDataLoading, setDeleteDataLoading ] = useState(false);
	const [ deleteAllDataLoading, setDeleteAllDataLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getCounterData = async (values) => {
		// console.log('1')
		
		const { page, rows } = values;
		setLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let data = await blog.cntList({
					page, rows
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					// console.log("블로그 카운터: ", data)
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


	const addCounterData = async (values) => {
		// console.log('2')

		const { url, refUrl, day, count } = values; 
		setAddDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let response = await blog.cntAdd({
					url, refUrl, day, count
				});
				// console.log("3", data)
				if (response) {
					// console.log("결과: ", response)
				} else {
					console.log("추가 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setAddDataLoading(false);
			}
		}
	}

	const deleteCounterData = async (values) => {
		// console.log('3')

		const { seq, type } = values; 
		
		if(type === 1) {
			setDeleteDataLoading(true)
		} else if(type === 0) {
			setDeleteAllDataLoading(true)
		}

		if( values ) {
			try {
				// console.log("2", values)
				let response = await blog.cntDelete({
					seq: seq,
					type: type
				});
				// console.log("3", data)
				if (response) {
					// console.log("결과: ", response)
				} else {
					console.log("추가 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setDeleteDataLoading(false);
				setDeleteAllDataLoading(false);
			}
		}
	}

	return { data, loading, addDataLoading, deleteDataLoading, deleteAllDataLoading, getCounterData, addCounterData, deleteCounterData, showNotification };
}
