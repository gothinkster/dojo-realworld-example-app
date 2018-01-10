import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { OutletContext } from '@dojo/routing/interfaces';
import { commandFactory } from './utils';

const changeRouteCommand = commandFactory<{ outlet: string; context: OutletContext }>(
	({ path, payload: { outlet, context } }) => {
		return [
			replace(path('routing', 'outlet'), outlet),
			replace(path('routing', 'params'), context.params),
			replace(path('settings', 'loaded'), false),
			replace(path('profile', 'loaded'), false),
			replace(path('feed', 'loaded'), false),
			replace(path('feed', 'category'), undefined),
			replace(path('editor', 'loaded'), false),
			replace(path('errors'), {})
		];
	}
);

export const changeRouteProcess = createProcess([changeRouteCommand]);
