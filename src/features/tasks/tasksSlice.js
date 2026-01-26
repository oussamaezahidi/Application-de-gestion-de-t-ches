import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchTasksAPI,
    addTaskAPI,
    updateTaskAPI,
    deleteTaskAPI,
} from "./tasksAPI";


export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async () => {
        const response = await fetchTasksAPI();
        return response.data;
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (task) => {
        const response = await addTaskAPI(task);
        return response.data;
    }
);

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async (task) => {
        const response = await updateTaskAPI(task);
        return response.data;
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id) => {
        await deleteTaskAPI(id);
        return id;
    }
);



const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        items: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.items = action.payload;
            })

        
            .addCase(addTask.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

        
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    (task) => task.id === action.payload.id
                );
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

         
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (task) => task.id !== action.payload
                );
            });
    },
});

export default tasksSlice.reducer;