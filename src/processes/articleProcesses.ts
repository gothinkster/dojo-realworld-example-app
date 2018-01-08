import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { remove, replace } from '@dojo/stores/state/operations';

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
		replace(path('article', 'comments'), undefined),
		replace(path('article', 'loading'), true),
		replace(path('article', 'loaded'), false)
	];
});

const loadArticleCommand = commandFactory(async ({ get, path, payload: [slug] }) => {
	const token = get(path('session', 'token'));
	let headers = {};
	if (token) {
		headers = new Headers({
			'Content-Type': 'application/json',
			Authorization: `Token ${token}`
		});
	}
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}`, { headers });
	const json = await response.json();

	return [
		replace(path('article', 'article'), json.article),
		replace(path('article', 'loading'), false),
		replace(path('article', 'loaded'), true)
	];
});

const loadCommentsCommand = commandFactory(async ({ get, path, payload: [slug] }) => {
	const token = get(path('session', 'token'));
	let headers = {};
	if (token) {
		headers = new Headers({
			'Content-Type': 'application/json',
			Authorization: `Token ${token}`
		});
	}
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments`, { headers });
	const json = await response.json();

	return [replace(path('article', 'comments'), json.comments)];
});

const addCommentCommand = commandFactory(async ({ at, get, path, payload: [slug, newComment] }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	const requestPayload = {
		comment: {
			body: newComment
		}
	};
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments`, {
		method: 'post',
		headers,
		body: JSON.stringify(requestPayload)
	});
	const json = await response.json();
	const comments = get(path('article', 'comments'));

	return [
		replace(at(path('article', 'comments'), comments.length), json.comment),
		replace(path('article', 'newComment'), '')
	];
});

const deleteCommentCommand = commandFactory(async ({ at, get, path, payload: [slug, id] }) => {
	const token = get(path('session', 'token'));
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Token ${token}`
	});
	await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments/${id}`, {
		method: 'delete',
		headers
	});
	const comments = get(path('article', 'comments'));
	let index = -1;
	for (let i = 0; i < comments.length; i++) {
		if (comments[i].id === id) {
			index = i;
			break;
		}
	}

	if (index !== -1) {
		return [remove(at(path('article', 'comments'), index))];
	}
	return [];
});

const newCommentInputCommand = commandFactory(({ path, payload: [newComment] }) => {
	return [replace(path('article', 'newComment'), newComment)];
});

export const favArticle = createProcess([favArticleCommand]);
export const getArticle = createProcess([startLoadingArticleCommand, [loadArticleCommand, loadCommentsCommand]]);
export const deleteCommentProcess = createProcess([deleteCommentCommand]);
export const addCommentProcess = createProcess([addCommentCommand]);
export const newCommentInputProcess = createProcess([newCommentInputCommand]);
