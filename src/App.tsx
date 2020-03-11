import { create, tsx } from '@dojo/framework/core/vdom';
import { Outlet } from '@dojo/framework/routing/Outlet';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import Header from './widgets/Header';
// import Settings from "./widgets/Settings";
import Login from './widgets/Login';
// import Register from "./widgets/Register";
import Profile from './widgets/Profile';
import Editor from './widgets/Editor';
import Article from './widgets/Article';
import Home from './widgets/Home';
import Footer from './widgets/Footer';

import session from './session';

interface AppState {
	feedType: string;
}

const icache = createICacheMiddleware<AppState>();

const factory = create({ icache, session });

export const App = factory(function App({ middleware: { icache, session } }) {
	const isAuthenticated = session.isAuthenticated();
	const feedType = icache.getOrSet('feedType', isAuthenticated ? 'feed' : 'global');
	return (
		<div>
			<Header isAuthenticated={session.isAuthenticated()} username={session.username()} />
			<Outlet
				id="login"
				renderer={() => {
					return (
						<Login
							onLogin={() => {
								icache.set('feedType', 'feed');
							}}
						/>
					);
				}}
			/>
			<Outlet
				id="home"
				renderer={() => {
					return (
						<Home
							feedType={feedType}
							isAuthenticated={isAuthenticated}
							onFeedChange={(type: string) => {
								icache.set('feedType', type);
							}}
						/>
					);
				}}
			/>

			<Outlet
				id="editor"
				renderer={(details) => {
					return <Editor slug={details.params.slug} />;
				}}
			/>
			<Outlet
				id="user"
				renderer={(details) => {
					if (details.isExact()) {
						return <Profile type="user" username={details.params.username} />;
					}
				}}
			/>
			<Outlet
				id="favorites"
				renderer={(details) => <Profile type="favorites" username={details.params.username} />}
			/>
			<Outlet id="article" renderer={(details) => <Article slug={details.params.slug} />} />
			<Footer />
		</div>
	);
});

export default App;
