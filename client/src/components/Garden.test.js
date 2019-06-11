import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, cleanup, fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import Garden from './Garden';

afterEach(cleanup);

describe('Garden', () => {

    const mockStore = configureMockStore([thunk]);

    const baseState = {
        deck: [],
        players: {
            bunny1: { name: 'Bunny 1', hand: [], garden: [] },
            bunny2: { name: 'Bunny 2', hand: [], garden: [
                { id: 1, name: 'foobar', title: 'Foobar' },
                { id: 2, name: 'flower', title: 'Flower' },
                { id: 3, name: 'fizzbuzz', title: 'Fizzbuzz' }
            ] },
            bunny3: { name: 'Bunny 3', hand: [], garden: [] },
            bunny4: { name: 'Bunny 4', hand: [], garden: [] }
        }
    };

    it('should display the items in garden', () => {
        const state = {
            ...baseState,
            turn: { mode: 'insert', callback: () => {} },
            pointer: 'insertable'
        };
        const store = mockStore(() => state);

        render(<Provider store={store}><Garden playerId={'bunny2'} /></Provider>);
    });

    it('should handle stealing of item', () => {
        const state = {
            ...baseState,
            turn: { mode: 'attack', card: { id: 666 }, callback: () => {} },
            pointer: 'attackable'
        };
        const store = mockStore(() => state);

        const component = render(<Provider store={store}><Garden playerId={'bunny2'} /></Provider>);
        const foobar = component.container.querySelector('.garden-item');
        fireEvent.click(foobar);
    });

});