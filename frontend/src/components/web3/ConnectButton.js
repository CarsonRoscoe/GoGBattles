import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Textfit } from 'react-textfit';
import { createUseStyles } from 'react-jss';
import web3Helpers from '../../web3Helpers';


let hasConnected = false;

/**
 * @param {boolean} isSelected - If the Card is selected, add a glowing border
 * @param {string} name - Name of the card
 * @param {string} image - URL of the card's Image
 * @param {string} modifier - Modifier to display below the Image
 * @param {string} equipmentType - Card's equipment type
 * @param {string} equipmentClass - Card's equipment class
 * @param {object} stats - Object containing offensive (number[]) and defensive (number[]) stats
 * @param {number} tokenValue - Card's value
 * @param {string} rarityType - Card's rarity type
 * @param {string} size - Size to render the card (sm, md, lg)
 * @param {function} onSelectedCallback - Callback function for when a card is selected/clicked
 * @returns {JSX.Element}
 * @constructor
 */
const ConnectButton = ({
    isSelected,
}) => {
    const HEIGHT = 40;
    const WIDTH = 120;

    return (
        <Button
            onClick={() => {
                web3Helpers.connectAsync().then((e) => {
                    console.info("Connected");
                });
                let web3 = web3Helpers.web3;
                if (web3 != null) {
                    console.info(web3);
                }
            }}
            style={{
                height: HEIGHT + 5,
                minHeight: HEIGHT + 5,
                maxHeight: HEIGHT + 5,
                width: WIDTH + 5,
                minWidth: WIDTH + 5,
                maxWidth: WIDTH + 5,
                background: 'radial-gradient(circle, rgba(255,248,156,1) 0%, rgba(255,238,0,1) 100%)',
                boxShadow: '0 0 20px black'
            }}
        >
            Connect
        </Button>
    );
};

export const cardPropTypes = {
};

ConnectButton.propTypes = cardPropTypes;

ConnectButton.defaultProps = {
    isSelected: false,
    onSelectedCallback: () => undefined
};

export default ConnectButton;
