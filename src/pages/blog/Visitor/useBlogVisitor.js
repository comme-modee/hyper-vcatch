import { useNotificationContext } from '@/common';
import { blog } from '@/common/api';
import { useState } from 'react';

export default function useBlogVisitor() {

	const [ loading, setLoading ] = useState(false);
	const [ addDataLoading, setAddDataLoading ] = useState(false);
	const [ deleteDataLoading, setdeleteDataLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const [ memoData, setMemoData ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getVisitorData = async (values) => {
		// console.log('1')
		
		const { page, rows } = values;
		setLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let data = await blog.visitorList({
					page: page,
					rows: rows
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					// console.log("블로그 방문자: ", data)
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

	const getMemoData = async (value) => {
		// console.log('4')
		
		const seq = value;
		setLoading(true);

		if( seq ) {
			try {
				// console.log("2", values)
				let data = await blog.visitorMemo({
					seq: seq
				});
				// console.log("3", data)
				if (data) {
					setMemoData(data)
					// console.log("MEMO 데이터: ", data)
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

	const putVisitorData = async (values) => {
		// console.log('2')

		const { keyword, amount } = values; 
		setAddDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let response = await blog.visitorAdd({
					keyword: keyword,
					amount: amount
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

	const deleteVisitorData = async (values) => {
		// console.log('3')

		const { seq, type } = values; 
		setdeleteDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let response = await blog.visitorDelete({
					seq: seq,
					type: type
				});
				// console.log("3", data)
				if (response) {
					// console.log("결과: ", response)
				} else {
					console.log("삭제 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setdeleteDataLoading(false);
			}
		}
	}

	return { data, memoData, loading, addDataLoading, deleteDataLoading, getVisitorData, putVisitorData, deleteVisitorData, getMemoData, showNotification };
}
