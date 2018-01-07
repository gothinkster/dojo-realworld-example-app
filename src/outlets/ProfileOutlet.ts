import { Outlet } from '@dojo/routing/Outlet';
import { ProfileContainer } from './../containers/ProfileContainer';

const mapParams = ({ params, type }: any) => {
	return {
		username: params.id,
		articleType: type === 'index' ? 'my' : 'fav'
	};
};

export const ProfileOutlet = Outlet(ProfileContainer, 'user', { mapParams });
