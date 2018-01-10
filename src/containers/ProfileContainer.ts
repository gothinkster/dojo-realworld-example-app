import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Profile, ProfileProperties } from './../widgets/Profile';
import { State } from '../interfaces';
import { getProfileProcess, followUserProcess } from './../processes/profileProcesses';

function getProperties(store: Store<State>, properties: ProfileProperties): ProfileProperties {
	const { get, path } = store;

	const loaded = get(path('profile', 'loaded'));
	const loading = get(path('profile', 'loading'));

	if (!loaded && !loading && properties.username !== get(path('profile', 'username'))) {
		getProfileProcess(store)(properties.username as any);
	}

	return {
		username: properties.username,
		type: properties.type,
		image: get(path('profile', 'image')),
		bio: get(path('profile', 'bio')),
		following: get(path('profile', 'following')),
		followUser: followUserProcess(store),
		currentUser: get(path('user', 'username'))
	};
}

export const ProfileContainer = Container(Profile, 'state', { getProperties });
