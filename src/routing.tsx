import { create } from '@dojo/framework/core/vdom';
import injector from '@dojo/framework/core/middleware/injector';
import { Router } from '@dojo/framework/routing/Router';
import { Params } from '@dojo/framework/routing/interfaces';

const factory = create({ injector });

export default factory(function routing({ middleware: { injector } }) {
	const router = injector.get<Router>('router');
	return {
		goto: (outlet: string, params: Params = {}) => {
			if (router) {
				const link = router.link(outlet, params);
				if (link) {
					router.setPath(link);
				}
			}
		}
	};
});
