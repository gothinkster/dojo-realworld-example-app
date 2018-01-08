import { createCommandFactory, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { replace } from '@dojo/stores/state/operations';

const commandFactory = createCommandFactory<any>();

const changeRouteCommand = commandFactory(({ path, get, payload: [outlet] }): PatchOperation[] => {
	const previousOutlet = get(path('routing', 'outlet'));
	return [replace(path('routing', 'outlet'), outlet), replace(path('routing', 'previousOutlet'), previousOutlet)];
});

export const changeRouteProcess = createProcess([changeRouteCommand]);
