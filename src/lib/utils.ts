export function handleGetAllData(context: string, data: any) {
	const text = [
		`All ${context.toLowerCase()} retrieved successfully.`,
		`Data Size: ${data.length}`,
		JSON.stringify(data, null, 2),
	].join("\n\n");

	return {
		content: [{ type: "text" as const, text }],
		structuredContent: { data },
	};
}

export function handleGetDataById(context: string, id: string, data: any) {
	const text = [
		`${context} with ID: ${id} retrieved successfully.`,
		JSON.stringify(data, null, 2),
	].join("\n\n");

	return {
		content: [{ type: "text" as const, text }],
		structuredContent: data,
	};
}

export function handleCreateData(context: string, data: any) {
	const text = [
		`${context} ${data.id} created successfully.`,
		JSON.stringify(data, null, 2),
	].join("\n\n");

	return {
		content: [{ type: "text" as const, text }],
		structuredContent: data,
	};
}

export function handleUpdateData(context: string, id: string, data: any) {
	const text = [
		`${context} with ID: ${id} updated successfully.`,
		JSON.stringify(data, null, 2),
	].join("\n\n");

	return {
		content: [{ type: "text" as const, text }],
		structuredContent: data,
	};
}

export function handleNoDataFound(context: string, id: string) {
	return {
		content: [
			{
				type: "text" as const,
				text: `No ${context} found with ID: ${id}`,
			},
		],
	};
}

export function handleDeleteData(context: string, id: string) {
	return {
		content: [
			{
				type: "text" as const,
				text: `${context} with ID: ${id} deleted successfully.`,
			},
		],
	};
}

export function handleError(error: unknown, context: string = "") {
	const errorMessage =
		error instanceof Error ? error.message : "An unknown error occurred";
	console.error(`Error${context ? ` in ${context}` : ""}: ${errorMessage}`);

	return {
		content: [{ type: "text" as const, text: `Error: ${errorMessage}` }],
		isError: true,
	};
}
