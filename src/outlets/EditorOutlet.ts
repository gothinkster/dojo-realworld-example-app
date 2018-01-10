import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params }: any) => {
	return {
		slug: params.slug
	};
};

export const EditorNewOutlet = Outlet('editor', 'new-post', { mapParams });
export const EditorEditOutlet = Outlet('editor', 'edit-post', { mapParams });
