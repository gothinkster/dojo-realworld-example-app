import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const emailInputCommand = commandFactory(({ payload: [username], path }) => {
	return [replace(path('settings', 'email'), username)];
});

const passwordInputCommand = commandFactory(({ payload: [password], path }) => {
	return [replace(path('settings', 'password'), password)];
});

const usernameInputCommand = commandFactory(({ payload: [username], path }) => {
	return [replace(path('settings', 'username'), username)];
});

const bioInputCommand = commandFactory(({ payload: [bio], path }) => {
	return [replace(path('settings', 'bio'), bio)];
});

const imageUrlInputCommand = commandFactory(({ payload: [imageUrl], path }) => {
	return [replace(path('settings', 'imageUrl'), imageUrl)];
});

const startUserSettingsCommand = commandFactory(({ path, get }) => {
	return [replace(path('settings'), { loaded: false, loading: true })];
});

const getUserSettingsCommand = commandFactory(async ({ path, get }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	const response = await fetch(`https://conduit.productionready.io/api/user`, { headers });

	const json = await response.json();
	const settings = {
		...json.user,
		loaded: true,
		loading: false
	};

	return [replace(path('settings'), settings)];
});

const updateUserSettingsCommand = commandFactory(async ({ path, get }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	const requestPayload: any = {
		imageUrl: get(path('settings', 'imageUrl')),
		bio: get(path('settings', 'bio')),
		username: get(path('settings', 'username')),
		email: get(path('settings', 'email'))
	};
	const password = get(path('settings', 'password'));
	if (password) {
		requestPayload.password = password;
	}
	const response = await fetch(`https://conduit.productionready.io/api/user`, {
		method: 'put',
		headers,
		body: JSON.stringify(requestPayload)
	});

	const json = await response.json();
	const session = {
		...get(path('session')),
		...json.user
	};

	return [
		replace(path('session'), session),
		replace(path('settings'), { loaded: false, loading: false }),
		replace(path('routing', 'outlet'), 'user'),
		replace(path('profile'), undefined),
		replace(path('routing', 'params'), { id: get(path('settings', 'username')) })
	];
});

export const getUserSettings = createProcess([startUserSettingsCommand, getUserSettingsCommand]);
export const updateUserSettings = createProcess([updateUserSettingsCommand]);
export const usernameInput = createProcess([usernameInputCommand]);
export const emailInput = createProcess([emailInputCommand]);
export const passwordInput = createProcess([passwordInputCommand]);
export const bioInput = createProcess([bioInputCommand]);
export const imageUrlInput = createProcess([imageUrlInputCommand]);
