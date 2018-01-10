export function getHeaders(token?: string): any {
	const headers: any = {
		'Content-Type': 'application/json'
	};
	if (token) {
		headers['Authorization'] = `Token ${token}`;
	}
	return headers;
}
