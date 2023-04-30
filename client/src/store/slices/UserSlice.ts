import { createSlice } from '@reduxjs/toolkit';

import { User } from '../../models/interfaces';

const initialState: User = {
  id:'',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      setUser: (state, action) => {
          state.id = action.payload.id;
      }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
