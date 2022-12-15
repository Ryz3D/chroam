import React from 'react';
import * as mui from '@mui/material';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material';
import ChroamDate from '../data/chroamDate';
import ChroamData from '../data/chroamData';
import muiTheme from '../wrapper/muiTheme';
import ContentLoader from './contentLoader';
import routerNavigate from '../wrapper/routerNavigate';

class DailyCalendarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            days: 0,
            hasDaily: [],
            isLit: [],
            entries: [],
            loaded: false,
        };
    }

    componentDidMount() {
        ChroamData.getEntries('daily')
            .then(entries => {
                this.setState({
                    entries,
                    loaded: true,
                });
            });
    }

    getEntry(day) {
        const name = ChroamDate.serializeDate(new Date(this.state.year, this.state.month, day + 1));
        return this.state.entries.find(p => p.name === name);
    }

    hasDaily(day) {
        return (this.getEntry(day) || { content: { text: [] } }).content.text.length > 0;
    }

    isLit(day) {
        return (this.getEntry(day) || { content: { highlighted: false } }).content.highlighted;
    }

    prevMonth() {
        if (this.state.month > 0) {
            this.setState({
                month: this.state.month - 1,
            });
        }
        else {
            this.setState({
                year: this.state.year - 1,
                month: 11,
            });
        }
    }

    nextMonth() {
        if (this.state.month < 11) {
            this.setState({
                month: this.state.month + 1,
            });
        }
        else {
            this.setState({
                year: this.state.year + 1,
                month: 0,
            });
        }
    }

    openDaily(i) {
        const date = new Date(this.state.year, this.state.month, i + 1);
        this.props.navigate('/?i=' + ChroamDate.serializeDate(date));
    }

    render() {
        const weekdayOffset = new Date(this.state.year, this.state.month, 1).getDay();
        const days = new Date(this.state.year, this.state.month + 1, 0).getDate();
        const today = new Date().getDate() - 1;
        const currentMonth = this.state.month === new Date().getMonth() && this.state.year === new Date().getFullYear();

        const controlStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        };
        const gridStyle = {
            display: 'grid',
            gridTemplateColumns: 'auto auto auto auto auto auto auto',
            borderRadius: '15px',
            padding: '8px',
        };
        const itemStyle = {
            minWidth: '0',
            borderRadius: '15px',
            textShadow: this.props.theme.palette.mode === 'dark' ? '0 0 3px #aaa5' : '0 0 2.5px #0005',
            boxShadow: '0 0 8px #0004',
        };

        return (
            <div>
                <ContentLoader active={!this.state.loaded} />
                <div style={controlStyle}>
                    <mui.Button onClick={() => this.prevMonth()}>
                        <ArrowLeftOutlined />
                    </mui.Button>
                    <mui.Typography display='inline'>
                        {this.state.month + 1}
                        /
                        {this.state.year}
                    </mui.Typography>
                    <mui.Button onClick={() => this.nextMonth()}>
                        <ArrowRightOutlined />
                    </mui.Button>
                </div>
                <br />
                <div style={gridStyle}>
                    {
                        new Array((6 + weekdayOffset) % 7).fill(0).map((n, i) => <div key={i} />)
                    }
                    {
                        new Array(days).fill(0).map((_, i) =>
                            <mui.Button
                                key={i}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: i === today && currentMonth ? '#ff8ad3' : undefined,
                                    border: this.isLit(i) ? '4px #ff0 outset' : undefined,
                                    margin: this.isLit(i) ? '-4px' : undefined,
                                    color: this.isLit(i) ? '#ff0' : undefined,
                                    zIndex: 10 + i,
                                }}
                                variant={this.hasDaily(i) ? 'contained' : 'outlined'}
                                color={(i + weekdayOffset + 6) % 7 > 4 ? 'secondary' : 'primary'}
                                onClick={() => this.openDaily(i)}>
                                {i + 1}
                            </mui.Button>
                        )
                    }
                </div>
            </div >
        );
    }
}

export default routerNavigate(muiTheme(DailyCalendarComponent));
