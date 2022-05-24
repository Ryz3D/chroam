import React from 'react';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import EditableTextComponent from '../components/editableText';
import LinkListComponent from '../components/linkList';
import ChroamData from '../data/chroamData';

class TopicPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: {
                id: undefined,
                name: '',
            },
            content: {
                text: [],
            },
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
        const name = urlSearch.get('i') || '';
        var id = (ChroamData.getEntryByName(name, 'topic') || {}).id;
        if (id === undefined) {
            id = ChroamData.newTopic(name);
        }
        this.setState({
            entry: ChroamData.getEntryById(id),
            content: JSON.parse(localStorage.getItem(id)) || {
                text: [],
            },
        });
    }

    saveContent() {
        localStorage.setItem(this.state.entry.id, JSON.stringify(this.state.content));
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
                setPage={(u) => this.setPage(u)}>
                <BigHeaderComponent header={this.state.entry.name} subheader={
                    <>
                        {Icons.create(Icons.topic.default, { secondary: true, style: { position: 'relative', top: '5.5px' } })}
                        <div style={{ display: 'inline' }}>Topic</div>
                    </>
                } />
                <EditableTextComponent
                    content={this.state.content}
                    onLineChange={(i, t) => this.onLineChange(i, t)}
                    onNextLine={(i, cb, t) => this.onNextLine(i, cb, t)}
                    onDeleteLine={(i, cb) => this.onDeleteLine(i, cb)} />
                <div style={{ height: '2rem' }} />
                <LinkListComponent entry={this.state.entry} />
                <div style={{ height: '2rem' }} />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(TopicPage);
