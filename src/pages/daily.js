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
            highlighted: false,
            content: { text: [] },
        };
    }

    componentDidMount() {
        this.locationUpdate();
    }

    locationUpdate() {
        const urlSearch = new URLSearchParams(window.location.search);
        const urlDate = ChroamDate.deserializeDate(urlSearch.get('i') || '');
        this.date = urlDate || new Date();
        this.setState({
            highlighted: false,
            content: { text: [ChroamDate.stringifyDate(this.date)] },
        });
    }

    onDaySwitch(forward) {
        const nextDate = new Date(this.date.getTime() + 86400000 * (forward ? 1 : -1));
        this.props.navigate('/?i=' + ChroamDate.serializeDate(nextDate));
        this.locationUpdate();
    }

    lineChange(index, text) {
        const content = JSON.parse(JSON.stringify(this.state.content));
        if (index === content.length) {
            content.push('');
        }
        content.text[index] = text;
        this.setState({
            content,
        });
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                onDaySwitch={(f) => this.onDaySwitch(f)}
                updatePage={() => this.locationUpdate()}>
                <BigHeaderComponent
                    header={ChroamDate.stringifyDate(this.date, true)}
                    end={
                        <mui.Tooltip arrow title={this.state.highlighted ? 'Highlighted' : 'Highlight'}>
                            <mui.IconButton size='large'
                                color={this.state.highlighted ? 'warning' : 'default'}
                                onClick={() => this.setState({ highlighted: !this.state.highlighted })}>
                                {Icons.create(Icons.highlight.default)}
                            </mui.IconButton>
                        </mui.Tooltip>
                    } />
                <EditableTextComponent content={this.state.content} />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(DailyPage);
