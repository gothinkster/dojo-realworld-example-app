import { create, tsx } from '@dojo/framework/core/vdom';
import { Link } from '@dojo/framework/routing/Link';

interface ArticleAuthorControlsProperties {
	slug: string;
	deleteArticle: () => void;
}

const factory = create({}).properties<ArticleAuthorControlsProperties>();

export const ArticleAuthorControls = factory(function ArticleAuthorControls({ properties }) {
	const { slug, deleteArticle } = properties();
	return (
		<span>
			<Link to="editor" params={{ slug }} classes={['btn', 'btn-sm', 'btn-outline-secondary']}>
				<i classes={['ion-edit']} /> Edit Article
			</Link>
			<button
				classes={['btn', 'btn-sm', 'btn-outline-danger']}
				onclick={() => {
					deleteArticle();
				}}
			>
				<i classes={['ion-trash-a']} /> Delete Article
			</button>
		</span>
	);
});

export default ArticleAuthorControls;
