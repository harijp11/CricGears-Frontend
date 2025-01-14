import {createSlice} from "@reduxjs/toolkit"
const adminSlice=createSlice({
    name:"admin",
    initialState:{
        adminDatas:localStorage.getItem("adminDatas")?
        JSON.parse(localStorage.getItem("adminDatas"))
        : null
    },
    reducers:{
        addAdmin:(state,action)=>{
            state.adminDatas=action.payload
            localStorage.setItem("adminDatas",JSON.stringify(action.payload))
        },
         logoutAdmin:(state,action)=>{
            state.adminDatas= null;
            localStorage.removeItem("adminDatas")
         }
    }
})

export const {addAdmin,logoutAdmin}=adminSlice.actions
export default adminSlice.reducer