import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Header } from './../widgets/Header';

function getProperties(store: Store, properties: any) {
	const { get, path } = store;
	return {
		route: get(path('routing', 'outlet')),
		isAuthenticated: get(path('session', 'isAuthenticated')),
		loggedInUser: get(path('session', 'username'))
	};
}

export const HeaderContainer = Container(Header, 'state', { getProperties });
