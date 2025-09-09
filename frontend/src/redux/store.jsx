import  {configureStore} from '@reduxjs/toolkit';
import  userSlice  from './slices/userSlice';
import       alertSlice  from './slices/alertSlice';
import       indexSlice  from './slices/indexSlice';
import       postSlice  from './slices/postSlice';

export const store = configureStore({
    reducer:{
        user:userSlice,
        alert:alertSlice,
        index:indexSlice,
        post:postSlice,
    },
})


