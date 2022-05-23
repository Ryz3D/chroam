import React from 'react';
import * as mui from '@mui/material';
import {
    Brightness3,
    Brightness7,
    Forward as ForwardIcon,
    MoreVert as MoreVertIcon,
    Radar as RadarIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import SearchBarComponent from './searchBar';
import windowSize from '../wrapper/windowSize';
import muiTheme from '../wrapper/muiTheme';
import routerNavigate from '../wrapper/routerNavigate';
import ChroamDate from '../data/chroamDate';
import Icons from '../data/icons';

class BasicUIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            menuAnchor: null,
        };
    }

    closeMenu() {
        this.setState({
            menuAnchor: null,
        });
    }

    today() {
        if (this.props.onDaySwitch) {
            this.props.onDaySwitch(new Date());
        }
        else {
            this.props.navigate('/?i=' + ChroamDate.serializeDate(new Date()));
        }
        this.closeMenu();
    }

    render() {
        const showDaySwitcher = this.props.onDaySwitch && this.props.windowWidth > 340;

        const rootStyle = {
            padding: '15px 20px',
        };

        return (
            <div style={{ minWidth: '100vw', minHeight: '100vh' }}>
                {/*
                <mui.SwipeableDrawer open={this.state.drawerOpen}
                    onOpen={() => this.setState({ drawerOpen: true })}
                    onClose={() => this.setState({ drawerOpen: false })}>
                    <mui.Box>
                        <mui.List>
                            <mui.ListItem button>
                                <mui.ListItemIcon>
                                    <SettingsIcon />
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    Settings
                                </mui.ListItemText>
                            </mui.ListItem>
                        </mui.List>
                    </mui.Box>
                </mui.SwipeableDrawer>
                */}
                <mui.AppBar position='static'>
                    <mui.Toolbar>
                        {/*
                        <mui.IconButton onClick={() => this.setState({ drawerOpen: true })}
                            size='large' edge='start'>
                            <MenuIcon />
                        </mui.IconButton>
                        */}
                        <SearchBarComponent setPage={this.props.setPage} />
                        <mui.IconButton onClick={(e) => this.setState({ menuAnchor: e.currentTarget })}
                            size='large' edge={showDaySwitcher ? false : 'end'}>
                            <MoreVertIcon />
                        </mui.IconButton>
                        <mui.Menu anchorEl={this.state.menuAnchor}
                            open={this.state.menuAnchor !== null} onClose={() => this.closeMenu()}>
                            <mui.MenuItem onClick={() => { this.props.setDark(this.props.theme.palette.mode !== 'dark'); this.closeMenu(); }}>
                                <mui.ListItemIcon>
                                    {this.props.theme.palette.mode === 'dark' ?
                                        <Brightness7 />
                                        :
                                        <Brightness3 />
                                    }
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    {this.props.theme.palette.mode === 'dark' ?
                                        <>Light mode</>
                                        :
                                        <>Dark mode</>
                                    }
                                </mui.ListItemText>
                            </mui.MenuItem>
                            {!showDaySwitcher && this.props.onDaySwitch && [
                                <mui.MenuItem key={0} onClick={() => { this.props.onDaySwitch(false); this.closeMenu(); }}>
                                    <mui.ListItemIcon>
                                        <ForwardIcon style={{ transform: 'scaleX(-1) translateX(2px)' }} />
                                    </mui.ListItemIcon>
                                    <mui.ListItemText>
                                        Last daily
                                    </mui.ListItemText>
                                </mui.MenuItem>,
                                <mui.MenuItem key={1} onClick={() => { this.props.onDaySwitch(true); this.closeMenu(); }}>
                                    <mui.ListItemIcon>
                                        <ForwardIcon />
                                    </mui.ListItemIcon>
                                    <mui.ListItemText>
                                        Next daily
                                    </mui.ListItemText>
                                </mui.MenuItem>
                            ]}
                            <mui.MenuItem onClick={() => this.today()}>
                                <mui.ListItemIcon>
                                    <RadarIcon />
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    Today's daily
                                </mui.ListItemText>
                            </mui.MenuItem>
                            <mui.MenuItem onClick={() => this.props.navigate('/calendar')}>
                                <mui.ListItemIcon>
                                    {Icons.create(Icons.daily.default)}
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    Calendar
                                </mui.ListItemText>
                            </mui.MenuItem>
                            <mui.MenuItem onClick={() => this.props.navigate('/topics')}>
                                <mui.ListItemIcon>
                                    {Icons.create(Icons.topic.default)}
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    All Topics
                                </mui.ListItemText>
                            </mui.MenuItem>
                            <mui.MenuItem onClick={() => this.props.navigate('/mentions')}>
                                <mui.ListItemIcon>
                                    {Icons.create(Icons.mention.default)}
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    All Mentions
                                </mui.ListItemText>
                            </mui.MenuItem>
                            <mui.MenuItem onClick={() => this.props.navigate('/settings')}>
                                <mui.ListItemIcon>
                                    <SettingsIcon />
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    Settings
                                </mui.ListItemText>
                            </mui.MenuItem>
                        </mui.Menu>
                        {showDaySwitcher &&
                            <>
                                <mui.Tooltip arrow title='Last daily'>
                                    <mui.IconButton size='large' onClick={() => this.props.onDaySwitch(false)}>
                                        <ForwardIcon style={{ transform: 'scaleX(-1)' }} />
                                    </mui.IconButton>
                                </mui.Tooltip>
                                <mui.Tooltip arrow title='Next daily'>
                                    <mui.IconButton size='large' onClick={() => this.props.onDaySwitch(true)} edge='end'>
                                        <ForwardIcon />
                                    </mui.IconButton>
                                </mui.Tooltip>
                            </>
                        }
                    </mui.Toolbar>
                </mui.AppBar >
                <div style={rootStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default routerNavigate(windowSize(muiTheme(BasicUIComponent)));
