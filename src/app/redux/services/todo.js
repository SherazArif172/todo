import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Todos"],

  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "todos",
      providesTags: ["Todos"],
      transformResponse: (response) => {
        const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
        return [...localTodos, ...response];
      },
    }),

    addTodo: builder.mutation({
      queryFn: (todoText) => {
        const newTodo = {
          id: Date.now(),
          title: todoText,
          completed: false,
          userId: 1,
        };

        const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
        localTodos.unshift(newTodo);
        localStorage.setItem("localTodos", JSON.stringify(localTodos));

        return { data: newTodo };
      },
      invalidatesTags: ["Todos"],
    }),

    deleteTodo: builder.mutation({
      queryFn: (todoId) => {
        const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
        const updatedTodos = localTodos.filter((todo) => todo.id !== todoId);
        localStorage.setItem("localTodos", JSON.stringify(updatedTodos));
        return { data: todoId };
      },
      invalidatesTags: ["Todos"],
    }),

    editTodo: builder.mutation({
      queryFn: ({ todoId, todoText }) => {
        const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
        const todoToEdit = localTodos.find((todo) => todo.id === todoId);

        if (todoToEdit) {
          todoToEdit.title = todoText;
          localStorage.setItem("localTodos", JSON.stringify(localTodos));
          return { data: todoToEdit };
        }

        throw new Error("TODO not found");
      },
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} = todoApi;

export default todoApi.reducer;
