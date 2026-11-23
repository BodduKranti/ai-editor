import { createSlice } from "@reduxjs/toolkit";
import { getProjectByid } from "../asyncThunk/Project.thunk";

export interface projectProps {
    _id: string,
    owner: string,
    name: string,
    description: string,
    starred: boolean
}

interface projectDesc {
    data: projectProps | null,
    error: string | null
}

const initialState: projectDesc = {
    data: null,
    error: null
}


const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjectByid.fulfilled, (state, action: Partial<any>) => {
                state.data = action?.payload?.data
                state.error = null
            })
            .addCase(getProjectByid.rejected, (state, action) => {
                state.error = action?.payload ?? 'Failed'
            })

    }
})
export default projectSlice.reducer
