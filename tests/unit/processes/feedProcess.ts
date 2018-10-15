const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import global from '@dojo/framework/shim/global';
import { stub } from 'sinon';

import { Store } from '@dojo/framework/stores/Store';
import { fetchFeedCommand } from './../../../src/processes/feedProcesses';
import { Pointer } from '@dojo/framework/stores/state/Pointer';
import { OperationType } from '@dojo/framework/stores/state/Patch';

const fetchStub = stub();
global.fetch = fetchStub;

describe('feedProcess', () => {
	beforeEach(() => {
		fetchStub.reset();
	});

	it('fetch feeds', async () => {
		const store = new Store();
		const mockResponse = {
			json: stub().returns({
				articles: [
					{
						id: ''
					}
				],
				articlesCount: 100
			})
		};

		fetchStub
			.withArgs('https://conduit.productionready.io/api/articles/feed?limit=10&offset=10')
			.returns(mockResponse);

		const results = await fetchFeedCommand({
			at: store.at,
			get: store.get,
			path: store.path,
			payload: { type: 'feed', page: 1, filter: '' }
		});
		assert.deepEqual(results, [
			{
				op: OperationType.REPLACE,
				path: new Pointer('feed/items'),
				value: [{ id: '' }]
			},
			{
				op: OperationType.REPLACE,
				path: new Pointer('feed/total'),
				value: 100
			},
			{
				op: OperationType.REPLACE,
				path: new Pointer('feed/offset'),
				value: 10
			},
			{
				op: OperationType.REPLACE,
				path: new Pointer('feed/loading'),
				value: false
			},
			{
				op: OperationType.REPLACE,
				path: new Pointer('feed/loaded'),
				value: true
			}
		]);
	});
});
