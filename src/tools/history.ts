import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { IdSchema, PaginationSchema } from "@/lib/schema";
import { db } from "../db";
import { history } from "../db/migrations/schema";
import {
	handleCreateData,
	handleDeleteData,
	handleError,
	handleGetAllData,
	handleGetDataById,
	handleNoDataFound,
	handleUpdateData,
} from "../lib/utils";

const InsertHistorySchema = createInsertSchema(history).strict();
const UpdateHistorySchema = InsertHistorySchema.partial();

export function registerHistoryTools(server: McpServer) {
	server.registerTool(
		"get-all-histories",
		{
			title: "Get All Histories",
			description: "Retrieve a list of all histories.",
			inputSchema: PaginationSchema,
		},
		async ({ limit = 10, offset = 10 }) => {
			try {
				const data = await db.query.history.findMany({
					with: {
						user: true,
					},
					limit,
					offset,
					orderBy: (history, { desc }) => [desc(history.createdAt)],
				});
				return handleGetAllData("Histories", data);
			} catch (error) {
				return handleError(error, "get-all-histories");
			}
		},
	);

	server.registerTool(
		"get-history-by-id",
		{
			title: "Get History by ID",
			description: "Retrieve a history by its ID.",
			inputSchema: IdSchema,
		},
		async ({ id }) => {
			try {
				const data = await db.query.history.findFirst({
					where: (history, { eq }) => eq(history.id, id),
					with: {
						user: true,
					},
				});

				if (!data) return handleNoDataFound("History", id);

				return handleGetDataById("History", id, data);
			} catch (error) {
				return handleError(error, "get-history-by-id");
			}
		},
	);

	server.registerTool(
		"create-history",
		{
			title: "Create History",
			description: "Create a new history record.",
			inputSchema: InsertHistorySchema,
		},
		async (input) => {
			try {
				const [result] = await db.insert(history).values(input).returning();

				if (!result)
					return handleError(
						new Error("Failed to create history"),
						"create-history",
					);

				return handleCreateData("History", result);
			} catch (error) {
				return handleError(error, "create-history");
			}
		},
	);

	server.registerTool(
		"update-history",
		{
			title: "Update History",
			description: "Update an existing history record.",
			inputSchema: z.object({
				id: z.string().min(1, "ID cannot be empty"),
				data: UpdateHistorySchema,
			}),
		},
		async ({ id, data }) => {
			try {
				const existing = await db.query.history.findFirst({
					where: (table, { eq }) => eq(table.id, id),
				});

				if (!existing) return handleNoDataFound("History", id);

				const [result] = await db
					.update(history)
					.set(data)
					.where(eq(history.id, id))
					.returning();

				if (!result)
					return handleError(
						new Error("Failed to update history"),
						"update-history",
					);

				return handleUpdateData("History", id, result);
			} catch (error) {
				return handleError(error, "update-history");
			}
		},
	);

	server.registerTool(
		"delete-history",
		{
			title: "Delete History",
			description: "Delete a history record by its ID.",
			inputSchema: IdSchema,
		},
		async ({ id }) => {
			try {
				const existing = await db.query.history.findFirst({
					where: (history, { eq }) => eq(history.id, id),
				});

				if (!existing) return handleNoDataFound("History", id);

				const result = await db
					.delete(history)
					.where(eq(history.id, id))
					.returning();

				if (!result) return handleNoDataFound("History", id);

				return handleDeleteData("History", id);
			} catch (error) {
				return handleError(error, "delete-history");
			}
		},
	);
}
