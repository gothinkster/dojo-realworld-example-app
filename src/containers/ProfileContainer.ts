import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Profile, ProfileProperties } from './../widgets/Profile';
import {
	getProfileProcess,
	setArticleTypeProcess,
	getMyArticlesProcess,
	getFavoritedArticlesProcess
} from './../processes/profileProcesses';

function getProperties(store: Store<any>, properties: ProfileProperties): ProfileProperties {
	const { get, path } = store;
	const { articleType } = properties;
	const username = get(path('profile', 'username'));
	const previousArticleType = get(path('profile', 'articleType'));

	// TODO clean this logic up, using loading/loaded
	setArticleTypeProcess(store)(articleType);
	if (username !== properties.username) {
		getProfileProcess(store)(properties.username);
		if (articleType === 'fav') {
			getFavoritedArticlesProcess(store)(properties.username);
		} else {
			getMyArticlesProcess(store)(properties.username);
		}
	} else if (articleType !== previousArticleType) {
		if (articleType === 'fav') {
			getFavoritedArticlesProcess(store)(properties.username);
		} else {
			getMyArticlesProcess(store)(properties.username);
		}
	}
	return {
		bio: get(path('profile', 'bio')),
		username: get(path('profile', 'username')),
		image: get(path('profile', 'image')),
		email: get(path('profile', 'email')),
		articles: get(path('profile', 'articles')),
		articleType: get(path('profile', 'articleType'))
	};
}

export const ProfileContainer = Container(Profile, 'state', { getProperties });
