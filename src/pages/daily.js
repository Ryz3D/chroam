import React from 'react';
import * as mui from '@mui/material';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import ChroamDate from '../data/chroamDate';
import EditableTextComponent from '../components/editableText';
import ChroamData from '../data/chroamData';
import muiTheme from '../wrapper/muiTheme';
import ContentLoader from '../components/contentLoader';
import routerLocation from '../wrapper/routerLocation';

class DailyPage extends React.Component {
    constructor(props) {
        super(props);
        this.date = new Date();

        this.state = {
            content: { text: [] },
            editing: false,
            loaded: false,
        };
        this.keyListener = (e) => this.onKeyDown(e);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.locationUpdate();
        }
    }

    componentDidMount() {
        this.locationUpdate();
        window.addEventListener('keydown', this.keyListener);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyListener);
    }

    onKeyDown(e) {
        if (!this.state.editing) {
            switch (e.key) {
                case 'ArrowLeft':
                    this.onDaySwitch(false);
                    break;
                case 'ArrowRight':
                    this.onDaySwitch(true);
                    break;
                default:
                    break;
            }
        }
    }

    async locationUpdate() {
        const urlSearch = new URLSearchParams(window.location.search);
        const urlDate = ChroamDate.deserializeDate(urlSearch.get('i') || '');
        this.date = urlDate || new Date();
        this.setState({
            content: ((await ChroamData.getEntryByName(ChroamDate.serializeDate(this.date), 'daily')) || { content: { text: [], highlighted: false } }).content,
            loaded: true,
        });
    }

    onDaySwitch(forward) {
        if (!this.state.loaded)
            return;
        var nextDate = null;
        if (typeof (forward) === 'boolean') {
            nextDate = new Date(this.date.getTime() + 86400000 * (forward ? 1 : -1));
        }
        else {
            nextDate = forward;
        }
        if (nextDate !== null) {
            this.props.navigate('/?i=' + ChroamDate.serializeDate(nextDate));
        }
    }

    async saveContent() {
        if (!this.state.loaded)
            return;
        const name = ChroamDate.serializeDate(this.date);
        const id = ((await ChroamData.getEntryByName(name, 'daily')) || {}).id;
        await ChroamData.setEntry({ type: 'daily', id, name, content: this.state.content });
    }

    onLineChange(index, text) {
        if (!this.state.loaded)
            return;
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
        if (!this.state.loaded)
            return;
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
        if (!this.state.loaded)
            return;
        const content = JSON.parse(JSON.stringify(this.state.content));
        content.text.splice(index, 1);
        this.setState({
            content,
        }, () => { this.saveContent(); cb(); });
    }

    isToday() {
        return this.date.toDateString() === new Date().toDateString();
    }

    render() {
        const today = this.isToday();

        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                onDaySwitch={(f) => this.onDaySwitch(f)}>
                <ContentLoader active={!this.state.loaded} />
                <BigHeaderComponent
                    header={ChroamDate.stringifyDate(this.date, true)}
                    end={
                        <div className='highlight-btn'>
                            <mui.Tooltip
                                arrow
                                title={this.state.content.highlighted ? 'Highlighted' : 'Highlight'}>
                                <mui.IconButton
                                    size='large'
                                    color={this.state.content.highlighted ? 'warning' : 'default'}
                                    onClick={() => this.setState({ content: { ...this.state.content, highlighted: !this.state.content.highlighted } }, () => this.saveContent())}>
                                    {Icons.create(Icons.highlight.default)}
                                </mui.IconButton>
                            </mui.Tooltip>
                        </div>
                    }
                    subheader={
                        <>
                            {Icons.create(Icons.daily.default, {
                                secondary: true,
                                style: {
                                    position: 'relative',
                                    top: '5.5px',
                                    color: today ? this.props.theme.palette.secondary.main : undefined,
                                },
                            })}
                            <div style={{
                                display: 'inline',
                                color: today ? this.props.theme.palette.secondary.main : undefined,
                            }}>
                                {today ? <>Today's Daily</> : <>Daily</>}
                            </div>
                        </>
                    } />
                <EditableTextComponent
                    content={this.state.content}
                    onLineChange={(i, t) => this.onLineChange(i, t)}
                    onNextLine={(i, cb, t) => this.onNextLine(i, cb, t)}
                    onDeleteLine={(i, cb) => this.onDeleteLine(i, cb)}
                    onEdit={(editing) => this.setState({ editing })} />
                <div style={{ height: '2rem' }} />
            </BasicUIComponent>
        );
    }
}

export default routerLocation(routerNavigate(muiTheme(DailyPage)));
