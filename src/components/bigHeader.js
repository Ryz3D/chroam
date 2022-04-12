import React from 'react';
import * as mui from '@mui/material';

class BigHeaderComponent extends React.Component {
    render() {
        const rootStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        };
        const headerStyle = {
            fontFamily: '\'Montserrat\', sans-serif',
            fontSize: '2.8rem',
            fontWeight: 200,
        };
        const endStyle = {
            display: 'flex',
            alignItems: 'center',
        };

        return (
            <div style={rootStyle}>
                <mui.Typography style={headerStyle} variant='h3'>
                    {this.props.header}
                </mui.Typography>
                <div style={endStyle}>
                    {this.props.end}
                </div>
            </div>
        );
    }
}

export default BigHeaderComponent;
