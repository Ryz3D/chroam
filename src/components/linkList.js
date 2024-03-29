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
        var hasEmptyTopicRes = false;
        var hasEmptyDailyRes = false;
        const topicResults = [];
        const dailyResults = [];
        const dailies = (await ChroamData.getEntries('daily')).sort((a, b) => ChroamDate.deserializeDate(b.name).getTime() - ChroamDate.deserializeDate(a.name).getTime());
        const topics = await ChroamData.getEntries('topic');
        for (var entry of [...dailies, ...topics]) {
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
                        if (this.isEmptyLink(text[i]))
                            hasEmptyTopicRes = true;
                    }
                    else if (entry.type === 'daily') {
                        dailyResults.push({ entry, lineN: +i + 1, line: text[i] });
                        if (this.isEmptyLink(text[i]))
                            hasEmptyDailyRes = true;
                    }
                }
            }
        }
        this.setState({
            topicResults,
            dailyResults,
            hasEmptyTopicRes,
            hasEmptyDailyRes,
        });
    }

    navigateToEntry(entry) {
        this.props.navigate(entry.type === 'topic' ? `/topic?i=${encodeURIComponent(entry.name)}` : `/?i=${entry.name}`);
    }

    isEmptyLink(t) {
        t = t.replace(ChroamItem.bulletMatch, '');
        t = t.replace(ChroamItem.accordionMatch, '');
        t = t.replace(ChroamItem.checkedCheckboxMatch, '');
        t = t.replace(ChroamItem.uncheckedCheckboxMatch, '');
        return t.trim() === (this.props.entry.type === 'topic' ? `[[${this.props.entry.name}]]` : `#${this.props.entry.name}`);
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
                    <EditLineComponent text={r.line} disabled />
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

        return (
            <div>
                {this.state.topicResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Topics' />
                        <mui.FormControlLabel label='Show empty Links' style={{ userSelect: 'none' }}
                            control={<mui.Checkbox disabled={!this.state.hasEmptyTopicRes} checked={this.state.showTopicEmpty} onChange={(e, value) => this.setState({ showTopicEmpty: value })} />} />
                        {this.state.topicResults.map((r, i) => !this.isEmptyLink(r.line) || this.state.showTopicEmpty ? lineComponent(r, i) : false)}
                    </>
                }
                {this.state.dailyResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Dailys' />
                        <mui.FormControlLabel label='Show empty Links' style={{ userSelect: 'none' }}
                            control={<mui.Checkbox disabled={!this.state.hasEmptyDailyRes} checked={this.state.showDailyEmpty} onChange={(e, value) => this.setState({ showDailyEmpty: value })} />} />
                        {this.state.dailyResults.map((r, i) => !this.isEmptyLink(r.line) || this.state.showDailyEmpty ? lineComponent(r, i) : false)}
                    </>
                }
            </div>
        );
    }
}

export default routerNavigate(muiTheme(LinkListComponent));
