import React from 'react';
import * as mui from '@mui/material';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import ChroamDate from '../data/chroamDate';
import EditableTextComponent from '../components/editableText';

// today button in menu

class DailyPage extends React.Component {
    constructor(props) {
        super(props);
        this.date = new Date();

        this.state = {
            content: { text: [] },
        };
    }

    componentDidMount() {
        this.locationUpdate();
    }

    setPage(u) {
        this.props.navigate(u);
        this.locationUpdate();
    }

    locationUpdate() {
        const urlSearch = new URLSearchParams(window.location.search);
        const urlDate = ChroamDate.deserializeDate(urlSearch.get('i') || '');
        this.date = urlDate || new Date();
        this.setState({
            content: JSON.parse(localStorage.getItem(ChroamDate.serializeDate(this.date)) || '{"text":[],"highlighted":false}'),
        });
    }

    onDaySwitch(forward) {
        var nextDate = null;
        if (typeof (forward) === 'boolean') {
            nextDate = new Date(this.date.getTime() + 86400000 * (forward ? 1 : -1));
        }
        else {
            nextDate = forward;
        }
        if (nextDate !== null) {
            this.props.navigate('/?i=' + ChroamDate.serializeDate(nextDate));
            this.locationUpdate();
        }
    }

    saveContent() {
        localStorage.setItem(ChroamDate.serializeDate(this.date), JSON.stringify(this.state.content));
    }

    onLineChange(index, text) {
        const content = JSON.parse(JSON.stringify(this.state.content));
        if (index === content.length) {
            content.text.push(text);
        }
        else {
            content.text[index] = text;
        }
        this.setState({
            content,
        }, () => this.saveContent());
    }

    onNextLine(index, cb = () => { }, t = '') {
        const content = JSON.parse(JSON.stringify(this.state.content));
        content.text = [
            ...content.text.slice(0, index + 1),
            t,
            ...content.text.slice(index + 1),
        ];
        this.setState({
            content,
        }, () => { this.saveContent(); cb(); });
    }

    onDeleteLine(index, cb = () => { }) {
        const content = JSON.parse(JSON.stringify(this.state.content));
        content.text.splice(index, 1);
        this.setState({
            content,
        }, () => { this.saveContent(); cb(); });
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                onDaySwitch={(f) => this.onDaySwitch(f)}
                setPage={(u) => this.setPage(u)}>
                <BigHeaderComponent
                    header={ChroamDate.stringifyDate(this.date, true)}
                    end={
                        <mui.Tooltip arrow title={this.state.content.highlighted ? 'Highlighted' : 'Highlight'}>
                            <mui.IconButton size='large'
                                color={this.state.content.highlighted ? 'warning' : 'default'}
                                onClick={() => this.setState({ content: { ...this.state.content, highlighted: !this.state.content.highlighted } }, () => this.saveContent())}>
                                {Icons.create(Icons.highlight.default)}
                            </mui.IconButton>
                        </mui.Tooltip>
                    } />
                <EditableTextComponent
                    content={this.state.content}
                    onLineChange={(i, t) => this.onLineChange(i, t)}
                    onNextLine={(i, cb, t) => this.onNextLine(i, cb, t)}
                    onDeleteLine={(i, cb) => this.onDeleteLine(i, cb)} />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(DailyPage);
