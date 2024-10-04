import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import clubSlice from "./clubSlice";

const store = configureStore({
    reducer:{
        auth:authSlice,
        club:clubSlice
    }
});
export default store; 