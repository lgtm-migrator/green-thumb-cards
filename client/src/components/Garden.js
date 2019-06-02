import React from 'react';
import PropTypes from 'prop-types';
import './Garden.css';

const Garden = ({ player }) => {
    return (
        <div className="garden">
            {
                player.garden.map(item =>
                    <div key={item.id} className="garden-item" style={{
                        zIndex: item.zIndex,
                        top: item.top + '%',
                        left: item.left + '%'
                    }}>
                        {item.id}
                    </div>
                )
            }
        </div>
    );
};

Garden.propTypes = {
    player: PropTypes.object.isRequired
};

export default Garden;