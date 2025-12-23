import { sql } from "drizzle-orm";
import {
	boolean,
	doublePrecision,
	foreignKey,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";

export const auditAction = pgEnum("audit_action", [
	"create",
	"update",
	"delete",
	"archive",
	"restore",
	"login",
	"logout",
	"invite",
	"accept_invite",
	"reject_invite",
	"approve_request",
	"reject_request",
]);
export const invitationStatus = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"rejected",
	"expired",
	"confirmed",
]);
export const issueStatus = pgEnum("issue_status", [
	"open",
	"in_progress",
	"resolved",
	"closed",
]);
export const priorityScores = pgEnum("priority_scores", [
	"low",
	"medium",
	"high",
	"critical",
]);
export const requestStatus = pgEnum("request_status", [
	"pending",
	"approved",
	"rejected",
]);
export const systemEntity = pgEnum("system_entity", [
	"userManagement",
	"trashbinManagement",
	"settingsManagement",
	"dashboardManagement",
	"boardManagement",
	"issueManagement",
	"activityManagement",
	"historyManagement",
	"accessRequestsManagement",
	"invitationsManagement",
	"collectionsManagement",
	"mapManagement",
	"greenHeartsManagement",
	"authentication",
	"authorization",
]);

export const userCollectionAssignments = pgTable(
	"user_collection_assignments",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		trashbinId: text("trashbin_id").notNull(),
		no: serial().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.trashbinId],
			foreignColumns: [trashbin.id],
			name: "user_collection_assignments_trashbin_id_trashbin_id_fk",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_collection_assignments_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const account = pgTable(
	"account",
	{
		id: text().primaryKey().notNull(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", {
			mode: "string",
		}),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
			mode: "string",
		}),
		scope: text(),
		password: text(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
		deviceToken: text("device_token"),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	no: serial().notNull(),
});

export const user = pgTable(
	"user",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		name: text().notNull(),
		email: text().notNull(),
		emailVerified: boolean("email_verified").notNull(),
		image: text(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "user_org_id_organization_id_fk",
		}),
		unique("user_email_unique").on(table.email),
	],
);

export const userSettings = pgTable(
	"user_settings",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		settings: jsonb()
			.default({
				appearance: { font: "Manrope", theme: "dark", liveUpdatesOnMap: true },
			})
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_settings_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const session = pgTable(
	"session",
	{
		id: text().primaryKey().notNull(),
		expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
		token: text().notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id").notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk",
		}).onDelete("cascade"),
		unique("session_token_unique").on(table.token),
	],
);

export const organization = pgTable(
	"organization",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		email: text().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		slug: text().notNull(),
		no: serial().notNull(),
	},
	(table) => [unique("organization_email_unique").on(table.email)],
);

export const userStatus = pgTable(
	"user_status",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		isOnline: boolean("is_online").default(false).notNull(),
		role: text().default("user").notNull(),
		permission: jsonb().default({}).notNull(),
		lastActiveAt: text("last_active_at"),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_status_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const trashbin = pgTable(
	"trashbin",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		name: text().notNull(),
		location: text().notNull(),
		latitude: doublePrecision(),
		longitude: doublePrecision(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		wasteType: text("waste_type").notNull(),
		no: serial().notNull(),
		department: text().default("general").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "trashbin_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

export const trashbinCollections = pgTable(
	"trashbin_collections",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		trashbinId: text("trashbin_id").notNull(),
		collectedBy: text("collected_by").notNull(),
		weightLevel: doublePrecision("weight_level"),
		wasteLevel: integer("waste_level"),
		batteryLevel: integer("battery_level"),
		isFull: boolean("is_full").default(false),
		isArchive: boolean("is_archive").default(false).notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
		logs: jsonb().default([]),
	},
	(table) => [
		foreignKey({
			columns: [table.trashbinId],
			foreignColumns: [trashbin.id],
			name: "trashbin_collections_trashbin_id_trashbin_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.collectedBy],
			foreignColumns: [user.id],
			name: "trashbin_collections_collected_by_user_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "trashbin_collections_org_id_organization_id_fk",
		}).onDelete("cascade"),
	],
);

export const maintenance = pgTable(
	"maintenance",
	{
		id: text().primaryKey().notNull(),
		orgId: text("org_id").notNull(),
		isInMaintenance: boolean("is_in_maintenance").default(false).notNull(),
		message: text(),
		description: text(),
		startTime: text("start_time"),
		endTime: text("end_time"),
		no: serial().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "maintenance_org_id_organization_id_fk",
		}),
	],
);

