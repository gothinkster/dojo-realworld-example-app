import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { commandFactory } from './utils';

const getTagsCommand = commandFactory(async ({ path }) => {
	const response = await fetch(`https://conduit.productionready.io/api/tags`);
	const json = await response.json();

	return [replace(path('tags'), json.tags)];
});

export const getTags = createProcess([getTagsCommand]);
