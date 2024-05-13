import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function useSortData() {
  
  const [ loading, setLoading ] = useState(false);
  
  const sortData = async (seqlist) => {
    // console.log('in', seqlist)

    setLoading(true)
    try {
        let res = await monitoring.sortData(seqlist);
        if(res) {
            // console.log("자료 순서 이동 완료? ", res)
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
  }
  
  return { loading, sortData };
}