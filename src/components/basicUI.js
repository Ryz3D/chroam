import React from 'react';
import * as mui from '@mui/material';
import {
    Brightness3,
    Brightness7,
    Delete as DeleteIcon,
    Forward as ForwardIcon,
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import SearchBarComponent from './searchBar';
import windowSize from '../wrapper/windowSize';
import muiTheme from '../wrapper/muiTheme';

class BasicUIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            menuAnchor: null,
        };
    }

    render() {
        const showDaySwitcher = this.props.onDaySwitch && this.props.windowWidth > 420;

        const rootStyle = {
            padding: '15px 20px',
        };

        return (
            <div>
                <mui.SwipeableDrawer open={this.state.drawerOpen}
                    onOpen={() => this.setState({ drawerOpen: true })}
                    onClose={() => this.setState({ drawerOpen: false })}>
                    <mui.Box>
                        <mui.List>
                            <mui.ListItem button>
                                <mui.ListItemIcon>
                                    <DeleteIcon />
                                </mui.ListItemIcon>
                                <mui.ListItemText>
                                    yo
                                </mui.ListItemText>
                            </mui.ListItem>
                        </mui.List>
                    </mui.Box>
                </mui.SwipeableDrawer>
                <mui.AppBar position='static'>
                    <mui.Toolbar>
                        <mui.IconButton onClick={() => this.setState({ drawerOpen: true })}
                            size='large' edge='start'>
                            <MenuIcon />
                        </mui.IconButton>
                        <SearchBarComponent updatePage={this.props.updatePage} />
                        <mui.IconButton onClick={(e) => this.setState({ menuAnchor: e.currentTarget })}
                            size='large' edge={showDaySwitcher ? false : 'end'}>
                            <MoreVertIcon />
                        </mui.IconButton>
                        <mui.Menu anchorEl={this.state.menuAnchor}
                            open={this.state.menuAnchor !== null} onClose={() => this.setState({ menuAnchor: null })}>
                            <mui.MenuItem onClick={() => this.props.setDark(this.props.theme.palette.mode !== 'dark')}>
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
                                <mui.MenuItem key={0} onClick={() => this.props.onDaySwitch(false)}>
                                    <mui.ListItemIcon>
                                        <ForwardIcon style={{ transform: 'scaleX(-1) translateX(2px)' }} />
                                    </mui.ListItemIcon>
                                    <mui.ListItemText>
                                        Last daily
                                    </mui.ListItemText>
                                </mui.MenuItem>,
                                <mui.MenuItem key={1} onClick={() => this.props.onDaySwitch(true)}>
                                    <mui.ListItemIcon>
                                        <ForwardIcon />
                                    </mui.ListItemIcon>
                                    <mui.ListItemText>
                                        Next daily
                                    </mui.ListItemText>
                                </mui.MenuItem>
                            ]}
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

export default windowSize(muiTheme(BasicUIComponent));
