import z from "zod";

export const PaginationSchema = z.object({
	limit: z.number().min(1).max(100).default(10),
	offset: z.number().min(1).default(10),
});

export const IdSchema = z.object({
	id: z.string().min(1, "ID cannot be empty"),
});
