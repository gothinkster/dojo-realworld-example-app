import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import FeedList from './FeedList';
import Tags from './Tags';
import { Banner } from './Banner';
import { FeedPagination } from './FeedPagination';
import { baseUrl } from '../config';
import { getHeaders } from '../utils';
import session from '../session';
import { ArticleItem } from '../interfaces';

interface HomeProperties {
	isAuthenticated: boolean;
	feedType: string;
	onFeedChange: (type: string) => void;
}

interface HomeState {
	articles: ArticleItem[];
	pageNumber: number;
	total: number;
}

const icache = createICacheMiddleware<HomeState>();

const factory = create({ icache, session })
	.properties<HomeProperties>()
	.key('feedType');

export const Home = factory(function Home({ properties, middleware: { icache, session } }) {
	const { isAuthenticated, feedType, onFeedChange } = properties();
	const isTag = ['feed', 'global'].indexOf(feedType) === -1;
	const total = icache.get('total');
	const pageNumber = icache.getOrSet('pageNumber', 0);
	const articles = icache.getOrSet('articles', async () => {
		const { feedType } = properties();
		const pageNumber = icache.getOrSet('pageNumber', 0);
		let url = `${baseUrl}/articles`;
		if (feedType === 'feed') {
			url = `${url}/feed?`;
		} else if (feedType === 'global') {
			url = `${url}/?`;
		} else {
			url = `${url}/?tag=${feedType}&`;
		}
		const response = await fetch(`${url}limit=10&offset=${pageNumber * 10}`, {
			headers: getHeaders(session.token())
		});
		const json = await response.json();
		icache.set('total', json.articlesCount);
		return json.articles || [];
	});

	return (
		<div classes={['home-page']}>
			<Banner />
			<div classes={['container', 'page']}>
				<div classes={['row']}>
					<div classes={['col-md-9']}>
						<div classes={['feed-toggle']}>
							<ul classes={['nav', 'nav-pills', 'outline-active']}>
								{isAuthenticated && (
									<li key="feeds" classes={['nav-item']}>
										<a
											href=""
											onclick={(event: MouseEvent) => {
												event.preventDefault();
												const { onFeedChange } = properties();
												onFeedChange('feed');
											}}
											classes={['nav-link', feedType === 'feed' && 'active']}
										>
											Your Feed
										</a>
									</li>
								)}

								<li key="global" classes={['nav-item']}>
									<a
										href=""
										onclick={(event: MouseEvent) => {
											event.preventDefault();
											const { onFeedChange } = properties();
											onFeedChange('global');
										}}
										classes={['nav-link', feedType === 'global' && 'active']}
									>
										Global Feed
									</a>
								</li>
								{isTag && (
									<li key="tags" classes={['nav-item']}>
										<a classes={['nav-link', 'active']}>{`#${feedType}`}</a>
									</li>
								)}
							</ul>
						</div>
						<div classes={['home-global']}>
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
											article = {
												...article,
												favorited: !article.favorited,
												favoritesCount: article.favorited
													? article.favoritesCount - 1
													: article.favoritesCount + 1
											};
											const updatedArticles = [...articles];
											updatedArticles[articleIndex] = article;
											icache.set('articles', updatedArticles);
										}
									}}
								/>
							)}
						</div>
						{articles && (
							<FeedPagination
								total={total || 0}
								currentPage={pageNumber}
								fetchFeed={(page) => {
									icache.delete('articles');
									icache.set('pageNumber', page);
								}}
							/>
						)}
					</div>
					<Tags onTagSelect={onFeedChange} />
				</div>
			</div>
		</div>
	);
});

export default Home;
