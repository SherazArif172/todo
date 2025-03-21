import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import { deleteTodo, fetchTodo, editTodo } from "../redux/slices/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";

const TodoItem = React.memo(
  ({ item, onDelete, onEdit, isEditing, handleSaveEdit }) => {
    const [editText, setEditText] = useState(item.title);

    useEffect(() => {
      if (isEditing) {
        setEditText(item.title);
      }
    }, [isEditing, item.title]);

    return (
      <ListItem
        key={item.id}
        secondaryAction={
          <Box className="flex gap-3">
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(item)}
            >
              <SquarePen />
            </IconButton>

            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 />
            </IconButton>
          </Box>
        }
      >
        {isEditing ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              size="small"
            />
            <Button onClick={() => handleSaveEdit(editText)}>Save</Button>
            <Button onClick={() => onEdit(null)}>Cancel</Button>
          </Box>
        ) : (
          <ListItemText
            primary={item.title}
            sx={{
              "& .MuiTypography-root": {
                width: "400px",
                height: "50px",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          />
        )}
      </ListItem>
    );
  }
);

const AllTodo = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.todo);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  const handleDelete = (todoId) => {
    dispatch(deleteTodo(todoId));
  };

  const handleEdit = (todo) => {
    if (todo) {
      setEditingId(todo.id);
    } else {
      setEditingId(null);
    }
  };

  const handleSaveEdit = (updatedText) => {
    if (editingId && updatedText.trim()) {
      dispatch(editTodo({ todoId: editingId, todoText: updatedText }));
      setEditingId(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ maxWidth: 540, mx: "auto", p: 2 }}>
      <Paper elevation={2}>
        <List>
          {data?.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isEditing={editingId === item.id}
              handleSaveEdit={handleSaveEdit}
            />
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AllTodo;
