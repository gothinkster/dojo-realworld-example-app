import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params }: any) => {
	return {
		slug: params.slug
	};
};

export const ArticleOutlet = Outlet('article', 'article', { mapParams });
