import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { IdSchema, PaginationSchema } from "@/lib/schema";
import { db } from "../db";
import { issues } from "../db/migrations/schema";
import {
	handleCreateData,
	handleDeleteData,
	handleError,
	handleGetAllData,
	handleGetDataById,
	handleNoDataFound,
	handleUpdateData,
} from "../lib/utils";

const InsertIssueSchema = createInsertSchema(issues).strict();
const UpdateIssueSchema = InsertIssueSchema.partial();

export function registerIssueTools(server: McpServer) {
	server.registerTool(
		"get-all-issues",
		{
			title: "Get All Issues",
			description: "Retrieve a list of all issues.",
			inputSchema: PaginationSchema,
		},
		async ({ limit = 10, offset = 10 }) => {
			try {
				const data = await db.query.issues.findMany({
					with: {
						user: true,
					},
					limit,
					offset,
					orderBy: (issues, { desc }) => [desc(issues.createdAt)],
				});
				return handleGetAllData("Issues", data);
			} catch (error) {
				return handleError(error, "get-all-issues");
			}
		},
	);

	server.registerTool(
		"get-issue-by-id",
		{
			title: "Get Issue by ID",
			description: "Retrieve an issue by its ID.",
			inputSchema: IdSchema,
		},
		async ({ id }) => {
			try {
				const data = await db.query.issues.findFirst({
					where: (issues, { eq }) => eq(issues.id, id),
					with: {
						user: true,
					},
				});

				if (!data) return handleNoDataFound("Issue", id);

				return handleGetDataById("Issue", id, data);
			} catch (error) {
				return handleError(error, "get-issue-by-id");
			}
		},
	);

	server.registerTool(
		"create-issue",
		{
			title: "Create Issue",
			description: "Create a new issue entry.",
			inputSchema: InsertIssueSchema,
		},
		async (input) => {
			try {
				const [result] = await db.insert(issues).values(input).returning();

				if (!result)
					return handleError(
						new Error("Failed to create issue"),
						"create-issue",
					);

				return handleCreateData("Issue", result);
			} catch (error) {
				return handleError(error, "create-issue");
			}
		},
	);

	server.registerTool(
		"update-issue",
		{
			title: "Update Issue",
			description: "Update an existing issue entry.",
			inputSchema: z.object({
				id: z.string().min(1, "ID cannot be empty"),
				data: UpdateIssueSchema,
			}),
		},
		async ({ id, data }) => {
			try {
				const existing = await db.query.issues.findFirst({
					where: (table, { eq }) => eq(table.id, id),
				});

				if (!existing) return handleNoDataFound("Issue", id);

				const [result] = await db
					.update(issues)
					.set(data)
					.where(eq(issues.id, id))
					.returning();

				if (!result) return handleNoDataFound("Issue", id);

				return handleUpdateData("Issue", id, result);
			} catch (error) {
				return handleError(error, "update-issue");
			}
		},
	);

	server.registerTool(
		"delete-issue",
		{
			title: "Delete Issue",
			description: "Delete an issue entry by its ID.",
			inputSchema: IdSchema,
		},
		async ({ id }) => {
			try {
				const existing = await db.query.issues.findFirst({
					where: (table, { eq }) => eq(table.id, id),
				});

				if (!existing) return handleNoDataFound("Issue", id);

				const [result] = await db
					.delete(issues)
					.where(eq(issues.id, id))
					.returning();

				if (!result) return handleNoDataFound("Issue", id);

				return handleDeleteData("Issue", id);
			} catch (error) {
				return handleError(error, "delete-issue");
			}
		},
	);
}
