import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params, type }: any) => {
	return {
		username: params.id,
		articleType: type === 'index' ? 'my' : 'fav'
	};
};

export const ProfileOutlet = Outlet('profile', 'user', { mapParams });
