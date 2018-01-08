import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params }: any) => {
	return {
		id: params.id
	};
};

export const ArticleOutlet = Outlet('article', 'article', { mapParams });
