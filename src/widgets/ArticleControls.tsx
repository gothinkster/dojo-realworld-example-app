import { create, tsx } from '@dojo/framework/core/vdom';

interface ArticleControlsProperties {
	favoritesCount: number;
	authorUsername: string;
	favorited: boolean;
	following: boolean;
	followUser: () => void;
	favoriteArticle: () => void;
}

const factory = create({}).properties<ArticleControlsProperties>();

export const ArticleControls = factory(function ArticleControls({ properties }) {
	const { favoritesCount, favoriteArticle, favorited, following, authorUsername, followUser } = properties();
	return (
		<span>
			<button
				onclick={() => {
					followUser();
				}}
				classes={['btn', 'btn-sm', following ? 'btn-secondary' : 'btn-outline-secondary']}
			>
				<i classes={['ioc-plus-round']} />
				{`${following ? ' Unfollow' : ' Follow'} ${authorUsername}`}
			</button>
			<button
				onclick={() => {
					favoriteArticle();
				}}
				classes={['btn', 'btn-sm', favorited ? 'btn-primary' : 'btn-outline-primary']}
			>
				<i classes={['ion-heart']} />
				{`${favorited ? ' Unfavorite' : ' Favorite'}`}
				<span classes={['counter']}>{`(${favoritesCount})`}</span>
			</button>
		</span>
	);
});

export default ArticleControls;
