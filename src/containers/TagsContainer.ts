import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Tags } from './../widgets/Tags';
import { fetchFeedProcess } from '../processes/feedProcesses';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: any) {
	const { get, path } = store;
	return {
		tags: get(path('tags')) || [],
		getFeed: fetchFeedProcess(store)
	};
}

export const TagsContainer = Container(Tags, 'state', { getProperties });
