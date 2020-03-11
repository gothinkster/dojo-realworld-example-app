import { create, tsx } from '@dojo/framework/core/vdom';

import { ArticlePreview } from './ArticlePreview';
import { ArticleItem } from '../interfaces';

interface FeedListProperties {
	type: string;
	articles: ArticleItem[];
}

const factory = create().properties<FeedListProperties>();

export const FeedList = factory(function Tab({ properties }) {
	const { articles } = properties();
	if (articles.length) {
		return (
			<div>
				{articles.map((article) => (
					<ArticlePreview
						key={article.slug}
						article={article}
						favoriteArticle={() => {
							// need this
						}}
					/>
				))}
			</div>
		);
	}

	return <div classes={['article-preview']}>No articles here, yet!</div>;
});

export default FeedList;
