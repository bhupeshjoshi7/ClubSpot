import { createSlice } from "@reduxjs/toolkit";

const clubSlice = createSlice({
    name: "club",
    initialState: {
        allClubs: [],
        singleClub: null,
        allAdminJobs: []
    },
    reducers: {
        setallClubs: (state, action) => {
            state.allClubs = action.payload;
        },
        setsingleClub: (state, action) => {
            state.singleClub = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        }
    }
});

export const { setallClubs, setsingleClub, setAllAdminJobs } = clubSlice.actions;
export default clubSlice.reducer;