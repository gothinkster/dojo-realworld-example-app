import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { State, ArticleItem } from './../interfaces';
import { getHeaders } from './utils';

const commandFactory = createCommandFactory<State>();

function getItemIndex(items: ArticleItem[], id: string) {
	let index = -1;
	for (let i = 0; i < items.length; i++) {
		if (items[i].slug === id) {
			index = i;
			break;
		}
	}
	return index;
}

async function fetchFeed(token: string, offset: number, options: { type: string; filter: string }) {
	const baseUrl = 'https://conduit.productionready.io/api/articles';
	let url: string;
	switch (options.type) {
		case 'feed':
			url = `${baseUrl}/feed?`;
			break;
		case 'favorites':
			url = `${baseUrl}?favorited=${options.filter}&`;
			break;
		case 'user':
			url = `${baseUrl}?author=${options.filter}&`;
			break;
		case 'tag':
			url = `${baseUrl}?tag=${options.filter}&`;
			break;
		default:
			url = `${baseUrl}?`;
			break;
	}

	return await fetch(`${url}limit=10&offset=${offset}`, { headers: getHeaders(token) });
}

export interface FetchFeedParams {
	type: string;
	filter: string;
	page: number;
}

const startFetchingFeedCommand = commandFactory<FetchFeedParams>(async ({ path, payload: { type, filter, page } }) => {
	return [
		replace(path('feed', 'loading'), true),
		replace(path('feed', 'loaded'), false),
		replace(path('feed', 'category'), type),
		replace(path('feed', 'tagName'), type === 'tag' ? filter : undefined),
		replace(path('feed', 'pageNumber'), page)
	];
});

const fetchFeedCommand = commandFactory<FetchFeedParams>(async ({ get, path, payload: { type, page, filter } }) => {
	const token = get(path('user', 'token'));
	const offset = page * 10;
	const response = await fetchFeed(token, offset, { type, filter });
	const json = await response.json();
	return [
		replace(path('feed', 'items'), json.articles),
		replace(path('feed', 'total'), json.articlesCount),
		replace(path('feed', 'offset'), offset),
		replace(path('feed', 'loading'), false),
		replace(path('feed', 'loaded'), true)
	];
});

const favoriteFeedArticleCommand = commandFactory<{ slug: string; favorited: boolean }>(
	async ({ at, get, path, payload: { slug, favorited } }) => {
		const token = get(path('user', 'token'));
		const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/favorite`, {
			method: favorited ? 'delete' : 'post',
			headers: getHeaders(token)
		});
		const json = await response.json();
		const index = getItemIndex(get(path('feed', 'items')), slug);

		if (index !== -1) {
			return [replace(at(path('feed', 'items'), index), json.article)];
		}
		return [];
	}
);

export const fetchFeedProcess = createProcess([startFetchingFeedCommand, fetchFeedCommand]);
export const favoriteFeedArticleProcess = createProcess([favoriteFeedArticleCommand]);
