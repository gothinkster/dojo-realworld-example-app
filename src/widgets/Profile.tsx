import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { Link } from '@dojo/framework/routing/Link';
import { ActiveLink } from '@dojo/framework/routing/ActiveLink';
import FeedList from './FeedList';
import { FeedPagination } from './FeedPagination';
import session from '../session';
import { baseUrl } from '../config';
import { getHeaders } from '../utils';
import { ArticleItem, Profile as ProfileInterface } from '../interfaces';

export interface ProfileProperties {
	username: string;
	type: string;
}

interface ProfileState {
	articles: ArticleItem[];
	profile: ProfileInterface;
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
							<img loading="lazy" src={image} classes={['user-img']} />
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
								<FeedList
									articles={articles}
									favoriteArticle={async (slug) => {
										const articleIndex = articles.findIndex((article) => article.slug === slug);
										let article = articles[articleIndex];
										const response = await fetch(`${baseUrl}/articles/${slug}/favorite`, {
											method: article.favorited ? 'delete' : 'post',
											headers: getHeaders(session.token())
										});
										if (response.ok) {
											const updatedArticles = [...articles];
											if (type === 'user') {
												article = {
													...article,
													favorited: !article.favorited,
													favoritesCount: article.favorited
														? article.favoritesCount - 1
														: article.favoritesCount + 1
												};
												updatedArticles[articleIndex] = article;
											} else {
												updatedArticles.splice(articleIndex, 1);
											}
											icache.set('articles', updatedArticles);
										}
									}}
								/>
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
