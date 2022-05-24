import React from 'react';
import * as mui from '@mui/material';
import BasicUIComponent from '../components/basicUI';

class SettingsPage extends React.Component {
    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.props.navigate(u)}>
                <div>settings</div>
            </BasicUIComponent>
        );
    }
}

export default SettingsPage;
