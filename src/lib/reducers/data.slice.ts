import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DataRow from '../../models/DataRow';
import { fetchHighWinterIntervals, fetchLowWinterIntervals, fetchSolarIntervals } from '../thunks/data.thunks';

export interface DataState {
    solarIntervals: DataRow[];
    lowWinterIntervals: DataRow[];
    highWinterIntervals: DataRow[];
}

export const initialState: DataState = {
    solarIntervals: [],
    lowWinterIntervals: [],
    highWinterIntervals: [],
}

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSolarIntervals.fulfilled, (state: DataState, { payload }: PayloadAction<DataRow[]>) => {
                state.solarIntervals = payload;
            })
            .addCase(fetchLowWinterIntervals.fulfilled, (state: DataState, { payload }: PayloadAction<DataRow[]>) => {
                state.lowWinterIntervals = payload;
            })
            .addCase(fetchHighWinterIntervals.fulfilled, (state: DataState, { payload }: PayloadAction<DataRow[]>) => {
                state.highWinterIntervals = payload;
            })
    }
})

export default dataSlice.reducer;