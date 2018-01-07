import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Tags } from './../widgets/Tags';

function getProperties(store: Store<any>, properties: any) {
	const { get, path } = store;
	return {
		tags: get(path('tags')) || []
	};
}

export const TagsContainer = Container(Tags, 'state', { getProperties });
