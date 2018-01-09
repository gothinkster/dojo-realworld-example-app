import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { remove, replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';
import { getHeaders } from './utils';

const commandFactory = createCommandFactory<State>();

const startLoadingArticleCommand = commandFactory(async ({ path }) => {
	return [
		replace(path('article', 'item'), undefined),
		replace(path('article', 'comments'), undefined),
		replace(path('article', 'loading'), true),
		replace(path('article', 'loaded'), false)
	];
});

const loadArticleCommand = commandFactory(async ({ get, path, payload: [slug] }) => {
	const token = get(path('user', 'token'));
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}`, {
		headers: getHeaders(token)
	});
	const json = await response.json();

	return [
		replace(path('article', 'item'), json.article),
		replace(path('article', 'loading'), false),
		replace(path('article', 'loaded'), true)
	];
});

const loadCommentsCommand = commandFactory(async ({ get, path, payload: [slug] }) => {
	const token = get(path('user', 'token'));
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments`, {
		headers: getHeaders(token)
	});
	const json = await response.json();

	return [replace(path('article', 'comments'), json.comments)];
});

const addCommentCommand = commandFactory(async ({ at, get, path, payload: [slug, newComment] }) => {
	const token = get(path('user', 'token'));
	const requestPayload = {
		comment: {
			body: newComment
		}
	};
	const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments`, {
		method: 'post',
		headers: getHeaders(token),
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
	const token = get(path('user', 'token'));
	await fetch(`https://conduit.productionready.io/api/articles/${slug}/comments/${id}`, {
		method: 'delete',
		headers: getHeaders(token)
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

export const getArticle = createProcess([startLoadingArticleCommand, [loadArticleCommand, loadCommentsCommand]]);
export const deleteCommentProcess = createProcess([deleteCommentCommand]);
export const addCommentProcess = createProcess([addCommentCommand]);
export const newCommentInputProcess = createProcess([newCommentInputCommand]);
