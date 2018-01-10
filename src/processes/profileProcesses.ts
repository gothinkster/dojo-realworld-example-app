import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';
import { getHeaders } from './utils';

const commandFactory = createCommandFactory<State>();

const startGetProfileCommand = commandFactory(async ({ path }) => {
	return [replace(path('profile', 'loading'), true), replace(path('profile', 'loaded'), false)];
});

const followUserCommand = commandFactory<{ username: string; following: boolean }>(
	async ({ get, path, payload: { username, following } }) => {
		const token = get(path('user', 'token'));
		const response = await fetch(`https://conduit.productionready.io/api/profiles/${username}/follow`, {
			method: following ? 'delete' : 'post',
			headers: getHeaders(token)
		});
		const json = await response.json();

		return [replace(path('profile'), json.profile)];
	}
);

const getProfileCommand = commandFactory<{ username: string }>(async ({ get, path, payload: { username } }) => {
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
