import { Outlet } from '@dojo/routing/Outlet';
import { EditorContainer } from './../containers/EditorContainer';

const mapParams = ({ params }: any) => {
	return {
		slug: params.slug
	};
};

export const EditorOutlet = Outlet(EditorContainer, 'new-post', { mapParams });
