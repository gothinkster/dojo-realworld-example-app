import { renderer, tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import config from './routes';
import { App } from './App';

export const registry = new Registry();
registerRouterInjector(config, registry);

const r = renderer(() => <App />);
r.mount({ domNode: document.getElementById('app')!, registry });
