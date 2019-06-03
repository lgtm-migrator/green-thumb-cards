import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pickCards } from '../reducers/deckReducer';
import { addCards, addItem, removeCard, removeItem } from '../reducers/playerReducer';
import { startTurn, startSelectCard } from '../reducers/turnReducer';
import { throwToStreet } from '../reducers/streetReducer';
import Hand from './Hand';
import Neighborhood from './Neighborhood';
import './GameBoard.css';

const GameBoard = (props) => {
    const CARDS_AT_START = 5;
    const [ pointerX, setPointerX ] = useState(null);
    const [ pointerY, setPointerY ] = useState(null);

    const mouseMoveHandler = (evt) => {
        setPointerX(evt.clientX - 20);
        setPointerY(evt.clientY - 20);
    };

    /**
     * The game begins. Pick the starting hand for each player.
     * Start turn for player 1.
     */
    const startGame = () => {
        pickCardsFor('bunny1', CARDS_AT_START);
        pickCardsFor('bunny2', CARDS_AT_START);
        pickCardsFor('bunny3', CARDS_AT_START);
        pickCardsFor('bunny4', CARDS_AT_START);
        startTurn('bunny1');
    };

    /**
     * Pick n cards for the given player.
     * @param {String} playerId 
     * @param {Number} proposedCount 
     */
    const pickCardsFor = (playerId, proposedCount) => {
        const count = proposedCount > props.deck.length ? props.deck.length : proposedCount;
        props.pickCards(count, (state) => {
            const picked = state.deck.slice(0, count);
            props.addCards(playerId, picked);
        });
    };

    /**
     * Start turn for the given player.
     * @param {String} playerId 
     */
    const startTurn = (playerId) => {
        props.startTurn(playerId);
        console.log(`${props.players[playerId].name}'s turn starts!`);
        if (props.players[playerId].hand.length < 6) {
            pickCardsFor(playerId, 1);
        }
        doDisasters(playerId, props.players[playerId].hand);
        if (playerId === 'bunny1') props.startSelectCard();
        else runAI(playerId);
    };

    const doDisasters = (playerId, cards) => {
        const disasterCards = cards.filter(card => card.category === 'disaster');
        disasterCards.forEach(disaster => {
            console.log(`*** Disaster event! ${disaster.title}`);
            Object.entries(props.players).forEach(([id, player]) => {
                const plants = player.garden.filter(card => card.category === 'plant');
                const item = plants[Math.floor(Math.random()*plants.length)];
                if (item) {
                    props.removeItem(id, item.id);
                    console.log(`${player.name} lost "${item.title}"`);
                    props.throwToStreet(item);
                }
            });
            props.removeCard(playerId, disaster.id);
            pickCardsFor(playerId, 1);
        });
    };

    const placeItem = (evt) => {
        const containerBounds = evt.target.getBoundingClientRect();
        const x = evt.clientX - containerBounds.x - 20;
        const y = evt.clientY - containerBounds.y - 20;
        props.addItem('bunny1', {
            ...props.turn.card,
            top: Math.floor(y / containerBounds.height * 100),
            left: Math.floor(x / containerBounds.width * 100)
        });
        props.turn.callback();
        endTurn('bunny1');
    };

    const runAI = (playerId) => {
        const playerName = props.players[playerId].name;
        const playableCards = props.players[playerId].hand
            .filter(card => card.category === 'plant');
        const card = playableCards[Math.floor(Math.random()*playableCards.length)];
        if (card) {
            console.log(`${playerName} plays a "${card.title}"`);
            props.addItem(playerId, {
                ...card,
                top: Math.floor(Math.random() * 90),
                left: Math.floor(Math.random() * 90)
            });
            props.removeCard(playerId, card.id);
        } else {
            console.log(`${playerName} skips their turn`);
        }
        endTurn(playerId);
    };

    /**
     * Start turn for the next player.
     * @param {String} playerId 
     */
    const endTurn = (playerId) => {
        const playerIds = Object.keys(props.players);
        const playerIdx = playerIds.indexOf(playerId);
        const nextPlayerIdx = playerIdx === playerIds.length - 1 ? 0 : playerIdx + 1;
        startTurn(playerIds[nextPlayerIdx]);
    };

    if (props.turn.mode === 'start_game') startGame();

    const insertOn = props.turn.mode === 'insert';
    const canPlaceItem = insertOn && props.pointer === 'insertable';

    return (
        <div className="gameboard"
            onMouseMove={mouseMoveHandler}
            onMouseDown={canPlaceItem ? placeItem : undefined}>
            <div className="hand-container">
                <Hand />
            </div>
            <div className="neighborhood-container">
                <Neighborhood />
            </div>
            {
                insertOn &&
                <div className={'item-placer ' + props.pointer} style={{
                    left: pointerX,
                    top: pointerY
                }}></div>
            }
        </div>
    );
};

GameBoard.propTypes = {
    deck: PropTypes.array.isRequired,
    turn: PropTypes.object.isRequired,
    players: PropTypes.object.isRequired,
    pointer: PropTypes.string,
    addItem: PropTypes.func.isRequired,
    pickCards: PropTypes.func.isRequired,
    addCards: PropTypes.func.isRequired,
    startTurn: PropTypes.func.isRequired,
    startSelectCard: PropTypes.func.isRequired,
    removeCard: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    throwToStreet: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        deck: state.deck,
        players: state.players,
        turn: state.turn,
        pointer: state.pointer
    };
};

const mapDispatchToProps = {
    addItem,
    pickCards,
    addCards,
    startTurn,
    startSelectCard,
    removeCard,
    removeItem,
    throwToStreet
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);