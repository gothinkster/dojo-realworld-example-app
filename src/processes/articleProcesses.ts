import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const favArticleCommand = commandFactory(async ({ at, get, path, payload: [slug, favorited, type] }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});

	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/favorite`, {
		method: favorited ? 'delete' : 'post',
		headers
	});
	const json = await response.json();

	const articles = get(path(type, 'articles'));
	let index = -1;
	for (let i = 0; i < articles.length; i++) {
		if (articles[i].slug === slug) {
			index = i;
			break;
		}
	}

	if (index !== -1) {
		return [replace(at(path(type, 'articles'), index), json.article)];
	}
	return [];
});

const startLoadingArticleCommand = commandFactory(async ({ path }) => {
	return [
		replace(path('article', 'article'), undefined),
		replace(path('article', 'loading'), true),
		replace(path('article', 'loaded'), false)
	];
});

const loadArticleCommand = commandFactory(async ({ get, path, payload: [slug] }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}`, { headers });
	const json = await response.json();

	return [
		replace(path('article', 'article'), json.article),
		replace(path('article', 'loading'), false),
		replace(path('article', 'loaded'), true)
	];
});

export const favArticle = createProcess([favArticleCommand]);
export const getArticle = createProcess([startLoadingArticleCommand, loadArticleCommand]);
