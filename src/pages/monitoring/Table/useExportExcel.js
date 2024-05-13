import { HttpClient, useNotificationContext } from '@/common';
import { exportReport } from '@/common/api'
import { useState } from 'react';
import * as XLSX from 'xlsx-js-style'

export default function useExportExcel() {

    const [ weekReportLoading, setWeekReportLoading ] = useState(false);
    const [ hourReportLoading, sethourReportLoading ] = useState(false);
    const { showNotification } = useNotificationContext();
	
	const handleOnExport = async ( values ) => {
        
        const { reportType, client, clientName, daytime, currentWeek, selectedWeek, startDate, endDate, month, year } = values;
        console.log(values)
        daytime === 1 ? setWeekReportLoading(true) : sethourReportLoading(true)
        let data = '';

        try {
            if( reportType === '현재 주간' ) {
                data = await exportReport.day_data({
                    client: client,
                    daytime: daytime,
                    startdate: currentWeek,
                    enddate: ''
                });
            } else if ( reportType === '주간 선택' ) {
                data = await exportReport.day_data({
                    client: client,
                    daytime: daytime,
                    startdate: selectedWeek,
                    enddate: ''
				});
            } else if ( reportType === '월간' ) {
                data = await exportReport.total_data({
                    client: client,
                    daytime: daytime,
                    month: month,
                    year: year,
				});
            } else if ( reportType === '날짜 선택' ) {
                data = await exportReport.day_data({
                    client: client,
                    daytime: daytime,
                    startdate: startDate,
                    enddate: endDate,
				});
            }
            if (data) {
                // console.log("데이터: ", data)
                showNotification({ message: '보고서 출력을 완료하였습니다. 다운로드함을 확인해주세요.', type: 'success' })
            } else {
                console.log("데이터없음")
            }
        } catch (error) {
            console.log(error)
            // showNotification({ message: error.toString(), type: 'error' });
        } finally {
            setWeekReportLoading(false);
            sethourReportLoading(false);
        }

        
        let sortedData = {};
        if(reportType === '현재 주간' || reportType === '주간 선택' || reportType === '날짜 선택') {
            //데이터 순서 편집 (list를 제일 처음으로, 나머지 데이터들은 날짜 기준 오름차순으로 정렬)
            sortedData = { "list": data["list"]};
            const dailyKeys = Object.keys(data).filter(key => key.startsWith("daily"));
            dailyKeys.sort((a, b) => new Date(a.split('_')[1]) - new Date(b.split('_')[1]));
            const sortedDailyData = dailyKeys.reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {});
            sortedData = { ...sortedData, ...sortedDailyData };
        } else if(reportType === '월간') {
            sortedData = data;
        }

        // 새로운 workbook 생성
        const wb = XLSX.utils.book_new();

        // 헤더 데이터 준비
        let commonHeaderStyle = { 
            font: { name: '맑은 고딕', bold: true, sz: '10', color: { rgb: '222222' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
        let titleHeaderStyle = { 
            font: { name: '맑은 고딕', bold: true, sz: '18', color: { rgb: '222222' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
        let subTitleHeaderStyle = { 
            font: { name: '맑은 고딕', bold: true, sz: '12', color: { rgb: '222222' } },
            alignment: { horizontal: 'right', vertical: 'center' }
        };
        let blueHeaderStyle = {
            ...commonHeaderStyle,
            fill: { fgColor: { rgb: 'c3d4ff' }, patternType: 'solid' }
        }
        let pinkHeaderStyle = {
            ...commonHeaderStyle,
            fill: { fgColor: { rgb: 'ffded4' }, patternType: 'solid' }
        }
        let yellowHeaderStyle = {
            ...commonHeaderStyle,
            fill: { fgColor: { rgb: 'FFC75A' }, patternType: 'solid' }
        }
        let grayHeaderStyle = {
            ...commonHeaderStyle,
            fill: { fgColor: { rgb: 'f3f3f3' }, patternType: 'solid' }
        }


        const header_daily_hours = [];
        if(daytime === 1) { //주간 보고서
            for(let i = 9; i<=17; i++) {
                if(i !== 12) header_daily_hours.push(i)
            }
        } else if(daytime === 2) { //24시간 보고서
            for(let i = 0; i<=23; i++) {
                header_daily_hours.push(i)
            }
        }

        const header_daily_value = [ 'No', '구분', '키워드', ...header_daily_hours.map(hour => `${hour}시`), '노출률', '컨텐츠URL', '비고' ];

        const header_daily = header_daily_value.map(value => {
            if (value === 'No' || value === '구분' || value === '키워드') {
                return { v: value, t: "s", s: blueHeaderStyle };
            } else if (value.endsWith('시')) {
                return { v: value, t: "s", s: pinkHeaderStyle };
            } else if (value === '노출률' || value === '컨텐츠URL'){
                return { v: value, t: "s", s: yellowHeaderStyle };
            } else {
                return { v: value, t: "s", s: grayHeaderStyle };
            }
        });

        const borderStyle = {
            border: {
                top: { style: 'thin', color: { rgb: "bec1c5" } },
                bottom: { style: 'thin', color: { rgb: "bec1c5" } },
                left: { style: 'thin', color: { rgb: "bec1c5" } },
                right: { style: 'thin', color: { rgb: "bec1c5" } }
            }
        };

       

        // 바디 데이터 준비
        function createBodyStyle(color) {
            return {
                font: { name: '맑은 고딕', sz: '10', color: { rgb: color } },
                alignment: { horizontal: 'center', vertical: 'center' }
            };
        }
        const bodyStyle = createBodyStyle('222222');
        const redFontStyle = createBodyStyle('ff0000');
        const blueFontStyle = createBodyStyle('0000ff');
        const orangeFontStyle = createBodyStyle('ffa500');
        

        // sortedData의 키 값들을 가져옴
        let keys = Object.keys(sortedData);
        let keysOfDailyData = [];
        let days = [];
        let subTitle = '';
        let title = '';
        if(reportType === '현재 주간' || reportType === '주간 선택' || reportType === '날짜 선택') {
            keysOfDailyData = keys.filter(key => key !== "list").map(key => key.replace('daily_', ''));
            //서브타이틀 세팅 (날짜 ~ 날짜)
            const startDateOfSubtitle = keysOfDailyData[0].substring(2);
            const endDateOfSubtitle = keysOfDailyData[keysOfDailyData.length-1].substring(2);
            subTitle = `${startDateOfSubtitle} ~ ${endDateOfSubtitle}`
            //타이틀 세팅
            title = clientName + ` ${parseInt(startDateOfSubtitle.split('-')[1])}월` + ' 모니터링 보고';
        } else if(reportType === '월간') {
            if(month === '02') {
                for(let i = 1; i<=29; i++) { days.push(i) }
            } else if(['04', '06', '09', '11'].includes(month)) {
                for(let i = 1; i<=30; i++) { days.push(i) }
            } else {
                for(let i = 1; i<=31; i++) { days.push(i) }
            }
            console.log(month, days)
            keysOfDailyData = days;
            subTitle = `${year}년 ${parseInt(month, 10)}월`;
            title = clientName + ` ${parseInt(month, 10)}월` + ' 모니터링 보고';
        }
        console.log(subTitle, title)
        
        const setNumber = (value) => {
            return value.toString().padStart(2, '0');
        }        
        
        

        // 각 키 값에 대해 처리
        keys.forEach(key => {
            
            const dailyData = sortedData[key];

            if ( key === 'list' ) {

                const header_total = [
                    { v: "No", t: "s", s: blueHeaderStyle },
                    { v: "구분", t: "s", s: blueHeaderStyle },
                    { v: "키워드", t: "s", s: blueHeaderStyle },
                    ...keysOfDailyData.map(key => ({ v: reportType === '월간' ? key + '일': parseInt(key.split("-")[2], 10) + '일', t: "s", s: pinkHeaderStyle })),
                    ...(reportType !== '월간' ? [{ v: "주간 노출률", t: "s", s: yellowHeaderStyle }] : []),
                    { v: "컨텐츠URL", t: "s", s: yellowHeaderStyle },
                    { v: "비고", t: "s", s: grayHeaderStyle }
                ];

                // 데이터로 worksheet 생성
                const ws = XLSX.utils.aoa_to_sheet([]);

                // 헤더 타이틀 행 추가
                const headerTitleRow = [];
                for (let i = 0; i < header_total.length; i++) {
                    headerTitleRow.push({ v: title, t: "s", s: titleHeaderStyle });
                }
                XLSX.utils.sheet_add_aoa(ws, [headerTitleRow], {origin: { r: 1, c: 1 }});

                // 헤더 서브타이틀 행 추가
                const headerSubtitleRow = [];
                for (let i = 0; i < header_total.length; i++) {
                    headerSubtitleRow.push({ v: subTitle, t: "s", s: subTitleHeaderStyle });
                }
                XLSX.utils.sheet_add_aoa(ws, [headerSubtitleRow], {origin: { r: -1, c: 1 }});

                // 셀 병합
                const merge = [
                    { s: { r: 1, c: 1 }, e: { r: 1, c: header_total.length } },{ s: { r: 2, c: 1 }, e: { r: 2, c: header_total.length } },
                ];
                ws["!merges"] = merge;

                XLSX.utils.sheet_add_aoa(ws, [header_total], {origin: { r: -1, c: 1 }});
    
                // 데이터 추가
                dailyData.forEach((data, dataIdx) => {
                    let row = [];
                    if(reportType === '현재 주간' || reportType === '주간 선택' || reportType === '날짜 선택') {
                        row = [
                            { v: dataIdx + 1, t: "s", s: bodyStyle }, // 번호
                            { v: data.info_platform, t: "s", s: bodyStyle }, // 구분
                            { v: data.info_keyword, t: "s", s: bodyStyle }, // 키워드
                            ...keysOfDailyData.map(key => {
                                const cellValue = data[key] === 0 || data[key] === undefined ? '-' : data[key].toFixed(1) + '%';
                                const cellStyle = data[key] === 0 || data[key] === undefined ? redFontStyle :
                                                    data[key] === 100 ? blueFontStyle : orangeFontStyle;
                                return { v: cellValue, t: "s", s: cellStyle };
                            }),
                            { v: data.rate === 0 || data.rate === undefined ? '-' : data.rate.toFixed(1) + '%', t: "s", s: data.rate === 100 ? blueFontStyle : data.rate === 0 || data.rate === undefined ? redFontStyle : orangeFontStyle },
                            { v: data.info_url, t: "s", s: bodyStyle }, // 타이틀
                            { v: '', t: "s", s: bodyStyle } // 비고
                        ];                        
                    } else if(reportType === '월간') {
                        row = [
                            { v: dataIdx + 1, t: "s", s: bodyStyle }, // 번호
                            { v: data.info_platform, t: "s", s: bodyStyle }, // 구분
                            { v: data.info_keyword, t: "s", s: bodyStyle }, // 키워드
                            ...keysOfDailyData.map(key => {
                                const cellValue = data[`d${key}`] === 0 || data[`d${key}`] === undefined ? '-' : data[`d${key}`].toFixed(1) + '%';
                                const cellStyle = data[`d${key}`] === 0 || data[`d${key}`] === undefined ? redFontStyle :
                                                    data[`d${key}`] === 100 ? blueFontStyle : orangeFontStyle;
                                return { v: cellValue, t: "s", s: cellStyle };
                            }),
                            // { v: data.rate === 0 || data.rate === undefined ? '-' : data.rate + '%', t: "s", s: data.rate === 100 ? blueFontStyle : data.rate === 0 || data.rate === undefined ? redFontStyle : orangeFontStyle },
                            { v: data.info_url, t: "s", s: bodyStyle }, // 타이틀
                            { v: '', t: "s", s: bodyStyle } // 비고
                        ];   
                    }


                    XLSX.utils.sheet_add_aoa(ws, [row], {origin: { r: -1, c: 1 }});
                });

                // worksheet에 행의 높이와 열의 너비 설정
                let columnWidths;

                if (reportType === '월간') {
                    columnWidths = [30, 30, 100, 150, ...keysOfDailyData.map(() => 40), 100, 100];
                } else {
                    columnWidths = [30, 30, 100, 150, ...keysOfDailyData.map(() => 40), 70, 100, 100];
                }
                ws['!cols'] = columnWidths.map(width => ({ wpx: width }));

                const rowsArray = Array.from({ length: dailyData.length + 4 }, () => ({ hpx: 22 }));
                rowsArray[1].hpx = 60;
                rowsArray[2].hpx = 30;
                ws['!rows'] = rowsArray;

                const range = XLSX.utils.decode_range(ws['!ref']);

                for (let row = range.s.r; row <= range.e.r; row++) {
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = { r: row, c: col };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        const cell = ws[cellRef];
                        if (cell) {
                            const mergedStyle = { ...cell.s, ...borderStyle };
                            cell.s = mergedStyle;
                        }
                    }
                }

                //worksheet 제목 편집
                let monthForEditedKey = '';
                let editedKey = '';

                if(reportType === '현재 주간' || reportType === '주간 선택' || reportType === '날짜 선택') {
                    monthForEditedKey = keysOfDailyData[0].split('-')[1];
                    editedKey = `${parseInt(monthForEditedKey, 10)}월 소계`
                } else if(reportType === '월간') {
                    editedKey = `${parseInt(month, 10)}월 소계`
                }

                // workbook에 worksheet 추가
                XLSX.utils.book_append_sheet(wb, ws, editedKey);

            } else if( key !== 'list' ) {

                // 데이터로 worksheet 생성
                const ws = XLSX.utils.aoa_to_sheet([]);

                // 헤더 타이틀 행 추가
                const headerTitleRow = [];
                for (let i = 0; i < header_daily.length; i++) {
                    headerTitleRow.push({ v: '상위노출 일일 모니터링 현황', t: "s", s: titleHeaderStyle });
                }
                XLSX.utils.sheet_add_aoa(ws, [headerTitleRow], {origin: { r: 1, c: 1 }});

                //worksheet 이름 & 서브타이틀
                const [year, month, day] = key.split('-');
                const editedKey = `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;

                // 헤더 서브타이틀 행 추가
                const headerSubtitleRow = [];
                for (let i = 0; i < header_daily.length; i++) {
                    headerSubtitleRow.push({ v: editedKey, t: "s", s: subTitleHeaderStyle });
                }
                XLSX.utils.sheet_add_aoa(ws, [headerSubtitleRow], {origin: { r: -1, c: 1 }});

                // 셀 병합
                const merge = [
                    { s: { r: 1, c: 1 }, e: { r: 1, c: header_daily.length } },{ s: { r: 2, c: 1 }, e: { r: 2, c: header_daily.length } },
                ];
                ws["!merges"] = merge;

                XLSX.utils.sheet_add_aoa(ws, [header_daily], {origin: { r: -1, c: 1 }});
    
                // 데이터 추가
                dailyData.forEach((data, dataIdx) => {
                    const row = [
                            { v: dataIdx + 1, t: "s", s: bodyStyle }, // 번호
                            { v: data.info_platform, t: "s", s: bodyStyle }, // 구분
                            { v: data.info_keyword, t: "s", s: bodyStyle }, // 키워드
                            ...header_daily_hours.map(time => {
                                const cellValue = data[`h${setNumber(time)}`] === 0 ? '-' : data[`h${setNumber(time)}`]
                                const cellStyle = data[`h${setNumber(time)}`] <= data.info_goalrank && data[`h${setNumber(time)}`] > 0 ? blueFontStyle :
                                                  data[`h${setNumber(time)}`] === 0 ? redFontStyle :
                                                  data[`h${setNumber(time)}`] > data.info_goalrank ? orangeFontStyle : bodyStyle
                                return { v: cellValue, t: "s", s: cellStyle };
                            }),
                            { v: data.h24.toFixed(1) + '%', t: "s", s: data.h24 === 100 ? blueFontStyle : data.h24 === 0 ? redFontStyle : orangeFontStyle },
                            { v: data.info_url, t: "s", s: bodyStyle }, // 타이틀
                            { v: '', t: "s", s: bodyStyle } // 타이틀
                        ];
                    XLSX.utils.sheet_add_aoa(ws, [row], {origin: { r: -1, c: 1 }});
                });

                // worksheet에 행의 높이와 열의 너비 설정
                const columnWidths = [ 30, 30, 100, 150, ...header_daily_hours.map(() => 40), 50, 100, 100 ];
                ws['!cols'] = columnWidths.map(width => ({ wpx: width }));
                
                const rowsArray = Array.from({ length: dailyData.length + 4 }, () => ({ hpx: 22 }));
                rowsArray[1].hpx = 60;
                rowsArray[2].hpx = 30;
                ws['!rows'] = rowsArray;

                const range = XLSX.utils.decode_range(ws['!ref']);

                for (let row = range.s.r; row <= range.e.r; row++) {
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = { r: row, c: col };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        const cell = ws[cellRef];
                        if (cell) {
                            const mergedStyle = { ...cell.s, ...borderStyle };
                            cell.s = mergedStyle;
                        }
                    }
                }

                // workbook에 worksheet 추가
                XLSX.utils.book_append_sheet(wb, ws, editedKey);

            }

        });
        
        // STEP 6: Excel 파일로 저장
        XLSX.writeFile(wb, `${title}.xlsx`);
    
    }

	return { weekReportLoading, hourReportLoading, handleOnExport };
}
