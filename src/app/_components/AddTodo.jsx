import React from "react";
import { useAddTodoMutation } from "../redux/slices/todoSlice";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import todoSchema from "../schema/input.schema";

const AddTodo = () => {
  const [addTodo] = useAddTodoMutation();

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

  const onSubmit = async (data) => {
    try {
      await addTodo(data.todoText).unwrap();
      reset();
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
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
