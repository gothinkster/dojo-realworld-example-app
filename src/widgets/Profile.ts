import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import { FeedsContainer } from '../containers/FeedsContainer';

export interface ProfileProperties {
	username: string;
	bio: string;
	image: string;
	type: string;
}

export class Profile extends WidgetBase<ProfileProperties> {
	protected render() {
		let { username, bio, image, type } = this.properties;

		return v('div', { classes: 'profile-page' }, [
			v('div', { classes: 'user-info' }, [
				v('div', { classes: 'container' }, [
					v('div', { classes: 'row' }, [
						v('div', { classes: ['col-xs-12', 'col-md-10', 'offset-md-1'] }, [
							v('img', { src: image, classes: 'user-img' }),
							v('h4', [username]),
							v('p', [bio]),
							v('button', { classes: ['btn', 'btn-sm', 'btn-outline-secondary', 'action-btn'] }, [
								v('i', { classes: 'ion-plus-round' }),
								` Follow ${username}`
							])
						])
					])
				])
			]),
			v('div', { classes: 'container' }, [v('div', { classes: 'row' }, [w(FeedsContainer, { type, username })])])
		]);
	}
}
