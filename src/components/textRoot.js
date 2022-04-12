import React from 'react';
// import * as mui from '@mui/material';

class TextRootComponent extends React.Component {
    render() {
        const rootStyle = {
            width: '100%',
            marginTop: '5mm',
            paddingLeft: '4mm',
            paddingRight: 'max(25mm, 15vw)',
            overflow: 'auto',
        };

        return (
            <div style={rootStyle}>
                {this.props.children}
            </div>
        );
    }
}

export default TextRootComponent;
