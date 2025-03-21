import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../redux/slices/todoSlice";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const todoSchema = z.object({
  todoText: z
    .string()
    .min(3, "Todo must be at least 3 characters long")
    .max(100, "Todo cannot exceed 20 characters"),
});

const AddTodo = () => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todoText: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Submitting TODO:", data.todoText);
    dispatch(addTodo(data.todoText));
    reset();
  };

  return (
    <div>
      <Card sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center">
              Todo List
            </Typography>
          }
        />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", gap: 1 }}
          >
            <Controller
              name="todoText"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Add a new todo..."
                  error={!!errors.todoText}
                  helperText={errors.todoText?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTodo;
