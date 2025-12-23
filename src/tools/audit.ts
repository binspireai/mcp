import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { db } from "../db";
import { audit } from "../db/migrations/schema";
import {
	handleCreateData,
	handleDeleteData,
	handleError,
	handleGetAllData,
	handleGetDataById,
	handleNoDataFound,
	handleUpdateData,
} from "../lib/utils";

const InsertAuditSchema = createInsertSchema(audit).strict();
const UpdateAuditSchema = InsertAuditSchema.partial();

export function registerAuditTools(server: McpServer) {
	server.registerTool(
		"get-all-audits",
		{
			title: "Get All Audits",
			description: "Retrieve a list of all audits.",
			inputSchema: undefined,
		},
		async () => {
			try {
				const data = await db.query.audit.findMany();
				return handleGetAllData("Audits", data);
			} catch (error) {
				return handleError(error, "get-all-audits");
			}
		},
	);

	server.registerTool(
		"get-audit-by-id",
		{
			title: "Get Audit by ID",
			description: "Retrieve an audit by its ID.",
			inputSchema: {
				id: z.string().min(1, "ID cannot be empty"),
			},
		},
		async ({ id }) => {
			try {
				const data = await db.query.audit.findFirst({
					where: (audit, { eq }) => eq(audit.id, id),
				});

				if (!data) return handleNoDataFound("Audit", id);

				return handleGetDataById("Audit", id, data);
			} catch (error) {
				return handleError(error, "get-audit-by-id");
			}
		},
	);

	server.registerTool(
		"create-audit",
		{
			title: "Create Audit",
			description: "Create a new audit entry.",
			inputSchema: InsertAuditSchema,
		},
		async (input) => {
			try {
				const [result] = await db.insert(audit).values(input).returning();

				if (!result)
					return handleError(
						new Error("Failed to create audit"),
						"create-audit",
					);

				return handleCreateData("Audit", result);
			} catch (error) {
				return handleError(error, "create-audit");
			}
		},
	);

	server.registerTool(
		"update-audit",
		{
			title: "Update Audit",
			description: "Update an existing audit entry.",
			inputSchema: z.object({
				id: z.string().min(1, "ID cannot be empty"),
				data: UpdateAuditSchema,
			}),
		},
		async ({ id, data }) => {
			try {
				const existing = await db.query.audit.findFirst({
					where: (table, { eq }) => eq(table.id, id),
				});

				if (!existing) return handleNoDataFound("Audit", id);

				const [result] = await db
					.update(audit)
					.set(data)
					.where(eq(audit.id, id))
					.returning();

				if (!result) {
					return handleNoDataFound("Audit", id);
				}

				return handleUpdateData("Audit", id, result);
			} catch (error) {
				return handleError(error, "update-audit");
			}
		},
	);

	server.registerTool(
		"delete-audit",
		{
			title: "Delete Audit",
			description: "Delete an audit entry by its ID.",
			inputSchema: {
				id: z.string().min(1, "ID cannot be empty"),
			},
		},
		async ({ id }) => {
			try {
				const existing = await db.query.audit.findFirst({
					where: (table, { eq }) => eq(table.id, id),
				});

				if (!existing) return handleNoDataFound("Audit", id);

				const [result] = await db
					.delete(audit)
					.where(eq(audit.id, id))
					.returning();

				if (!result) return handleNoDataFound("Audit", id);

				return handleDeleteData("Audit", id);
			} catch (error) {
				return handleError(error, "delete-audit");
			}
		},
	);
}
