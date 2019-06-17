import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, cleanup, fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { masterMiddleware } from '../middlewares/masterMiddleware';
import Garden from './Garden';
import { mockState, mockPlants, mockAttacks } from '../test-utils';

afterEach(cleanup);

describe('Garden', () => {

    const mockStore = configureMockStore([thunk, masterMiddleware]);

    it('should display the items in garden', () => {
        const state = {
            ...mockState,
            turn: { ...mockState.turn, mode: 'insert' },
            pointer: 'insertable'
        };
        state.players.bunny1.garden = mockState.players.bunny1.garden.concat(mockPlants);
        const store = mockStore(() => state);

        render(<Provider store={store}><Garden playerId={'bunny2'} /></Provider>);
    });

    it('should handle stealing of a plant', () => {
        const state = {
            ...mockState,
            turn: { ...mockState.turn, mode: 'attack', card: mockAttacks[0] },
            pointer: 'attackable'
        };
        state.players.bunny2.garden = mockState.players.bunny2.garden.concat(mockPlants);
        const store = mockStore(() => state);

        const component = render(<Provider store={store}><Garden playerId={'bunny2'} /></Provider>);
        const plant = component.container.querySelector('#bunny2-garden .garden-item');
        fireEvent.click(plant);

        expect(store.getActions()[0]).toEqual({
            type: 'REMOVE_CARD', data: { playerId: 'bunny1', cardId: mockAttacks[0].id }
        });
    });

    it('should handle mouseenter and mouseleave', () => {
        const state = {
            ...mockState,
            turn: { ...mockState.turn, mode: 'foobar' }
        };
        const store = mockStore(() => state);
        const component = render(<Provider store={store}><Garden playerId={'bunny1'} /></Provider>);

        fireEvent.mouseEnter(component.container.querySelector('.garden'));
        fireEvent.mouseLeave(component.container.querySelector('.garden'));

        expect(store.getActions()).toEqual([
            { type: 'SET_POINTER', data: 'insertable' },
            { type: 'SET_POINTER', data: null }
        ]);
    });

});