import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';
import { getHeaders } from './utils';

const commandFactory = createCommandFactory<State>();

const startGetProfileCommand = commandFactory(async ({ get, path, payload: [type] }) => {
	return [replace(path('profile', 'loading'), true), replace(path('profile', 'loaded'), false)];
});

const followUserCommand = commandFactory(async ({ at, get, path, payload: [username, following] }) => {
	const token = get(path('user', 'token'));
	const response = await fetch(`https://conduit.productionready.io/api/profiles/${username}/follow`, {
		method: following ? 'delete' : 'post',
		headers: getHeaders(token)
	});
	const json = await response.json();

	return [replace(path('profile'), json.profile)];
});

const getProfileCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<PatchOperation[]> => {
	const token = get(path('user', 'token'));
	const response = await fetch(`https://conduit.productionready.io/api/profiles/${username}`, {
		headers: getHeaders(token)
	});
	const json = await response.json();

	return [
		replace(path('profile', 'image'), json.profile.image),
		replace(path('profile', 'bio'), json.profile.bio),
		replace(path('profile', 'loading'), false),
		replace(path('profile', 'loaded'), true)
	];
});

export const getProfileProcess = createProcess([startGetProfileCommand, getProfileCommand]);
export const followUserProcess = createProcess([followUserCommand]);
