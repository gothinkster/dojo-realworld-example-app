import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import session from '../session';
import routing from '../routing';

interface SettingState {
	settings: any;
}

const icache = createICacheMiddleware<SettingState>();

const factory = create({ session, routing, icache }).properties<{ onLogout: () => void }>();

export const Settings = factory(function Settings({ properties, middleware: { session, routing, icache } }) {
    const { onLogout } = properties();
    const settings = icache.getOrSet('settings', session.get());
    if (!settings) {
        routing.goto('login');
        return null;
    }

	return (
		<div classes={['editor-page']}>
			<div classes={['container', 'page']}>
				<div classes={['row']}>
					<div classes={['col-md-10', 'offset-md-1', 'col-xs-12']}>
						<h1 classes={['text-xs-center']}>Your Settings</h1>
						<form>
							<fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={settings.image}
										oninput={(event: KeyboardEvent) => {
                                            const target = event.target as HTMLInputElement;
                                            icache.set('settings', { ...icache.get('settings'), imageUrl: target.value });
										}}
										placeholder=""
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={settings.username}
										oninput={(event: KeyboardEvent) => {
											const target = event.target as HTMLInputElement;
											icache.set('settings', { ...icache.get('settings'), username: target.value });
										}}
										placeholder="Your Name"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<textarea
										rows={8}
										value={settings.bio}
										oninput={(event: KeyboardEvent) => {
                                            const target = event.target as HTMLTextAreaElement;
                                            icache.set('settings', { ...icache.get('settings'), bio: target.value });
										}}
										placeholder="Short bio about you"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={settings.email}
										oninput={(event: KeyboardEvent) => {
                                            const target = event.target as HTMLInputElement;
                                            icache.set('settings', { ...icache.get('settings'), email: target.value });
										}}
										placeholder="Email"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={settings.password}
										type="password"
										oninput={(event: KeyboardEvent) => {
                                            const target = event.target as HTMLInputElement;
                                            icache.set('settings', { ...icache.get('settings'), password: target.value });
										}}
										placeholder="Password"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<button
									onclick={(event: MouseEvent) => {
                                        event.preventDefault();
                                        session.set(icache.get('settings'));
									}}
									type="submit"
									classes={['btn', 'btn-lg', 'btn-primary', 'pull-xs-right']}
								>
									Update Settings
								</button>
							</fieldset>
						</form>
						<hr />
						<button
							onclick={() => {
                                session.remove();
                                onLogout();
                                routing.goto('home');
							}}
							classes={['btn', 'btn-outline-danger']}
						>
							Or click here to logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Settings;
