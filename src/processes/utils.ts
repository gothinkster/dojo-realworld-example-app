export function getHeaders(token?: string): any {
	const headers: { [key: string]: string } = {
		'Content-Type': 'application/json'
	};
	if (token) {
		headers['Authorization'] = `Token ${token}`;
	}
	return headers;
}
