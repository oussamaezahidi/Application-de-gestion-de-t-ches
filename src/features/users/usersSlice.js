import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  addUserAPI,
  deleteUserAPI,
} from "./usersAPI";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await fetchUsersAPI();
    return response.data;
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user) => {
    const response = await addUserAPI(user);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id) => {
    await deleteUserAPI(id);
    return id;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (user) => user.id !== action.payload
        );
      });
  },
});

export default usersSlice.reducer;