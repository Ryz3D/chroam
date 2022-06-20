import React from 'react';
import * as mui from '@mui/material';
import routerNavigate from '../wrapper/routerNavigate';
import NotFoundPage from './notFound';
import ChroamData from '../data/chroamData';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            user: params.get('u'),
        };
        if (this.state.user) {
            ChroamData.user.id = this.state.user;
            setTimeout(() => this.props.navigate('/'), 10);
        }
    }

    render() {
        if (!this.state.user) {
            return <NotFoundPage />;
        }
        else {
            return (
                <div>
                    <mui.Typography variant='h4'>
                        Logged in as {this.state.user}...
                    </mui.Typography>
                    <mui.Button variant='contained' onClick={() => this.props.navigate('/')}>
                        Go home
                    </mui.Button>
                </div>
            );
        }
    }
}

export default routerNavigate(LoginPage);
