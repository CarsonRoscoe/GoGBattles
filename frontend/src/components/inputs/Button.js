import React from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';

const useButtonStyles = createUseStyles({
    container: {
        borderColor: 'black',
        borderRadius: 6,
        borderWidth: 2,
        margin: 5,
        overflow: 'hidden',
        padding: 15,
        '&:hover': {
            opacity: 0.9
        },
        '&:active': {
            opacity: 0.7
        }
    },
    text: {
        fontSize: 18
    }
});

const Button = ({ text, color, textColor, onClick }) => {
    const classes = useButtonStyles();

    return (
        <button
            className={classes.container}
            style={{ backgroundColor: color }}
            onClick={onClick}
        >
            <span className={classes.text} style={{ color: textColor }}>
                {text}
            </span>
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Button;
