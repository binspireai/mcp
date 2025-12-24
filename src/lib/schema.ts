import z from "zod";

export const PaginationSchema = z.object({
	limit: z.number(),
	offset: z.number(),
});

export const IdSchema = z.object({
	id: z.string().min(1, "ID cannot be empty"),
});
