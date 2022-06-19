import React from 'react';
import * as mui from '@mui/material';
import EditLineComponent from './editLine';
import BigHeaderComponent from './bigHeader';
import ChroamData from '../data/chroamData';
import ChroamDate from '../data/chroamDate';
import muiTheme from '../wrapper/muiTheme';
import routerNavigate from '../wrapper/routerNavigate';
import ChroamItem from '../data/chroamItem';

class LinkListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicResults: [],
            dailyResults: [],
            showTopicEmpty: false,
            showDailyEmpty: false,
        };
        this.lastId = this.props.entry.id;
    }

    componentDidMount() {
        this.findLinks();
    }

    componentDidUpdate() {
        if (this.props.entry.id !== this.lastId) {
            this.findLinks();
            this.lastId = this.props.entry.id;
        }
    }

    async findLinks() {
        const topicResults = [];
        const dailyResults = [];
        const entries = await ChroamData.getEntries();
        const dailies = entries.filter(p => p.type === 'daily').sort((a, b) => ChroamDate.deserializeDate(b.name).getTime() - ChroamDate.deserializeDate(a.name).getTime());
        for (var entry of [...dailies, ...entries.filter(p => p.type !== 'daily')]) {
            const text = (entry.content || { text: [] }).text;
            for (var i = text.length - 1; i >= 0; i--) {
                var found = false;
                if (text[i].includes(this.props.entry.type === 'topic' ? `[[${this.props.entry.name}]]` : `#${this.props.entry.name} `)) {
                    found = true;
                }
                else if (this.props.entry.type === 'mention' && text[i].endsWith(`#${this.props.entry.name}`)) {
                    found = true;
                }

                if (found) {
                    if (entry.type === 'topic') {
                        topicResults.push({ entry, lineN: +i + 1, line: text[i] });
                    }
                    else if (entry.type === 'daily') {
                        dailyResults.push({ entry, lineN: +i + 1, line: text[i] });
                    }
                }
            }
        }
        this.setState({
            topicResults,
            dailyResults,
        });
    }

    navigateToEntry(entry) {
        this.props.navigate(entry.type === 'topic' ? `/topic?i=${encodeURIComponent(entry.name)}` : `/?i=${entry.name}`);
        this.props.locationUpdate();
    }

    render() {
        const lineStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        };
        const linkStyle = {
            color: '#777',
            marginRight: '0.25vw',
        };

        const lineComponent = (r, i) => (
            <div style={lineStyle} key={i}>
                <div>
                    <EditLineComponent
                        text={r.line} disabled
                        locationUpdate={this.props.locationUpdate} />
                </div>
                <div style={{ cursor: 'pointer' }}
                    onClick={() => this.navigateToEntry(r.entry)}>
                    <div style={linkStyle}>
                        <mui.Badge badgeContent={'#' + r.lineN} color='primary'
                            sx={{ '& .MuiBadge-badge': { color: this.props.theme.palette.background.default } }}>
                            {r.entry.type === 'topic' ?
                                `[[${r.entry.name}]]`
                                :
                                ChroamDate.stringifyDate(ChroamDate.deserializeDate(r.entry.name))
                            }
                        </mui.Badge>
                    </div>
                </div>
            </div>
        );

        const isEmptyLink = (t) => {
            t = t.replace(ChroamItem.bulletMatch, '');
            t = t.replace(ChroamItem.accordionMatch, '');
            t = t.replace(ChroamItem.checkedCheckboxMatch, '');
            t = t.replace(ChroamItem.uncheckedCheckboxMatch, '');
            return t.trim() === (this.props.entry.type === 'topic' ? `[[${this.props.entry.name}]]` : `#${this.props.entry.name}`);
        }

        return (
            <div>
                {this.state.topicResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Topics' />
                        <mui.FormControlLabel label='Show empty Links' style={{ userSelect: 'none' }}
                            control={<mui.Checkbox checked={this.state.showTopicEmpty} onChange={(e, value) => this.setState({ showTopicEmpty: value })} />} />
                        {this.state.topicResults.map((r, i) => !isEmptyLink(r.line) || this.state.showTopicEmpty ? lineComponent(r, i) : false)}
                    </>
                }
                {this.state.dailyResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Dailys' />
                        <mui.FormControlLabel label='Show empty Links' style={{ userSelect: 'none' }}
                            control={<mui.Checkbox checked={this.state.showDailyEmpty} onChange={(e, value) => this.setState({ showDailyEmpty: value })} />} />
                        {this.state.dailyResults.map((r, i) => !isEmptyLink(r.line) || this.state.showDailyEmpty ? lineComponent(r, i) : false)}
                    </>
                }
            </div>
        );
    }
}

export default routerNavigate(muiTheme(LinkListComponent));
