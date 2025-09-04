import { createSlice } from '@reduxjs/toolkit';
export const indexSlice = createSlice({

    name: 'index',
    initialState: {
      isPlaygroundOpen: false
    },
    reducers: {
      setIsPlaygroundOpen: (state, action) => {
        state.isPlaygroundOpen = action.payload;
      }
    }
})



export const { setIsPlaygroundOpen } = indexSlice.actions;
export default indexSlice.reducer;