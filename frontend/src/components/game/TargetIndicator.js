import React from 'react';
import PropTypes from 'prop-types';
import Xarrow from 'react-xarrows';
import { createUseStyles } from 'react-jss';

const useOrderBubbleStyles = createUseStyles({
    container: {
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 20,
        color: 'white',
        display: 'flex',
        fontSize: 20,
        justifyContent: 'center',
        height: 30,
        width: 30,
        zIndex: 9999
    }
});

/**
 * @param {number} order - The order of the TargetIndicator
 * @returns {JSX.Element}
 * @constructor
 */
const OrderBubble = ({ order }) => {
    const classes = useOrderBubbleStyles();

    return (
        <div className={classes.container}>
            {order}
        </div>
    );
};

OrderBubble.propTypes = {
    order: PropTypes.number.isRequired
};

/**
 * @param {boolean} isEnemy - If targeting an enemy render a red arrow, otherwise green
 * @param {ref} startRef - Component ref for where the arrow should start from
 * @param {ref} endRef - Component ref for where the arrow should be pointing
 * @returns {JSX.Element}
 * @constructor
 */
const TargetIndicator = ({ isEnemy, startRef, endRef, order }) => (
    <Xarrow
        curveness={0}
        zIndex={999}
        color={isEnemy ? 'red' : 'green'}
        start={startRef}
        end={endRef}
        startAnchor="top"
        endAnchor="bottom"
        labels={{ start: <OrderBubble order={order} /> }}
    />
);

TargetIndicator.propTypes = {
    isEnemy: PropTypes.bool.isRequired,
    startRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    endRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    order: PropTypes.number.isRequired
};

export default TargetIndicator;
