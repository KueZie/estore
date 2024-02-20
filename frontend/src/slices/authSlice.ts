import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  userInfo: {
    _id?: string;
    name?: string;
    email?: string;
    isAdmin?: boolean;
  } | null;
}

const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo') as string) 
    : null;

const initialState: AuthState = {
  userInfo: userInfoFromStorage
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<Partial<AuthState['userInfo']>>) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state: AuthState) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer