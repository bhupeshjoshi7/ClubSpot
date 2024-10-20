import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import clubSlice from "./clubSlice";
import companySlice from "./companySlice";

const store = configureStore({
    reducer:{
        auth:authSlice,
        club:clubSlice,
        company:companySlice,
    }
});
export default store; 