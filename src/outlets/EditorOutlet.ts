import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params }: any) => {
	return {
		slug: params.slug
	};
};

export const EditorOutlet = Outlet('editor', 'new-post', { mapParams });
