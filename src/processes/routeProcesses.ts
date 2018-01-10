import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';
import { State } from '../interfaces';

const commandFactory = createCommandFactory<State>();

const changeRouteCommand = commandFactory(({ path, get, payload: [outlet] }): PatchOperation[] => {
	return [
		replace(path('routing', 'outlet'), outlet),
		replace(path('settings', 'loaded'), false),
		replace(path('profile', 'loaded'), false),
		replace(path('feed', 'loaded'), false),
		replace(path('feed', 'category'), outlet !== 'home' ? undefined : get(path('feed', 'category'))),
		replace(path('editor', 'loaded'), false),
		replace(path('errors'), {})
	];
});

export const changeRouteProcess = createProcess([changeRouteCommand]);
