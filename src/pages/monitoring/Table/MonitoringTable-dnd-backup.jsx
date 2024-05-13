import React from 'react'
import './css/MonitoringTable-common.style.css';
import './css/MonitoringTable-week.style.css';
import './css/MonitoringTable-24hour.style.css';
import './css/MonitoringTable-month.style.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationContext } from '@/common';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const MonitoringTable = ( {type: dataType, data, isToday} ) => {
    
    const { showNotification } = useNotificationContext();
    const [ currentHour, setCurrentHour ] = useState(new Date().getHours());
    const [ dataTemp, setDataTemp ] = useState([]);

    useEffect(()=>{
      setDataTemp(data)
    },[data])

    // --- Draggable이 Droppable로 드래그 되었을 때 실행되는 이벤트
    const onDragEnd = (result) => {

      if (!result.destination) {
        return;
      }
    
      const { source, destination } = result;

      // 데이터 배열에서 아이템을 이동합니다.
      const newData = Array.from(data);
      const [removed] = newData.splice(source.index, 1);
      newData.splice(destination.index, 0, removed);

      setDataTemp(newData);

      console.log('>>> source', source);
      console.log('>>> destination', destination);
    };

    // --- requestAnimationFrame 초기화
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));

      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);

    if (!enabled) {
      return null;
    }
    // --- requestAnimationFrame 초기화 END

    const copyURL = async (url) => {
      try {
          if (navigator.clipboard) {
              await navigator.clipboard.writeText(url);
              showNotification({
                message: 'URL이 클립보드에 복사되었습니다. Ctrl+V를 눌러 붙여넣기 하세요.',
                type: 'success',
              });
          } else {
              const textField = document.createElement('textarea');
              textField.innerText = url;
              document.body.appendChild(textField);
              textField.select();
              document.execCommand('copy');
              textField.remove();
              showNotification({
                message: 'URL이 클립보드에 복사되었습니다. Ctrl+V를 눌러 붙여넣기 하세요.',
                type: 'success',
              });
          }
      } catch(error) {
        console.error('클립보드 복사 실패: ', error);
        showNotification({
					message: '클립보드 복사에 실패했습니다. 새로고침 후 다시 시도해주세요.',
					type: 'error',
				});
      }
    }

    const desiredHours = [9, 10, 11, 13, 14, 15, 16, 17];
    const hours = Array.from({ length: 24 }, (_, index) => index);
    const days = Array.from({ length: 31 }, (_, index) => index + 1);

    const setHour = (hour) => {
      return hour.toString().padStart(2, '0');
    }


    if ( dataType === 'week' ) {
        return (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className='monitoring-table monitoring-table-week'>
              <div className='header'>
                  <div className='client'>클라이언트</div>
                  <div className='platform'>플랫폼</div>
                  <div className='keyword'>키워드</div>
                  {desiredHours.map(hour => <div key={hour} className={`time time${hour} ${currentHour === hour && isToday ? 'active' : ''}`}>{`${hour}시`}</div>)}
                  <div className='total'>노출률</div>
                  <div className='goalrank'>목표순위</div>
                  <div className='title'>Title</div>
                  <div className='url'>타겟</div>
              </div>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div 
                      className="body" 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                  >
                    {dataTemp.map((item, index) => (
                      <Draggable key={`${item.client}${index}`} draggableId={`${item.client}${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className='content'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              backgroundColor: snapshot.isDragging ? 'var(--ct-info-bg-subtle)' : '',
                              border: snapshot.isDragging ? '2px solid var(--ct-info-border-subtle)' : '',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className='client'><p>{item.client}</p></div>
                            <div className='platform'><p>{item.platform}</p></div>
                            <div className='keyword'><p>{item.keyword}</p></div>

                            {desiredHours.map(hour => 
                                <div key={hour} className={`time time${hour} ${currentHour === hour && isToday ? 'active' : ''}`}>
                                    <p className='mo'>{`${hour}시`}</p>
                                    <p className={
                                      `${item[`h${setHour(hour)}`] <= item.goalrank && item[`h${setHour(hour)}`] > 0 ? 'text-success' : ''} 
                                      ${item[`h${setHour(hour)}`] > item.goalrank ? 'text-warning' : ''} 
                                      ${item[`h${setHour(hour)}`] === 0 ? 'text-danger' : ''}`
                                    }>
                                      {item[`h${setHour(hour)}`] === 0 ? '-' : item[`h${setHour(hour)}`]}
                                    </p>
                                </div>
                            )}
                            <div className='total'><p className='mo'>노출률</p><p className={`${item.h24 === 100 ? 'text-success' : ''} ${item.h24 === 0 ? 'text-danger' : ''} ${item.h24 < 100 ? 'text-warning' : ''}`}>{item.h24 === 100 || item.h24 === 0 ? item.h24.toFixed(0) : item.h24.toFixed(1)}%</p></div>
                            <div className='goalrank'><p className='mo'>목표순위</p><p>{item.goalrank}</p></div>
                            <div className='title'><p>{item.title || '-'}</p></div>
                            <div className='url'>
                              {item.platform === '자동완성' ? <p>{item.url}</p> :
                              <><span onClick={()=>copyURL(item.url)}><i className='ri-file-copy-2-line'/></span>
                              <Link to={item.url} target='_blank'><i className='ri-links-fill'/></Link></>
                              }
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )
    } else if ( dataType === '24hour' ) {
        return (
          <>
            <div className='monitoring-table monitoring-table-24hour'>
              <div className='header'>
                  <div className='client'>클라이언트</div>
                  <div className='platform'>플랫폼</div>
                  <div className='keyword'>키워드</div>
                  {hours.map((hour) => <div key={hour} className={`time time${hour} ${currentHour === hour && isToday ? 'active' : ''}`}>{`${hour}시`}</div>)}
                  <div className='total'>노출률</div>
                  <div className='goalrank'>목표순위</div>
                  <div className='title'>Title</div>
                  <div className='url'>타겟</div>
              </div>
              <div className='body'>
                {data.map((item, index) => (
                  <div key={index} className='content'>
                    <div className='client'><p>{item.client}</p></div>
                    <div className='platform'><p>{item.platform}</p></div>
                    <div className='keyword'><p>{item.keyword}</p></div>
                    {hours.map(hour => (
                        <div key={hour} className={`time time${hour} ${currentHour === hour && isToday ? 'active' : ''}`}>
                            <p className='mo'>{`${hour}시`}</p>
                            <p className={
                              `${item[`h${setHour(hour)}`] <= item.goalrank && item[`h${setHour(hour)}`] > 0 ? 'text-success' : ''} 
                               ${item[`h${setHour(hour)}`] === 0 ? 'text-danger' : ''} 
                               ${item[`h${setHour(hour)}`] > item.goalrank ? 'text-warning' : ''}`
                            }>
                              {item[`h${setHour(hour)}`] === 0 ? '-' : item[`h${setHour(hour)}`]}
                            </p>
                        </div>
                    ))}
                    <div className='total'>
                        <p className='mo'>노출률</p>
                        <p className={
                          `${item.h24 === 100 ? 'text-success' : ''}
                           ${item.h24 === 0 ? 'text-danger' : ''}
                           ${item.h24 < 100 ? 'text-warning' : ''}`
                        }>
                          {item.h24 === 100 || item.h24 === 0 ? item.h24.toFixed(0) : item.h24.toFixed(1)}%
                        </p>
                    </div>
                    <div className='goalrank'><p className='mo'>목표순위</p><p>{item.goalrank}</p></div>
                    <div className='title'><p>{item.title || '-'}</p></div>
                    <div className='url'>
                      {item.platform === '자동완성' ? <p>{item.url}</p> :
                      <><span onClick={()=>copyURL(item.url)}><i className='ri-file-copy-2-line'/></span>
                      <Link to={item.url} target='_blank'><i className='ri-links-fill'/></Link></>
                      }
                    </div>
                    
                    
                  </div>
                ))}
              </div>
            </div>
          </>
        )
    } 
    else if ( dataType === 'month' ) {
      return (
        <>
          <div className='monitoring-table monitoring-table-month'>
            <div className='header'>
                <div className='client'>클라이언트</div>
                <div className='platform'>플랫폼</div>
                <div className='keyword'>키워드</div>
                {days.map((day) => <div key={day}className='day'>{`${day}일`}</div>)}
            </div>
            <div className='body'>
              {data.map((item, index) => (
                <div key={index} className='content'>
                  <div className='client'><p>{item.client}</p></div>
                  <div className='platform'><p>{item.platform}</p></div>
                  <div className='keyword'><p>{item.keyword}</p></div>
                  {days.map(day => 
                    <div key={day} className={`day day${day}`}>
                      <p className='mo'>{`${day}일`}</p>
                      <p className={
                        `${item[`d${day}`] === 100 ? 'text-success' : ''} 
                         ${item[`d${day}`] < 100 && item[`d${day}`] > 0 ? 'text-warning' : ''} 
                         ${item[`d${day}`] === 0 ? 'text-danger' : ''}`}
                      >
                        {
                          item[`d${day}`] === 0 ? '-' //데이터가 0이면 '-'을 반환하고
                          : item[`d${day}`] === 100 //그렇지 않고 데이터가 100이면
                            ? item[`d${day}`].toFixed(0) //소수점없이 반환하고
                            : item[`d${day}`].toFixed(1) //그렇지 않은 경우에는 소수점 첫째자리에서 반올림하여 표시
                        }
                      </p>
                    </div>)}
                </div>
              ))}
            </div>
          </div>
        </>
      )
  } 
  
}

export default MonitoringTable