import React from 'react';
import * as mui from '@mui/material';
import EditLineComponent from './editLine';
import BigHeaderComponent from './bigHeader';
import ChroamData from '../data/chroamData';
import ChroamDate from '../data/chroamDate';
import { Link } from 'react-router-dom';
import muiTheme from '../wrapper/muiTheme';

// TODO: show topic name and date at right edge

class LinkListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicResults: [],
            dailyResults: [],
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

    findLinks() {
        const topicResults = [];
        const dailyResults = [];
        const entries = ChroamData.getEntries();
        const dailies = entries.filter(p => p.type === 'daily').sort((a, b) => ChroamDate.deserializeDate(b.name).getTime() - ChroamDate.deserializeDate(a.name).getTime());
        for (var entry of [...dailies, entries.filter(p => p.type !== 'daily')]) {
            const location = entry.type === 'daily' ? entry.name : entry.id;
            const content = JSON.parse(localStorage.getItem(location) || '{"text": []}');
            for (var i = content.text.length - 1; i >= 0; i--) {
                var found = false;
                if (content.text[i].includes(this.props.entry.type === 'topic' ? `[[${this.props.entry.name}]]` : `#${this.props.entry.name} `)) {
                    found = true;
                }
                else if (this.props.entry.type === 'mention' && content.text[i].endsWith(`#${this.props.entry.name}`)) {
                    found = true;
                }

                if (found) {
                    if (entry.type === 'topic') {
                        topicResults.push({ entry, lineN: +i + 1, line: content.text[i] });
                    }
                    else if (entry.type === 'daily') {
                        dailyResults.push({ entry, lineN: +i + 1, line: content.text[i] });
                    }
                }
            }
        }
        this.setState({
            topicResults,
            dailyResults,
        });
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
                <Link
                    to={r.entry.type === 'topic' ? `/topic?i=${encodeURIComponent(r.entry.name)}` : `/?i=${r.entry.name}`}
                    style={{ textDecoration: 'none' }}>
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
                </Link>
            </div>
        );

        return (
            <div>
                {this.state.topicResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Topics' />
                        {this.state.topicResults.map(lineComponent)}
                    </>
                }
                {this.state.dailyResults.length > 0 &&
                    <>
                        <div style={{ height: '2rem' }} />
                        <BigHeaderComponent smaller header='Links from Dailys' />
                        {this.state.dailyResults.map(lineComponent)}
                    </>
                }
            </div>
        );
    }
}

export default muiTheme(LinkListComponent);
