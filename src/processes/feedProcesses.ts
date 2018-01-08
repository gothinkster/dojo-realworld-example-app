import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const clearArticlesCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('feed', 'articles'), undefined), replace(path('feed', 'loading'), true)];
});

const setGlobalFeedCategoryCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('feed', 'category'), 'global')];
});

const setUserFeedCategoryCommand = commandFactory(({ path }): PatchOperation[] => {
	return [replace(path('feed', 'category'), 'user')];
});

const getGlobalArticlesCommand = commandFactory(async ({ get, path }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/articles`);
	const json = await response.json();

	return [
		replace(path('feed', 'articles'), json.articles),
		replace(path('feed', 'loading'), false),
		replace(path('feed', 'loaded'), true)
	];
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
		replace(path('feed', 'articles'), json.articles),
		replace(path('feed', 'loaded'), true),
		replace(path('feed', 'loading'), false)
	];
});

export const getGlobalArticles = createProcess([
	setGlobalFeedCategoryCommand,
	clearArticlesCommand,
	getGlobalArticlesCommand
]);
export const getFeedArticles = createProcess([
	setUserFeedCategoryCommand,
	clearArticlesCommand,
	getFeedArticlesCommand
]);
