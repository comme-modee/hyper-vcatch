import React from 'react'
import { monitoring } from '@/common/api';
import { useState } from 'react';

export default function usePlatformList() {
  
  const [ data, setData ] = useState();
  
  const getPlatformList = async () => {
    try {
        let platformListData = await monitoring.platformList();
        setData(platformListData)
    } catch (error) {
        console.log(error)
    }
  }
  
  return { data, getPlatformList };
}
