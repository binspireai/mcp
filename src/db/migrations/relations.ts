import { relations } from "drizzle-orm/relations";
import { trashbin, userCollectionAssignments, user, account, organization, userSettings, session, userStatus, trashbinCollections, maintenance, trashbinStatus, history, userInvitations, userRequests, organizationSettings, userGreenHearts, issues, userQuota, audit } from "./schema";

export const userCollectionAssignmentsRelations = relations(userCollectionAssignments, ({one}) => ({
	trashbin: one(trashbin, {
		fields: [userCollectionAssignments.trashbinId],
		references: [trashbin.id]
	}),
	user: one(user, {
		fields: [userCollectionAssignments.userId],
		references: [user.id]
	}),
}));

export const trashbinRelations = relations(trashbin, ({one, many}) => ({
	userCollectionAssignments: many(userCollectionAssignments),
	organization: one(organization, {
		fields: [trashbin.orgId],
		references: [organization.id]
	}),
	trashbinCollections: many(trashbinCollections),
	trashbinStatuses: many(trashbinStatus),
}));

export const userRelations = relations(user, ({one, many}) => ({
	userCollectionAssignments: many(userCollectionAssignments),
	accounts: many(account),
	organization: one(organization, {
		fields: [user.orgId],
		references: [organization.id]
	}),
	userSettings: many(userSettings),
	sessions: many(session),
	userStatuses: many(userStatus),
	trashbinCollections: many(trashbinCollections),
	histories: many(history),
	userInvitations: many(userInvitations),
	userRequests: many(userRequests),
	userGreenHearts: many(userGreenHearts),
	issues: many(issues),
	userQuotas: many(userQuota),
	audits: many(audit),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	users: many(user),
	trashbins: many(trashbin),
	trashbinCollections: many(trashbinCollections),
	maintenances: many(maintenance),
	histories: many(history),
	userInvitations: many(userInvitations),
	userRequests: many(userRequests),
	organizationSettings: many(organizationSettings),
	issues: many(issues),
	audits: many(audit),
}));

export const userSettingsRelations = relations(userSettings, ({one}) => ({
	user: one(user, {
		fields: [userSettings.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userStatusRelations = relations(userStatus, ({one}) => ({
	user: one(user, {
		fields: [userStatus.userId],
		references: [user.id]
	}),
}));

export const trashbinCollectionsRelations = relations(trashbinCollections, ({one}) => ({
	trashbin: one(trashbin, {
		fields: [trashbinCollections.trashbinId],
		references: [trashbin.id]
	}),
	user: one(user, {
		fields: [trashbinCollections.collectedBy],
		references: [user.id]
	}),
	organization: one(organization, {
		fields: [trashbinCollections.orgId],
		references: [organization.id]
	}),
}));

export const maintenanceRelations = relations(maintenance, ({one}) => ({
	organization: one(organization, {
		fields: [maintenance.orgId],
		references: [organization.id]
	}),
}));

export const trashbinStatusRelations = relations(trashbinStatus, ({one}) => ({
	trashbin: one(trashbin, {
		fields: [trashbinStatus.trashbinId],
		references: [trashbin.id]
	}),
}));

export const historyRelations = relations(history, ({one}) => ({
	organization: one(organization, {
		fields: [history.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [history.userId],
		references: [user.id]
	}),
}));

export const userInvitationsRelations = relations(userInvitations, ({one}) => ({
	organization: one(organization, {
		fields: [userInvitations.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [userInvitations.userId],
		references: [user.id]
	}),
}));

export const userRequestsRelations = relations(userRequests, ({one}) => ({
	organization: one(organization, {
		fields: [userRequests.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [userRequests.userId],
		references: [user.id]
	}),
}));

export const organizationSettingsRelations = relations(organizationSettings, ({one}) => ({
	organization: one(organization, {
		fields: [organizationSettings.organizationId],
		references: [organization.id]
	}),
}));

export const userGreenHeartsRelations = relations(userGreenHearts, ({one}) => ({
	user: one(user, {
		fields: [userGreenHearts.userId],
		references: [user.id]
	}),
}));

export const issuesRelations = relations(issues, ({one}) => ({
	organization: one(organization, {
		fields: [issues.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [issues.userId],
		references: [user.id]
	}),
}));

export const userQuotaRelations = relations(userQuota, ({one}) => ({
	user: one(user, {
		fields: [userQuota.userId],
		references: [user.id]
	}),
}));

export const auditRelations = relations(audit, ({one}) => ({
	organization: one(organization, {
		fields: [audit.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [audit.userId],
		references: [user.id]
	}),
}));