import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodo = createAsyncThunk("fetchTodo", async () => {
  const cachedTodos = localStorage.getItem("todos");
  const cacheTimestamp = localStorage.getItem("todosTimestamp");

  if (cachedTodos && cacheTimestamp) {
    const currentTime = new Date().getTime();
    const cacheAge = currentTime - parseInt(cacheTimestamp);

    if (cacheAge < 30 * 1000) {
      console.log("Using cached TODOs");
      return JSON.parse(cachedTodos);
    } else {
      localStorage.removeItem("todos");
      localStorage.removeItem("todosTimestamp");
      console.log("Cache expired, fetching fresh data");
    }
  }

  console.log("Fetching TODOs from API");
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  const data = response.data;

  localStorage.setItem("todos", JSON.stringify(data));
  localStorage.setItem("todosTimestamp", new Date().getTime().toString());

  return data;
});

export const addTodo = createAsyncThunk("addTodo", async (todoText) => {
  const newTodo = {
    id: Date.now(),
    title: todoText,
    completed: false,
    userId: 1,
  };

  const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
  localTodos.unshift(newTodo);
  localStorage.setItem("localTodos", JSON.stringify(localTodos));
  localStorage.setItem("localTodosTimestamp", new Date().getTime().toString());

  return newTodo;
});

export const deleteTodo = createAsyncThunk("deleteTodo", async (todoId) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/todos/${todoId}`);

  const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
  const updatedTodos = localTodos.filter((todo) => todo.id !== todoId);
  localStorage.setItem("localTodos", JSON.stringify(updatedTodos));
  localStorage.setItem("localTodosTimestamp", new Date().getTime().toString());

  return todoId;
});

export const editTodo = createAsyncThunk(
  "editTodo",
  async ({ todoId, todoText }) => {
    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const todoToEdit = localTodos.find((todo) => todo.id === todoId);

    if (todoToEdit) {
      todoToEdit.title = todoText;
      localStorage.setItem("localTodos", JSON.stringify(localTodos));
      localStorage.setItem(
        "localTodosTimestamp",
        new Date().getTime().toString()
      );
      return todoToEdit;
    }

    throw new Error("TODO not found");
  }
);

const initialState = {
  isLoading: false,
  data: [],
  error: null,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(editTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.data.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(editTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
