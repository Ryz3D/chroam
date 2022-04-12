import React from 'react';
import * as mui from '@mui/material';
import SearchResultComponent from './searchResult';
import ChroamDate from '../data/chroamDate';
import ChroamText from '../data/chroamText';
import routerNavigate from '../wrapper/routerNavigate';

// select results with arrow keys (pass event as prop)
// "go to daily" if exists and remove 'new' prop

class SearchPopoverComponent extends React.Component {
    constructor(props) {
        super(props);
        this.recommendations = [
            { type: 'history', title: 'history' },
            { type: 'highlight', title: 'highlighted' },
            { type: 'mention', title: 'recommendations' },
        ];
        this.searchedQuery = '';
        this.state = {
            searchResults: this.recommendations,
            recommending: true,
        };
    }

    componentDidUpdate() {
        if (this.props.query !== this.searchedQuery) {
            if (this.props.query === '') {
                this.setState({
                    searchResults: this.recommendations,
                    recommending: true,
                });
            }
            else {
                this.setState({
                    searchResults: [{
                        title: <>
                            Searching for
                            <i style={{ marginLeft: '5px' }}>
                                {this.props.query}
                            </i>
                            ...
                        </>,
                        disabled: true,
                    }],
                    recommending: false,
                });
            }
            this.searchedQuery = this.props.query;
        }
    }

    updatePage() {
        if (this.props.updatePage) {
            this.props.updatePage();
        }
        this.props.onClose();
    }

    createTopic() {
        this.props.navigate(`/topic?i=${ChroamText.serializeText(this.props.query)}`);
        this.updatePage();
    }

    toDaily(date) {
        this.props.navigate(`/?i=${ChroamDate.serializeDate(date)}`);
        this.updatePage();
    }

    createMention() {
        this.props.navigate(`/mention?i=${ChroamText.serializeText(this.props.query)}`);
        this.updatePage();
    }

    render() {
        const dateTyped = ChroamDate.parseDate(this.props.query);
        const continueKey = this.state.searchResults.length;

        return (
            <mui.Popover ref={this.props.popoverRef} open={this.props.open}
                onClose={this.props.onClose}
                onBlur={this.props.onClose}
                anchorEl={this.props.anchorEl} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableAutoFocus disableEnforceFocus
                hideBackdrop
                sx={{
                    pointerEvents: 'none',
                }}
                PaperProps={{
                    sx: {
                        pointerEvents: 'all',
                    },
                }}>
                <mui.List>
                    {this.state.searchResults.map((r, i) =>
                        <SearchResultComponent type={r.type} disabled={r.disabled} key={i} id={i}>
                            {r.title}
                        </SearchResultComponent>
                    )}
                    <mui.Divider />
                    <SearchResultComponent type='topic' new disabled={this.props.query === ''}
                        id={continueKey + 0} onClick={() => this.createTopic()}>
                        Create topic
                    </SearchResultComponent>
                    <SearchResultComponent type='daily' new disabled={dateTyped === null}
                        id={continueKey + 1} onClick={() => this.toDaily(dateTyped)}>
                        Create daily
                        {dateTyped !== null &&
                            <mui.Typography color='GrayText' marginLeft='8px'>
                                for {ChroamDate.stringifyDate(dateTyped)}
                            </mui.Typography>
                        }
                    </SearchResultComponent>
                    <SearchResultComponent type='mention' new disabled={this.props.query === ''}
                        id={continueKey + 2} onClick={() => this.createMention()}>
                        Create mention
                    </SearchResultComponent>
                </mui.List>
            </mui.Popover >
        );
    }
}

export default routerNavigate(SearchPopoverComponent);
