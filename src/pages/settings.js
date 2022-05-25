import React from 'react';
// import * as mui from '@mui/material';
import BasicUIComponent from '../components/basicUI';

class SettingsPage extends React.Component {
    render() {
        var keys = [];
        while (keys[keys.length - 1] !== null) {
            keys.push(localStorage.key(keys.length));
        }
        keys.splice(keys.length - 1);
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.props.navigate(u)}>
                <div>
                    {keys.map((k, i) =>
                        <>
                            <div key={i * 2}>
                                {k}
                            </div>
                            <div key={i * 2 + 1}>
                                {JSON.stringify(localStorage.getItem(k))}
                            </div>
                        </>
                    )}
                </div>
            </BasicUIComponent>
        );
    }
}

export default SettingsPage;
