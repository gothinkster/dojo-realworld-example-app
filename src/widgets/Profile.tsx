import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { Link } from '@dojo/framework/routing/Link';
import { ActiveLink } from '@dojo/framework/routing/ActiveLink';
import FeedList from './FeedList';
import { FeedPagination } from './FeedPagination';
import session from '../session';
import { baseUrl } from '../config';
import { getHeaders } from '../utils';

export interface ProfileProperties {
	username: string;
	type: string;
}

interface ProfileState {
	articles: any;
	profile: any;
	pageNumber: number;
	total: number;
}

const icache = createICacheMiddleware<ProfileState>();

const factory = create({ icache, session })
	.properties<ProfileProperties>()
	.key('username');

export const Profile = factory(function Profile({ middleware: { icache, session }, properties }) {
	const currentUser = session.username();
	const pageNumber = icache.getOrSet('pageNumber', 0);
	const total = icache.getOrSet('total', 0);
	// const isLoading = get(path('profile', 'user', 'isLoading'));
	// const profileUser = get(path('profile', 'user', 'username'));
	// const feed = get(path('profile', 'feed'));
	const { username, type } = properties();

	const articles = icache.getOrSet('articles', async () => {
		let url = `${baseUrl}/articles?`;
		const offset = pageNumber * 10;
		switch (type) {
			case 'favorites':
				url = `${url}favorited=${username}&`;
				break;
			case 'user':
				url = `${url}author=${username}&`;
				break;
		}

		const response = await fetch(`${url}limit=10&offset=${offset}`, { headers: getHeaders(session.token()) });
		const json = await response.json();
		icache.set('total', json.articlesCount);
		return json.articles;
	});

	// if (username !== profileUser && !isLoading) {
	// 	executor(getProfileProcess)({ username, type, page: 0 });
	// 	return null;
	// } else if (type !== feed.category && !feed.isLoading) {
	// 	executor(getProfileFeedProcess)({ username, type, page: 0 });
	// }
	const isCurrentUser = currentUser === username;
	const image = '';
	const bio = '';
	const following = false;

	return (
		<div classes={['profile-page']}>
			<div classes={['user-info']}>
				<div classes={['container']}>
					<div classes={['row']}>
						<div classes={['col-xs-12', 'col-md-10', 'offset-md-1']}>
							<img src={image} classes={['user-img']} />
							<h4>{username}</h4>
							<p>{bio}</p>
							{isCurrentUser ? (
								<Link classes={['btn', 'btn-sm', 'btn-outline-secondary', 'action-btn']} to="settings">
									<i classes={['ion-edit']} />
									{' Edit Profile Settings'}
								</Link>
							) : (
								<button
									onclick={() => {
										// executor(followUserProcess)({
										// 	following,
										// 	username
										// });
									}}
									classes={[
										'btn',
										'btn-sm',
										'action-btn',
										following ? 'btn-secondary' : 'btn-outline-secondary'
									]}
								>
									<i classes={['ion-plus-round']} />
									{following ? ' Unfollow ' : ' Follow '}
									{username}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div classes={['container']}>
				<div classes={['row']}>
					<div classes={['col-xs-12', 'col-md-10', 'offset-md-1']}>
						<div classes={['articles-toggle']}>
							<ul classes={['nav', 'nav-pills', 'outline-active']}>
								<li classes={['nav-item']}>
									<ActiveLink
										to="user"
										classes={['nav-link']}
										params={{ username }}
										activeClasses={['active']}
									>
										My Articles
									</ActiveLink>
								</li>
								<li classes={['nav-item']}>
									<ActiveLink
										to="favorites"
										classes={['nav-link']}
										params={{ username }}
										activeClasses={['active']}
									>
										Favorited Articles
									</ActiveLink>
								</li>
							</ul>
						</div>
						<div classes={['profile-page']}>
							{!articles ? (
								<div classes={['article-preview']}>Loading... </div>
							) : (
								<FeedList type={type} articles={articles} />
							)}
						</div>
						{articles && (
							<FeedPagination
								total={total}
								currentPage={pageNumber}
								fetchFeed={(page: number) => {
									icache.delete('articles');
									icache.set('pageNumber', page);
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

export default Profile;
