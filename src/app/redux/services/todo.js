import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const EXPIRY_TIME = 60 * 1000; // 60 seconds

const saveLocalTodos = (todos) => {
  localStorage.setItem("localTodos", JSON.stringify(todos));
  localStorage.setItem("todosExpiry", Date.now());
};

const getValidLocalTodos = () => {
  const expiry = localStorage.getItem("todosExpiry");
  if (expiry && Date.now() - expiry > EXPIRY_TIME) {
    localStorage.removeItem("localTodos");
    localStorage.removeItem("todosExpiry");
    return [];
  }
  return JSON.parse(localStorage.getItem("localTodos")) || [];
};

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Todos"],
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "todos",
      providesTags: ["Todos"],
      transformResponse: (response) => {
        const localTodos = getValidLocalTodos();
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

        const localTodos = getValidLocalTodos();
        localTodos.unshift(newTodo);
        saveLocalTodos(localTodos);

        return { data: newTodo };
      },
      invalidatesTags: ["Todos"],
    }),

    deleteTodo: builder.mutation({
      queryFn: (todoId) => {
        const localTodos = getValidLocalTodos();
        const updatedTodos = localTodos.filter((todo) => todo.id !== todoId);
        saveLocalTodos(updatedTodos);
        return { data: todoId };
      },
      invalidatesTags: ["Todos"],
    }),

    editTodo: builder.mutation({
      queryFn: ({ todoId, todoText }) => {
        const localTodos = getValidLocalTodos();
        const todoToEdit = localTodos.find((todo) => todo.id === todoId);

        if (todoToEdit) {
          todoToEdit.title = todoText;
          saveLocalTodos(localTodos);
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
