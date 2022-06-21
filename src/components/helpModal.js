import React from 'react';
import * as mui from '@mui/material';
import logo from '../img/logo.png';

class HelpModalComponent extends React.Component {
    render() {
        return (
            <mui.Modal open={this.props.open} onClose={this.props.onClose}
                sx={{ margin: '8vh auto', width: '80vw' }}>
                <mui.Card sx={{ width: '80vw', padding: '15px' }}>
                    <img style={{ width: '100%' }} src={logo} alt='CHROAM logo' />
                    <div style={{ height: '2rem' }} />
                    <div>I cannot help you, but I do want to show you this fine logo I've drawn.</div>
                </mui.Card>
            </mui.Modal>
        );
    }
}

export default HelpModalComponent;
