import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserAuth {
    name: string;
    email: string;
    avatar: string;
}

interface UserState {
    user: UserAuth | null;
}

const initialState: UserState = {
    user: null
};

const UserAuthslice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserdata: (state, action: PayloadAction<UserAuth>) => {
            state.user = {
                name: action.payload?.name,
                email: action.payload?.email,
                avatar: action.payload?.avatar
            }
        },
        clearUserdata: (state) => {
            state.user = null;
        },
    }
})

export const {
    setUserdata,
    clearUserdata
} = UserAuthslice.actions
export default UserAuthslice.reducer
