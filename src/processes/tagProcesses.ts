import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';

const commandFactory = createCommandFactory<State>();

const getTagsCommand = commandFactory(async ({ get, path, payload: [query] }): Promise<PatchOperation[]> => {
	const response = await fetch(`https://conduit.productionready.io/api/tags`);
	const json = await response.json();

	return [replace(path('tags'), json.tags)];
});

export const getTags = createProcess([getTagsCommand]);
