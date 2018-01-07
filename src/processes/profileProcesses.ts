import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const clearProfileArticlesCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<
	PatchOperation[]
> => {
	return [replace(path('profile', 'articles'), undefined)];
});

const setUserNameCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<PatchOperation[]> => {
	return [replace(path('profile', 'username'), username)];
});

const getProfileCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/profiles/${username}`);
	const json = await response.json();

	return [
		replace(path('profile', 'image'), json.profile.image),
		replace(path('profile', 'bio'), json.profile.bio),
		replace(path('profile', 'email'), json.profile.email)
	];
});

const getMyArticlesCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/articles?author=${username}`);
	const json = await response.json();

	return [replace(path('profile', 'articles'), json.articles)];
});

const setArticleTypeCommand = commandFactory(({ get, path, payload: [articleType] }): PatchOperation[] => {
	return [replace(path('profile', 'articleType'), articleType)];
});

const getFavoritedCommand = commandFactory(async ({ get, path, payload: [username] }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/articles?favorited=${username}`);
	const json = await response.json();

	return [replace(path('profile', 'articles'), json.articles)];
});

export const setArticleTypeProcess = createProcess([setArticleTypeCommand]);
export const getProfileProcess = createProcess([clearProfileArticlesCommand, setUserNameCommand, getProfileCommand]);
export const getMyArticlesProcess = createProcess([clearProfileArticlesCommand, getMyArticlesCommand]);
export const getFavoritedArticlesProcess = createProcess([clearProfileArticlesCommand, getFavoritedCommand]);
