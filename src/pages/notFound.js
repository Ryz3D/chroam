import React from 'react';
import * as mui from '@mui/material';
import { ArrowLeft } from '@mui/icons-material';
import routerNavigate from '../wrapper/routerNavigate';

class NotFoundPage extends React.Component {
    render() {
        return (
            <div>
                <mui.Typography variant='h1'>
                    404
                </mui.Typography>
                <mui.Typography variant='h4'>
                    Not found
                </mui.Typography>
                <mui.Button startIcon={<ArrowLeft />} variant='contained' onClick={() => this.props.navigate('/')}>
                    Fuck go back
                </mui.Button>
            </div>
        );
    }
}

export default routerNavigate(NotFoundPage);
