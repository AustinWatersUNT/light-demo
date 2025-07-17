import LightClient from "@/src/clients/light.client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSolarIntervals = createAsyncThunk(
    'data/fetchSolarIntervals', async () => await new LightClient().getSolarIntervals(),
);

export const fetchLowWinterIntervals = createAsyncThunk(
    'data/fetchLowWinterIntervals', async () => await new LightClient().getLowWinterInternals(),
);

export const fetchHighWinterIntervals = createAsyncThunk(
    'data/fetchHighWinterIntervals', async () => await new LightClient().getHighWinterIntervals(),
);