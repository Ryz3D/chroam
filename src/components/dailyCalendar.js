import React from 'react';
import * as mui from '@mui/material';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material';
import ChroamDate from '../data/chroamDate';
import routerNavigate from '../wrapper/routerNavigate';

class DailyCalendarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
        };
    }

    getDaily(day) {
        const date = new Date(this.state.year, this.state.month, day + 1);
        const item = localStorage.getItem(ChroamDate.serializeDate(date));
        return JSON.parse(item || '{}');
    }

    hasDaily(day) {
        return (this.getDaily(day).text || []).length > 0;
    }

    isLit(day) {
        return this.getDaily(day).highlighted || false;
    }

    toDaily(day) {
        const date = new Date(this.state.year, this.state.month, day + 1);
        this.props.navigate(`/?i=${ChroamDate.serializeDate(date)}`);
        this.updatePage();
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
            backgroundColor: '#222e',
            borderRadius: '15px',
        };
        const itemStyle = {
            minWidth: '0',
            borderRadius: '15px',
        };

        return (
            <div>
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
                        new Array((6 + weekdayOffset) % 7).fill(0).map(() => <div />)
                    }
                    {
                        new Array(days).fill(0).map((_, i) =>
                            <mui.Button
                                style={{ ...itemStyle, color: this.isLit(i) ? '#ff0' : undefined }}
                                variant={i === today && currentMonth ? 'contained' : (this.hasDaily(i) ? 'outlined' : 'text')}
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

export default routerNavigate(DailyCalendarComponent);
