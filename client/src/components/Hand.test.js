import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, cleanup, fireEvent } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import Hand from './Hand';

afterEach(cleanup);

describe('Hand', () => {

    const mockStore = configureMockStore([thunk]);

    it('should handle playing a card', () => {
        const state = {
            turn: { mode: 'select_action' },
            deck: [],
            players: {
                bunny1: { name: 'Bunny 1', hand: [
                    { id: 1, name: 'foobar', title: 'Foobar', category: 'plant' },
                    { id: 2, name: 'fizzbuzz', title: 'Fizzbuzz', category: 'plant' }
                ], garden: [] },
                bunny2: { name: 'Bunny 2', hand: [], garden: [] },
                bunny3: { name: 'Bunny 3', hand: [], garden: [] },
                bunny4: { name: 'Bunny 4', hand: [], garden: [] }
            }
        };
        const store = mockStore(() => state);
        const component = render(<Provider store={store}><Hand pickCard={() => {}}/></Provider>);

        const card = component.container.querySelector('.card');
        fireEvent.click(card);
    });

    it('should handle picking a card', () => {
        const state = {
            turn: { mode: 'pick_card' },
            deck: [],
            players: {
                bunny1: { name: 'Bunny 1', hand: [], garden: [] },
                bunny2: { name: 'Bunny 2', hand: [], garden: [] },
                bunny3: { name: 'Bunny 3', hand: [], garden: [] },
                bunny4: { name: 'Bunny 4', hand: [], garden: [] }
            }
        };
        const store = mockStore(() => state);
        const component = render(<Provider store={store}><Hand pickCard={() => {}}/></Provider>);

        const deck = component.container.querySelector('.deck .card');
        fireEvent.click(deck);
    });

    it('should emphasize the active card', () => {
        const state = {
            turn: { mode: 'insert', card: { id: 1 } },
            deck: [],
            players: {
                bunny1: { name: 'Bunny 1', hand: [{ id: 1 }], garden: [] },
                bunny2: { name: 'Bunny 2', hand: [], garden: [] },
                bunny3: { name: 'Bunny 3', hand: [], garden: [] },
                bunny4: { name: 'Bunny 4', hand: [], garden: [] }
            }
        };
        const store = mockStore(() => state);
        const component = render(<Provider store={store}><Hand pickCard={() => {}}/></Provider>);

        expect(component.container.querySelector('.active')).toBeDefined();
    });

});