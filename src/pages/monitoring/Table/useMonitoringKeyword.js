import { useNotificationContext } from '@/common';
import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function useMonitoringKeyword(type) {

	const [ loading, setLoading ] = useState(false);
	const [ data, setData ] = useState('');
	const { showNotification } = useNotificationContext();
	
	// console.log(type)
	const searchKeyword = async (values) => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const { editedSelectedDate, clientUid, platform, keyword, rows, currentPage, selectedMonth, selectedYear, dataType } = values;

		setLoading(true);
		
		if( type === 'week') {
			try {
				// console.log("2", values)
				let data = await monitoring.keywordWeek({
					client: clientUid,
					keyword: keyword,
					platform: platform,
					page: currentPage,
					day: editedSelectedDate,
					rows: rows
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					console.log("주간 데이터: ", data)
				} else {
					console.log("데이터없음")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: '데이터를 불러오지 못했습니다. 새로고침해주세요.', type: 'error' });
			} finally {
				setLoading(false);
			}
		} else if ( type === '24hour') {
			try {
				// console.log("2", values)
				let data = await monitoring.keyword24hour({
					client: clientUid,
					keyword: keyword,
					platform: platform,
					page: currentPage,
					day: editedSelectedDate,
					rows: rows
				});
				// console.log("3", data)
				if (data) {
					setData(data)
					console.log("24시간 데이터: ", data)
				} else {
					console.log("데이터없음")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: error.toString(), type: 'error' });
			} finally {
				setLoading(false);
			}
		} else if ( type === 'month' ) {
			try {
				// console.log("2", values)
				let data = await monitoring.keywordMonth({
					client: clientUid,
					keyword: keyword,
					platform: platform,
					page: currentPage,
					month: selectedMonth.toString(),
					year: selectedYear.toString(),
					type: dataType,
					rows: rows,
					id: userInfo.username
				});
				// console.log("3", data)
				if (data) {
					console.log("월간 데이터: ", data)
					setData(data)
				} else {
					console.log("데이터없음")
				}
			} catch (error) {
				console.log(error)
				// showNotification({ message: error.toString(), type: 'error' });
			} finally {
				setLoading(false);
			}
		}		
		
	};

	return { data, loading, searchKeyword, showNotification };
}
