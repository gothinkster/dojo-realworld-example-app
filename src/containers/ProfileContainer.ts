import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Profile, ProfileProperties } from './../widgets/Profile';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: ProfileProperties): ProfileProperties {
	const { get, path } = store;

	return {
		bio: get(path('user', 'bio')),
		username: get(path('user', 'username')),
		image: get(path('user', 'image')),
		type: properties.type
	};
}

export const ProfileContainer = Container(Profile, 'state', { getProperties });
