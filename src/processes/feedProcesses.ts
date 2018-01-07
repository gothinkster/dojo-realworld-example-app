import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const clearArticlesCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('articles'), undefined)];
});

const getGlobalArticlesCommand = commandFactory(async ({ get, path }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/articles`);
	const json = await response.json();

	return [replace(path('articles'), json.articles), replace(path('feedCategory'), 'global')];
});

const getFeedArticlesCommand = commandFactory(async ({ get, path }): Promise<PatchOperation[]> => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	const response = await fetch(`https://conduit.productionready.io/api/articles/feed`, { headers });
	const json = await response.json();

	return [
		replace(path('view'), json.articles),
		replace(path('articles'), json.articles),
		replace(path('feedCategory'), 'user')
	];
});

const setFeedTypeCommand = commandFactory(({ get, path, payload: [cat] }): PatchOperation[] => {
	return [replace(path('feedCategory'), cat)];
});

export const getGlobalArticles = createProcess([clearArticlesCommand, getGlobalArticlesCommand]);
export const getFeedArticles = createProcess([clearArticlesCommand, getFeedArticlesCommand]);
export const setFeedCategory = createProcess([setFeedTypeCommand]);
