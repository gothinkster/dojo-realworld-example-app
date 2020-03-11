import global from '@dojo/framework/shim/global';
import { create } from '@dojo/framework/core/vdom';

const factory = create();

function getSession() {
	const session = global.sessionStorage.getItem('conduit-session');
	if (session) {
		return JSON.parse(session);
	}
}

export default factory(function session() {
	return {
		get() {
			return getSession();
		},
		set(session: any) {
			global.sessionStorage.setItem('conduit-session', JSON.stringify(session));
		},
		remove() {
			global.sessionStorage.removeItem('conduit-session');
		},
		isAuthenticated() {
			let session = getSession();
			return !!session;
		},
		token() {
			let session = getSession();
			return session ? session.token : undefined;
		},
		username() {
			let session = getSession();
			return session ? session.username : undefined;
		}
	};
});
