import { useNotificationContext } from '@/common';
import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function useKeywordManagement() {

	const [ loading, setLoading ] = useState(false);
	const [ singleDataLoading, setSingleDataLoading ] = useState(false);
	const [ addDataLoading, setAddDataLoading ] = useState(false);
	const [ deleteDataLoading, setDeleteDataLoading ] = useState(false);
	const [ editDataLoading, setEditDataLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const [ singleData, setSingleData ] = useState('');
	const { showNotification } = useNotificationContext();
	

	const getKeywordData = async (values) => {
		// console.log('1', values)
		
		const { page, rows, client, platform, keyword } = values;
		setLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let data = await monitoring.keyword({
					page,
					rows,
                    client,
					platform,
					keyword
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					// console.log("키워드 목록: ", data)
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

	const getSingleKeywordData = async (seq) => {
		// console.log('5', seq)
		
		setSingleDataLoading(true);

		if( seq ) {
			try {
				// console.log("2", values)
				let data = await monitoring.singleKeyword(seq);
				// console.log("3", data)
				if (data) {
					setSingleData(data)
					// console.log("키워드 목록: ", data)
				} else {
					console.log("데이터없음")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setSingleDataLoading(false);
			}
		}
	};

    const addKeywordData = async (values) => {
		// console.log('2', values)

        const { platform, client, keyword, url, goal } = values;

		setAddDataLoading(true);

		if( values ) {
			try {
				// console.log("2", values)
				let res = await monitoring.addKeyword({
					platform,
					keyword,
					url,
					goalrank: goal,
					client_uid: client,
				});
				// console.log("3", data)
				if (res) {
					// console.log("키워드 추가: ", res)
                    showNotification({ message: '키워드 추가가 완료되었습니다.', type: 'success' });
				} else {
					console.log("키워드 추가 실패")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setAddDataLoading(false);
			}
		}
		
	};

	const deleteKeywordData = async (seq) => {
		// console.log('3', seq)

		setDeleteDataLoading(true);

		if( seq ) {
			try {
                let response = await monitoring.deleteKeyword(seq);
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

    const editKeywordData = async (values) => {
		// console.log('4', values)

		const { seq, platform, keyword, url, goalrank } = values;

		setEditDataLoading(true);

		if( values ) {
			try {
				let response = await monitoring.editKeyword({
					seq: seq.toString(),
					platform,
					keyword,
					url,
					goalrank
				});
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

	return { data, singleData, loading, singleDataLoading, addDataLoading, editDataLoading, deleteDataLoading, getKeywordData, getSingleKeywordData, addKeywordData, deleteKeywordData, editKeywordData, showNotification };
}
