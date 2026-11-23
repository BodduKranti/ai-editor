import { createAsyncThunk } from "@reduxjs/toolkit";
import { queryClient } from "../../Providers/TrackQueryProvider";
import { AxiosInstance } from "../../services";
import { Routes } from "../../types";


export const getProjectByid = createAsyncThunk<any, string | undefined, { rejectValue: string }>('getproject/id', async (id, { rejectWithValue }) => {
    try {
        return await queryClient.fetchQuery({
            queryKey: ['project', id],
            queryFn: () => AxiosInstance.get(`${Routes.GET_PROJECT_BY_PROJECTID}${id}`),
            staleTime: Infinity
        })
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Something went wrong");
    }
})