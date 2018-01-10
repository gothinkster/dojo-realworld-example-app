import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';
import { getHeaders } from './utils';

const commandFactory = createCommandFactory<State>();

const emailInputCommand = commandFactory<{ email: string }>(({ payload: { email }, path }) => {
	return [replace(path('settings', 'email'), email)];
});

const passwordInputCommand = commandFactory<{ password: string }>(({ payload: { password }, path }) => {
	return [replace(path('settings', 'password'), password)];
});

const usernameInputCommand = commandFactory<{ username: string }>(({ payload: { username }, path }) => {
	return [replace(path('settings', 'username'), username)];
});

const bioInputCommand = commandFactory<{ bio: string }>(({ payload: { bio }, path }) => {
	return [replace(path('settings', 'bio'), bio)];
});

const imageUrlInputCommand = commandFactory<{ imageUrl: string }>(({ payload: { imageUrl }, path }) => {
	return [replace(path('settings', 'image'), imageUrl)];
});

const startUserSettingsCommand = commandFactory(({ path }) => {
	return [replace(path('settings'), { loaded: false, loading: true })];
});

const getUserSettingsCommand = commandFactory(async ({ path, get }) => {
	return [replace(path('settings'), get(path('user')))];
});

const updateUserSettingsCommand = commandFactory(async ({ path, get }) => {
	const token = get(path('user', 'token'));
	const requestPayload = get(path('settings'));
	const response = await fetch(`https://conduit.productionready.io/api/user`, {
		method: 'put',
		headers: getHeaders(token),
		body: JSON.stringify(requestPayload)
	});

	const json = await response.json();

	return [
		replace(path('user'), json.user),
		replace(path('settings'), { loaded: false, loading: false }),
		replace(path('routing', 'outlet'), 'user'),
		replace(path('routing', 'params'), { username: get(path('settings', 'username')) })
	];
});

export const getUserSettings = createProcess([startUserSettingsCommand, getUserSettingsCommand]);
export const updateUserSettings = createProcess([updateUserSettingsCommand]);
export const usernameInput = createProcess([usernameInputCommand]);
export const emailInput = createProcess([emailInputCommand]);
export const passwordInput = createProcess([passwordInputCommand]);
export const bioInput = createProcess([bioInputCommand]);
export const imageUrlInput = createProcess([imageUrlInputCommand]);
