import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const changeRouteCommand = commandFactory(({ path, get, payload: [newRoute] }): PatchOperation[] => {
	return [replace(path('route'), newRoute)];
});

export const changeRouteProcess = createProcess([changeRouteCommand]);
