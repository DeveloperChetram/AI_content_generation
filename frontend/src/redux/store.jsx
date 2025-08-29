import  {configureStore} from '@reduxjs/toolkit';
import  userSlice  from './slices/userSlice';
import       alertSlice  from './slices/alertSlice';

export const store = configureStore({
    reducer:{
        user:userSlice,
        alert:alertSlice,
    },
})


