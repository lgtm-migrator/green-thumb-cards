import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Deck = (props) => {
    if (props.size > 0) {
        return (
            <div
                className='deck'
                title={props.size + ' cards remaining'}
                onClick={props.canDraw ? props.drawCard : undefined}>
                <div className='card'><div className='card-bg'></div></div>
                <div className='card'><div className='card-bg'></div></div>
                <div className='card'><div className='card-bg'></div></div>
            </div>
        );
    } else {
        return (<div className='deck empty'><div>No cards left!</div></div>);
    }
};

Deck.propTypes = {
    size: PropTypes.number.isRequired,
    canDraw: PropTypes.bool.isRequired,
    drawCard: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        size: state.deck.length
    };
};

export default connect(mapStateToProps)(Deck);