import { create, tsx } from '@dojo/framework/core/vdom';

import { ArticlePreview } from './ArticlePreview';
import { ArticleItem } from '../interfaces';

interface FeedListProperties {
	articles: ArticleItem[];
	favoriteArticle: (slug: string) => Promise<void>;
}

const factory = create().properties<FeedListProperties>();

export const FeedList = factory(function Tab({ properties }) {
	const { articles, favoriteArticle } = properties();
	if (articles.length) {
		return (
			<div>
				{articles.map((article) => (
					<ArticlePreview
						key={article.slug}
						article={article}
						favoriteArticle={() => {
							favoriteArticle(article.slug);
						}}
					/>
				))}
			</div>
		);
	}

	return <div classes={['article-preview']}>No articles here, yet!</div>;
});

export default FeedList;