export const trashbinStatus = pgTable(
	"trashbin_status",
	{
		id: text().primaryKey().notNull(),
		trashbinId: text("trashbin_id").notNull(),
		isOperational: boolean("is_operational").default(false).notNull(),
		isArchived: boolean("is_archived").default(false).notNull(),
		isCollected: boolean("is_collected").default(false).notNull(),
		isScheduled: boolean("is_scheduled").default(false).notNull(),
		scheduledAt: timestamp("scheduled_at", { mode: "string" }),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.trashbinId],
			foreignColumns: [trashbin.id],
			name: "trashbin_status_trashbin_id_trashbin_id_fk",
		}).onDelete("cascade"),
	],
);

export const history = pgTable(
	"history",
	{
		id: text().primaryKey().notNull(),
		title: text().notNull(),
		entity: systemEntity().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		orgId: text("org_id").notNull(),
		no: serial().notNull(),
		userId: text("user_id").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "history_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "history_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const userInvitations = pgTable(
	"user_invitations",
	{
		id: text().primaryKey().notNull(),
		email: text().notNull(),
		orgId: text("org_id").notNull(),
		status: invitationStatus().default("pending").notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		role: text().default("not-set").notNull(),
		permission: text().default("not-set").notNull(),
		no: serial().notNull(),
		userId: text("user_id").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "user_invitations_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_invitations_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const userRequests = pgTable(
	"user_requests",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		orgId: text("org_id").notNull(),
		title: text().notNull(),
		description: text().notNull(),
		status: requestStatus().default("pending").notNull(),
		type: text().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "user_requests_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_requests_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const organizationSettings = pgTable(
	"organization_settings",
	{
		id: text().primaryKey().notNull(),
		organizationId: text("organization_id").notNull(),
		settings: jsonb().default({
			backup: { autoBackup: true, backupFrequency: "weekly" },
			general: { location: { lat: 40, lng: -100 }, wasteLevelThreshold: "80" },
		}),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		no: serial().notNull(),
		secret: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "organization_settings_organization_id_organization_id_fk",
		}),
	],
);

export const qrCode = pgTable("qr_code", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	no: serial().notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const userGreenHearts = pgTable(
	"user_green_hearts",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		totalKg: integer("total_kg").default(0).notNull(),
		points: integer().default(0).notNull(),
		no: serial().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		plastic: integer().default(0).notNull(),
		paper: integer().default(0).notNull(),
		metal: integer().default(0).notNull(),
		glass: integer().default(0).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_green_hearts_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const issues = pgTable(
	"issues",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		title: text().notNull(),
		description: text().notNull(),
		entity: systemEntity().notNull(),
		priority: priorityScores().default("medium").notNull(),
		status: issueStatus().default("open").notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		orgId: text("org_id").notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "issues_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "issues_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const userQuota = pgTable(
	"user_quota",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		used: integer().default(0).notNull(),
		no: serial().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_quota_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const audit = pgTable(
	"audit",
	{
		id: text().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		orgId: text("org_id").notNull(),
		title: text().notNull(),
		entity: systemEntity().notNull(),
		changes: jsonb().default({ after: null, before: null }).notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
		action: auditAction().notNull(),
		no: serial().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "audit_org_id_organization_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "audit_user_id_user_id_fk",
		}).onDelete("cascade"),
	],
);
