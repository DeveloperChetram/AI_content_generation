import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setIsPlaygroundOpen } from '../redux/slices/indexSlice';
import { useEffect } from 'react';
const Playground = () => {
    const dispatch = useDispatch();
    
    // const isPlaygroundOpen = useSelector((state) => state.index.isPlaygroundOpen);
    useEffect(()=>{
        dispatch(setIsPlaygroundOpen(true));
        return () => {  
            dispatch(setIsPlaygroundOpen(false));
        }
    },[]);
  return (
    <div>Playground</div>
  )
}

export default Playground