import React from 'react';
import * as mui from '@mui/material';
import SearchResultComponent from './searchResult';
import ChroamDate from '../data/chroamDate';
import ChroamData from '../data/chroamData';
import ChroamText from '../data/chroamText';
import routerNavigate from '../wrapper/routerNavigate';

// select results with arrow keys (pass event as prop)

class SearchPopoverComponent extends React.Component {
    constructor(props) {
        super(props);
        this.recommendations = [
            { type: 'history', title: 'history', disabled: true },
            { type: 'highlight', title: 'highlighted', disabled: true },
            { type: 'mention', title: 'recommendations', disabled: true },
        ];
        this.searchedQuery = '';
        this.state = {
            searchResults: this.recommendations,
            recommending: true,
        };
    }

    doSearch() {
        if (this.props.query.trim() === '') {
            this.setState({
                searchResults: this.recommendations,
                recommending: true,
            });
        }
        else {
            const results = [];

            for (var e of ChroamData.getEntries()) {
                const res = {
                    title: e.name,
                    type: e.type,
                    highlighted: e.highlighted,
                    score: 0,
                };
                if (e.type === 'topic') {
                    res.score += 0.5;
                }
                if (e.highlighted) {
                    res.score += 0.8;
                }

                var allowed = false;
                if (this.props.allowTopic && e.type === 'topic') {
                    allowed = true;
                }
                if (this.props.allowMention && e.type === 'mention') {
                    allowed = true;
                }
                if (allowed && e.name.toLowerCase().includes(this.props.query.toLowerCase())) {
                    res.score += this.props.query.length / e.name.length;
                    results.push(res);
                }
            }

            this.setState({
                searchResults: [
                    {
                        title: <>
                            Searching for
                            <i style={{ marginLeft: '5px' }}>
                                {this.props.query}
                            </i>
                            ...
                        </>,
                        disabled: true,
                    },
                    ...results.sort((a, b) => b.score - a.score),
                ],
                recommending: false,
            });
        }
        this.searchedQuery = this.props.query;
    }

    componentDidMount() {
        this.doSearch();
    }

    componentDidUpdate() {
        if (this.props.query !== this.searchedQuery) {
            this.doSearch();
        }
    }

    toEntry(e) {
        if (e.type === 'topic') {
            this.toTopic(e.title);
        }
        else if (e.type === 'mention') {
            this.toMention(e.title);
        }
        else {
            console.error(`unknown type '${e.type}'`);
        }
    }

    toDaily(date) {
        this.props.setPage(`/?i=${ChroamDate.serializeDate(date)}`);
    }

    toTopic(name = '') {
        this.props.setPage(`/topic?i=${ChroamText.serializeText(name || this.props.query)}`);
    }

    toMention(name = '') {
        this.props.setPage(`/mention?i=${ChroamText.serializeText(name || this.props.query)}`);
    }

    render() {
        const topicExists = ChroamData.hasName(this.props.query, 'topic');
        const mentionExists = ChroamData.hasName(this.props.query, 'mention');

        const dateTyped = ChroamDate.parseDate(this.props.query);
        const dateData = dateTyped === null ? {} : JSON.parse(localStorage.getItem(ChroamDate.serializeDate(dateTyped)) || '{}');
        const dateExists = (dateData.text || []).length > 0;
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
                    {this.state.searchResults.map((e, i) =>
                        <SearchResultComponent key={i} id={i}
                            type={e.type} disabled={e.disabled}
                            onClick={() => this.toEntry(e)}>
                            {e.title}
                        </SearchResultComponent>
                    )}
                    <mui.Divider />
                    {this.props.allowTopic &&
                        <SearchResultComponent type='topic' new disabled={this.props.query === '' || topicExists}
                            id={continueKey + 0} onClick={() => this.toTopic()}>
                            New topic
                        </SearchResultComponent>
                    }
                    {this.props.allowDaily &&
                        <SearchResultComponent type='daily' new={!dateExists} disabled={dateTyped === null} highlighted={dateData.highlighted}
                            id={continueKey + 1} onClick={() => this.toDaily(dateTyped)}>
                            {dateTyped === null ?
                                <>New Daily?</>
                                :
                                <>
                                    {dateExists ?
                                        <>Daily</>
                                        :
                                        <>New Daily</>
                                    }
                                    <mui.Typography color='GrayText' marginLeft='8px'>
                                        for {ChroamDate.stringifyDate(dateTyped)}
                                    </mui.Typography>
                                </>
                            }
                        </SearchResultComponent>
                    }
                    {this.props.allowMention &&
                        <SearchResultComponent type='mention' new disabled={this.props.query === '' || mentionExists}
                            id={continueKey + 2} onClick={() => this.toMention()}>
                            New mention
                        </SearchResultComponent>
                    }
                </mui.List>
            </mui.Popover >
        );
    }
}

export default routerNavigate(SearchPopoverComponent);
