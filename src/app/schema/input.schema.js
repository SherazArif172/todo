import { z } from "zod";

const todoSchema = z.object({
  todoText: z
    .string()
    .min(3, "Todo must be at least 3 characters long")
    .max(100, "Todo cannot exceed 20 characters"),
});

export default todoSchema;
