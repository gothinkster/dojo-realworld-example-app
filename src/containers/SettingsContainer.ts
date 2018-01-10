import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Settings, SettingsProperties } from './../widgets/Settings';
import {
	bioInput,
	emailInput,
	passwordInput,
	getUserSettings,
	imageUrlInput,
	usernameInput,
	updateUserSettings
} from './../processes/settingsProcesses';
import { logout } from '../processes/loginProcesses';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: SettingsProperties): SettingsProperties {
	const { get, path } = store;

	return {
		email: get(path('settings', 'email')),
		password: get(path('settings', 'password')),
		username: get(path('settings', 'username')),
		imageUrl: get(path('settings', 'image')),
		bio: get(path('settings', 'bio')),
		onEmailInput: emailInput(store),
		onPasswordInput: passwordInput(store),
		onUsernameInput: usernameInput(store),
		onBioInput: bioInput(store),
		onImageUrlInput: imageUrlInput(store),
		onUpdateSettings: updateUserSettings(store),
		getUserSettings: getUserSettings(store),
		logout: logout(store)
	};
}

export const SettingsContainer = Container(Settings, 'state', { getProperties });
