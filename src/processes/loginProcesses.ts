import global from '@dojo/shim/global';
import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

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
	return [replace(path('login', 'inProgress'), true)];
});

const startRegisterCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('register', 'inProgress'), true)];
});

const setSessionCommand = commandFactory(({ path, payload: [session] }): PatchOperation[] => {
	session.isAuthenticated = true;
	return [replace(path('session'), session)];
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
			replace(path('login', 'hasFailed'), true),
			replace(path('login', 'inProgress'), false),
			replace(path('login', 'errors'), buildErrorList(json.errors)),
			replace(path('session', 'isAuthenticated'), false)
		];
	}

	global.sessionStorage.setItem('conduit-session', JSON.stringify(json.user));

	return [
		replace(path('routing', 'outlet'), 'home'),
		replace(path('login', 'inProgress'), false),
		replace(path('login', 'errors'), undefined),
		replace(path('session', 'token'), json.user.token),
		replace(path('session', 'isAuthenticated'), true),
		replace(path('feed', 'articles'), undefined),
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
			replace(path('register', 'hasFailed'), true),
			replace(path('register', 'inProgress'), false),
			replace(path('register', 'errors'), buildErrorList(json.errors)),
			replace(path('session', 'isAuthenticated'), false)
		];
	}

	global.sessionStorage.setItem('conduit-session', JSON.stringify(json.user));

	return [
		replace(path('routing', 'outlet'), 'home'),
		replace(path('register', 'inProgress'), false),
		replace(path('register', 'errors'), undefined),
		replace(path('session', 'token'), json.user.token),
		replace(path('session', 'isAuthenticated'), true),
		replace(path('feed', 'articles'), undefined),
		replace(path('feed', 'loaded'), false)
	];
});

function buildErrorList(errors: { [index: string]: string[] }) {
	const errorCategories = Object.keys(errors);
	let errorList: any[] = [];
	for (let i = 0; i < errorCategories.length; i++) {
		errorList = [...errorList, ...errors[errorCategories[i]].map((error: any) => `${errorCategories[i]} ${error}`)];
	}
	return errorList;
}

export const login = createProcess([startLoginCommand, loginCommand, clearLoginInputs]);
export const register = createProcess([startRegisterCommand, registerCommand, clearRegisterInputs]);
export const loginEmailInput = createProcess([loginEmailInputCommand]);
export const loginPasswordInput = createProcess([loginPasswordInputCommand]);
export const registerEmailInput = createProcess([registerEmailInputCommand]);
export const registerPasswordInput = createProcess([registerPasswordInputCommand]);
export const registerUsernameInput = createProcess([registerUsernameInputCommand]);
export const setSession = createProcess([setSessionCommand]);
