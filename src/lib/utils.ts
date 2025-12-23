export function handleError(error: unknown, context: string = "") {
	const errorMessage =
		error instanceof Error ? error.message : "An unknown error occurred";
	console.error(`Error${context ? ` in ${context}` : ""}: ${errorMessage}`);

	return {
		content: [{ type: "text" as const, text: `Error: ${errorMessage}` }],
		isError: true,
	};
}

export function handleGetAllData(context: string, data: any) {
	return {
		content: [
			{
				type: "text" as const,
				text: `All ${context.toLowerCase()} retrieved successfully.`,
			},
			{
				type: "text" as const,
				text: `Data Size: ${data.length}`,
			},
			{
				type: "text" as const,
				text: JSON.stringify(data, null, 2),
			},
		],
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

export function handleGetDataById(context: string, id: string, data: any) {
	return {
		content: [
			{
				type: "text" as const,
				text: `${context} with ID: ${id} retrieved successfully.`,
			},
			{
				type: "text" as const,
				text: JSON.stringify(data, null, 2),
			},
		],
	};
}

export function handleCreateData(context: string, data: any) {
	return {
		content: [
			{
				type: "text" as const,
				text: `${context} ${data.id} created successfully.`,
			},
			{ type: "text" as const, text: JSON.stringify(data, null, 2) },
		],
	};
}

export function handleUpdateData(context: string, id: string, data: any) {
	return {
		content: [
			{
				type: "text" as const,
				text: `${context} with ID: ${id} updated successfully.`,
			},
			{
				type: "text" as const,
				text: JSON.stringify(data, null, 2),
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
