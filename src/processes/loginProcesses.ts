import global from '@dojo/shim/global';
import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';

const commandFactory = createCommandFactory<State>();

const loginEmailInputCommand = commandFactory(({ payload: [username], path }): PatchOperation[] => {
	return [replace(path('login', 'email'), username)];
});

const loginPasswordInputCommand = commandFactory(({ payload: [password], path }): PatchOperation[] => {
	return [replace(path('login', 'password'), password)];
});

const registerEmailInputCommand = commandFactory(({ payload: [username], path }): PatchOperation[] => {
	return [replace(path('register', 'email'), username)];
});

const registerPasswordInputCommand = commandFactory(({ payload: [password], path }): PatchOperation[] => {
	return [replace(path('register', 'password'), password)];
});

const registerUsernameInputCommand = commandFactory(({ payload: [username], path }): PatchOperation[] => {
	return [replace(path('register', 'username'), username)];
});

const clearLoginInputs = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('login', 'password'), ''), replace(path('login', 'email'), '')];
});

const clearRegisterInputs = commandFactory(({ path }): PatchOperation[] => {
	return [
		replace(path('register', 'password'), ''),
		replace(path('register', 'email'), ''),
		replace(path('register', 'username'), '')
	];
});

const startLoginCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('login', 'loading'), true)];
});

const startRegisterCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('register', 'loading'), true)];
});

const setSessionCommand = commandFactory(({ path, payload: [session] }): PatchOperation[] => {
	return [replace(path('user'), session)];
});

const loginCommand = commandFactory(async ({ get, path }): Promise<PatchOperation[]> => {
	const requestPayload = {
		user: {
			email: get(path('login', 'email')),
			password: get(path('login', 'password'))
		}
	};
	const headers = new Headers({
		'Content-Type': 'application/json'
	});

	const response = await fetch('https://conduit.productionready.io/api/users/login', {
		method: 'post',
		body: JSON.stringify(requestPayload),
		headers
	});

	const json = await response.json();
	if (!response.ok) {
		return [
			replace(path('login', 'failed'), true),
			replace(path('login', 'loading'), false),
			replace(path('errors'), json.errors),
			replace(path('user'), {})
		];
	}

	global.sessionStorage.setItem('conduit-session', JSON.stringify(json.user));

	return [
		replace(path('routing', 'outlet'), 'home'),
		replace(path('login', 'loading'), false),
		replace(path('errors'), undefined),
		replace(path('user'), json.user),
		replace(path('feed', 'items'), undefined),
		replace(path('feed', 'loaded'), false)
	];
});

const registerCommand = commandFactory(async ({ get, path }): Promise<PatchOperation[]> => {
	const requestPayload = {
		user: {
			username: get(path('register', 'username')),
			email: get(path('register', 'email')),
			password: get(path('register', 'password'))
		}
	};
	const headers = new Headers({
		'Content-Type': 'application/json'
	});

	const response = await fetch('https://conduit.productionready.io/api/users', {
		method: 'post',
		body: JSON.stringify(requestPayload),
		headers
	});
	const json = await response.json();
	if (!response.ok) {
		return [
			replace(path('register', 'failed'), true),
			replace(path('register', 'loading'), false),
			replace(path('errors'), json.errors),
			replace(path('user'), {})
		];
	}

	global.sessionStorage.setItem('conduit-session', JSON.stringify(json.user));

	return [
		replace(path('routing', 'outlet'), 'home'),
		replace(path('register', 'loading'), false),
		replace(path('errors'), undefined),
		replace(path('user'), json.user),
		replace(path('feed', 'items'), undefined),
		replace(path('feed', 'loaded'), false)
	];
});

const logoutCommand = commandFactory(({ path, payload: [session] }): PatchOperation[] => {
	global.sessionStorage.removeItem('conduit-session');
	return [replace(path('routing', 'outlet'), 'home'), replace(path('user'), {})];
});

export const login = createProcess([startLoginCommand, loginCommand, clearLoginInputs]);
export const register = createProcess([startRegisterCommand, registerCommand, clearRegisterInputs]);
export const loginEmailInput = createProcess([loginEmailInputCommand]);
export const loginPasswordInput = createProcess([loginPasswordInputCommand]);
export const registerEmailInput = createProcess([registerEmailInputCommand]);
export const registerPasswordInput = createProcess([registerPasswordInputCommand]);
export const registerUsernameInput = createProcess([registerUsernameInputCommand]);
export const setSession = createProcess([setSessionCommand]);
export const logout = createProcess([logoutCommand]);
