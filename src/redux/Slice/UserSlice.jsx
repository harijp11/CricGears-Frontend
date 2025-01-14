import {createSlice} from "@reduxjs/toolkit"

const userSlice=createSlice({
name:"user",
initialState:{
    userDatas:localStorage.getItem("userDatas") ?
    JSON.parse(localStorage.getItem("userDatas")):
    null,
},
reducers:{
    addUser:(state,action)=>{
        state.userDatas=action.payload;
        localStorage.setItem("userDatas",JSON.stringify(action.payload))
    },
    logoutUser:(state)=>{
        state.userDatas=null
        localStorage.removeItem("userDatas")
    },
},

})

export const { addUser,logoutUser}=userSlice.actions
export default userSlice.reducer;