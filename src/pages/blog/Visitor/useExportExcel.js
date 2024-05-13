import { useNotificationContext } from '@/common';
import { useState } from 'react';
import * as XLSX from 'xlsx-js-style'

export default function useExportExcel() {

    const [ memoExportLoading, setmemoExportLoading ] = useState(false);
    const { showNotification } = useNotificationContext();
	
	const handleOnExport = async ( values ) => {
        const { data, date, keyword } = values;

        setmemoExportLoading(true)
    
        const list = data.list;

        if(list) {
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

            const header = [
                { v: "No", t: "s", s: blueHeaderStyle },
                { v: "Naver ID", t: "s", s: blueHeaderStyle },
                { v: "URL", t: "s", s: yellowHeaderStyle },
                { v: "방문자 수 (3일 평균)", t: "s", s: grayHeaderStyle },
                { v: "블로그 랭킹", t: "s", s: pinkHeaderStyle },
            ];

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

            //타이블, 서브타이블
            const subTitle = date.split(' ')[0];
            const title = `${keyword} 블로그 방문자`;

            // 데이터로 worksheet 생성
            const ws = XLSX.utils.aoa_to_sheet([]);

            // 헤더 타이틀 행 추가
            const headerTitleRow = [];
            for (let i = 0; i < header.length; i++) {
                headerTitleRow.push({ v: title, t: "s", s: titleHeaderStyle });
            }
            XLSX.utils.sheet_add_aoa(ws, [headerTitleRow], {origin: { r: 1, c: 1 }});

            // 헤더 서브타이틀 행 추가
            const headerSubtitleRow = [];
            for (let i = 0; i < header.length; i++) {
                headerSubtitleRow.push({ v: subTitle, t: "s", s: subTitleHeaderStyle });
            }
            XLSX.utils.sheet_add_aoa(ws, [headerSubtitleRow], {origin: { r: -1, c: 1 }});

            // 셀 병합
            const merge = [
                { s: { r: 1, c: 1 }, e: { r: 1, c: header.length } },{ s: { r: 2, c: 1 }, e: { r: 2, c: header.length } },
            ];
            ws["!merges"] = merge;

            XLSX.utils.sheet_add_aoa(ws, [header], {origin: { r: -1, c: 1 }});

            // 데이터 추가
            list.forEach((data, dataIdx) => {
                let row = [];
                row = [
                    { v: dataIdx + 1, t: "s", s: bodyStyle }, // 번호
                    { v: data.stats_id, t: "s", s: bodyStyle }, // Naver ID
                    { v: data.stats_url, t: "s", s: bodyStyle }, // URL
                    { v: data.stats_amount, t: "s", s: bodyStyle }, // 방문자 수
                    { v: data.stats_rank, t: "s", s: bodyStyle }, // 블로그 랭킹
                ];                        

                XLSX.utils.sheet_add_aoa(ws, [row], {origin: { r: -1, c: 1 }});
            });

            // worksheet에 행의 높이와 열의 너비 설정
            let columnWidths = [30, 30, 100, 300, 120, 100];
            ws['!cols'] = columnWidths.map(width => ({ wpx: width }));

            const rowsArray = Array.from({ length: list.length + 4 }, () => ({ hpx: 22 }));
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

            const editedTitle = `${subTitle} ${keyword} 블로그 방문자`;

            // workbook에 worksheet 추가
            XLSX.utils.book_append_sheet(wb, ws, editedTitle);


            setmemoExportLoading(false)

            // STEP 6: Excel 파일로 저장
            XLSX.writeFile(wb, `${editedTitle}.xlsx`);
        }
    }

	return { memoExportLoading, handleOnExport };
}
