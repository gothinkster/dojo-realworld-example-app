import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { w } from '@dojo/widget-core/d';

import { HeaderContainer } from './containers/HeaderContainer';
import { HomeOutlet } from './outlets/HomeOutlet';
import { LoginOutlet } from './outlets/LoginOutlet';
import { RegisterOutlet } from './outlets/RegisterOutlet';

export class App extends WidgetBase {
	protected render() {
		return [w(HeaderContainer, {}), w(LoginOutlet, {}), w(RegisterOutlet, {}), w(HomeOutlet, {})];
	}
}
