import { Outlet } from '@dojo/routing/Outlet';

const mapParams = ({ params, type }: any) => {
	return {
		username: params.username,
		type: type === 'index' ? 'user' : 'favorites'
	};
};

export const ProfileOutlet = Outlet('profile', 'user', { mapParams });
