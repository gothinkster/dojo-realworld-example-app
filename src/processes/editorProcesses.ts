import { createProcess } from '@dojo/stores/process';
import { replace, add, remove } from '@dojo/stores/state/operations';
import { getHeaders, commandFactory } from './utils';

const titleInputCommand = commandFactory<{ title: string }>(({ path, payload: { title } }) => {
	return [replace(path('editor', 'title'), title)];
});

const descriptionInputCommand = commandFactory<{ description: string }>(({ path, payload: { description } }) => {
	return [replace(path('editor', 'description'), description)];
});

const bodyInputCommand = commandFactory<{ body: string }>(({ path, payload: { body } }) => {
	return [replace(path('editor', 'body'), body)];
});

const tagInputCommand = commandFactory<{ tag: string }>(({ path, payload: { tag } }) => {
	return [replace(path('editor', 'tag'), tag)];
});

const addTagCommand = commandFactory<{ tag: string }>(({ get, at, path, payload: { tag } }) => {
	const length = (get(path('editor', 'tagList')) || []).length;
	return [add(at(path('editor', 'tagList'), length), tag)];
});

const clearTagInputCommand = commandFactory(({ path }) => {
	return [replace(path('editor', 'tag'), '')];
});

const removeTagCommand = commandFactory<{ tag: string }>(({ get, at, path, payload: { tag } }) => {
	const tags = get(path('editor', 'tagList'));
	const index = tags.indexOf(tag);
	if (index !== -1) {
		return [remove(at(path('editor', 'tagList'), index))];
	}
	return [];
});

const getArticleForEditorCommand = commandFactory<{ slug: string }>(async ({ path, payload: { slug } }) => {
	const response = await fetch(`https://conduit.productionready.io//api/articles/${slug}`);
	const json = await response.json();
	return [replace(path('editor'), json.article)];
});

const clearEditorCommand = commandFactory(({ path }) => {
	return [replace(path('editor'), {})];
});

const startPublishCommand = commandFactory(({ path }) => {
	return [replace(path('editor', 'loading'), true)];
});

const publishArticleCommand = commandFactory(async ({ get, path }) => {
	const token = get(path('user', 'token'));
	const slug = get(path('editor', 'slug'));
	const requestPayload = {
		article: get(path('editor'))
	};

	const url = slug
		? `https://conduit.productionready.io/api/articles/${slug}`
		: 'https://conduit.productionready.io/api/articles';
	const response = await fetch(url, {
		method: slug ? 'put' : 'post',
		headers: getHeaders(token),
		body: JSON.stringify(requestPayload)
	});
	const json = await response.json();

	if (!response.ok) {
		return [replace(path('editor', 'loading'), false), replace(path('errors'), json.errors)];
	}

	return [
		replace(path('article', 'item'), json.article),
		replace(path('article', 'loaded'), true),
		replace(path('editor'), undefined),
		replace(path('routing', 'outlet'), 'article'),
		replace(path('routing', 'params'), { slug: json.article.slug })
	];
});

export const titleInput = createProcess([titleInputCommand]);
export const descInput = createProcess([descriptionInputCommand]);
export const bodyInput = createProcess([bodyInputCommand]);
export const tagInput = createProcess([tagInputCommand]);
export const addTag = createProcess([addTagCommand, clearTagInputCommand]);
export const removeTag = createProcess([removeTagCommand]);
export const getArticleForEditor = createProcess([getArticleForEditorCommand]);
export const publishArticle = createProcess([startPublishCommand, publishArticleCommand]);
export const clearEditorProcess = createProcess([clearEditorCommand]);
