import React from 'react';
import * as mui from '@mui/material';
import {
    Biotech as BiotechIcon,
} from '@mui/icons-material';
import SearchPopoverComponent from './searchPopover';

class SearchBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.popoverRef = React.createRef();
        this.state = {
            open: false,
            value: '',
        };
    }

    handleInput(e) {
        this.setState({
            value: e.target.value,
        });
    }

    handleInputFocus(e) {
        if (((e.relatedTarget || {}).id || '').startsWith('searchResult')) {
            document.activeElement.blur();
            this.setState({
                open: false,
            });
        }
        else {
            this.setState({
                open: true,
                searchResults: this.recommendations,
            });
        }
    }

    handleInputBlur(e) {
        const elem = e.relatedTarget;
        if (elem !== null) {
            var parent = elem.parentNode;
            for (var i = 0; i < 2; i++) {
                if (parent === null) {
                    break;
                }
                parent = parent.parentNode;
            }
            if (this.popoverRef.current === parent) {
                return;
            }
        }
        this.setState({
            open: false,
            value: '',
        });
    }

    render() {
        const height = '40px';

        const inputStyle = {
            transition: 'width 500ms cubic-bezier(0.45, -0.37, 0.6, 1.39)',
            width: this.state.open ? '90%' : '40%',
            height,
            margin: '0 10px',
        };
        const textLabelStyle = {
            display: 'inline',
            position: 'relative',
            bottom: '6px',
        };

        return (
            <>
                <mui.TextField variant='outlined' size='small'
                    autoComplete='off' ref={this.inputRef} style={inputStyle}
                    value={this.state.value} onChange={(e) => this.handleInput(e)}
                    inputProps={{ style: { height } }} InputProps={{ style: { height } }}
                    onFocus={(e) => this.handleInputFocus(e)} onBlur={(e) => this.handleInputBlur(e)}
                    color='info' label={
                        <mui.Box>
                            <BiotechIcon />
                            <div style={textLabelStyle}>
                                Search
                            </div>
                        </mui.Box>
                    } />
                {this.inputRef.current !== null &&
                    <SearchPopoverComponent popoverRef={this.popoverRef}
                        open={this.state.open} onClose={() => this.setState({ open: false, value: '' })}
                        anchorEl={this.inputRef.current}
                        query={this.state.value}
                        setPage={(u) => { this.props.setPage(u); this.setState({ open: false, value: '' }); }} />
                }
            </>
        );
    }
}

export default SearchBarComponent;
