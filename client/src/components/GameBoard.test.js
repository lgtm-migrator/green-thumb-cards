import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import GameBoard from './GameBoard';
import GameMaster from '../logic/GameMaster';

afterEach(cleanup);

describe('GameBoard', () => {

    const mockStore = configureMockStore([thunk]);

    const props = {
        gameMaster: new GameMaster(),
    };

    const state = {
        deck: [],
        players: {
            bunny1: { name: 'Bunny 1', hand: [{ id: 1, title: 'Foobar', category: 'plant' }], garden: [] },
            bunny2: { name: 'Bunny 2', hand: [], garden: [] },
            bunny3: { name: 'Bunny 3', hand: [], garden: [] },
            bunny4: { name: 'Bunny 4', hand: [], garden: [] }
        },
        street: { top: [], center: [], bottom: [] },
        turn: { mode: 'start_game', callback: () => {} }
    };

    it('should handle the game preparation', () => {
        const store = mockStore(() => state);
        render(<Provider store={store} ><GameBoard {...props } /></Provider>);
    });

    it('should handle drawing a plant card and placing it', () => {
        const store = mockStore(() => state);
        const component = render(<Provider store={store} ><GameBoard {...props } /></Provider>);

        fireEvent.click(component.container.querySelector('.card'));

        fireEvent.mouseMove(component.container.querySelector('.gameboard'));
        
        fireEvent.mouseDown(component.container.querySelector('.garden'), {
            target: {
                getBoundingClientRect: () => {
                    return { x: 100, y: 300, height: 400, width: 400 };
                }
            },
            clientX: 550,
            clientY: 500
        });
    });
});