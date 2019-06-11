import AI from './AI';

describe('AI', () => {

    const mockFuncs = { endTurn: jest.fn() };
    const endTurnSpy = jest.spyOn(mockFuncs, 'endTurn');

    const ai = new AI({
        endTurn: mockFuncs.endTurn,
        drawCardsFor: (param1, param2, param3, callback) => callback([]) 
    });

    const props = {
        playerId: 'bunny1',
        players: {
            bunny1: { name: 'Bunny 1', hand: [], garden: [] },
            bunny2: { name: 'Bunny 2', hand: [], garden: [] },
            bunny3: { name: 'Bunny 3', hand: [], garden: [] },
            bunny4: { name: 'Bunny 4', hand: [], garden: [] }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should skip the turn if there is nothing to do', () => {
        ai.playTurn(props);
        expect(endTurnSpy).toHaveBeenCalledTimes(1);
    });

    it('should place a plant to garden', () => {
        const privProps = { ...props };
        addCard(privProps, 'bunny1', { id: 1, title: 'Plant', category: 'plant' });
        ai.playTurn(privProps);
        expect(endTurnSpy).toHaveBeenCalledTimes(1);
    });

    it('should place an environment item to garden', () => {
        const privProps = { ...props };
        addItem(privProps, 'bunny1', { id: 1, title: 'Env', category: 'environment' });
        ai.playTurn(privProps);
        expect(endTurnSpy).toHaveBeenCalledTimes(1);
    });

    it('should steal something', () => {
        const privProps = { ...props };
        addCard(privProps, 'bunny1', { id: 1, title: 'Attac', category: 'attack' });
        addCard(privProps, 'bunny2', { id: 2, title: 'Haul', category: 'plant' });
        ai.playTurn(privProps);
        expect(endTurnSpy).toHaveBeenCalledTimes(1);
    });

    const addCard = (props, playerId, card) => {
        props.players[playerId].hand = props.players[playerId].hand.concat(card);
        return props;
    };

    const addItem = (props, playerId, item) => {
        props.players[playerId].garden = props.players[playerId].garden.concat(item);
        return props;
    };

});