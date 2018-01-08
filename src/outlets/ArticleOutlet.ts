import { Outlet } from '@dojo/routing/Outlet';
import { ArticleContainer } from './../containers/ArticleContainer';

const mapParams = ({ params }: any) => {
	return {
		id: params.id
	};
};

export const ArticleOutlet = Outlet(ArticleContainer, 'article', { mapParams });
