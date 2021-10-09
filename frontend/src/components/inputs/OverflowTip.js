import React, { Component } from 'react';
import Tooltip from '@mui/material/Tooltip';

class OverflowTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overflowed: false
        };
        this.textElement = React.createRef();
    }

    componentDidMount () {
        this.setState({
            isOverflowed: this.textElement.current.scrollWidth > this.textElement.current.clientWidth
        });
    }

    render () {
        const { isOverflowed } = this.state;
        return (
            <Tooltip
                title={this.props.children}
                disableHoverListener={!isOverflowed}>
                <div
                    ref={this.textElement}
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                    {this.props.children}
                </div>
            </Tooltip>
        );
    }
};

export default OverflowTip;
