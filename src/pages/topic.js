import React from 'react';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import EditableTextComponent from '../components/editableText';
import LinkListComponent from '../components/linkList';
import ChroamData from '../data/chroamData';
import ContentLoader from '../components/contentLoader';

class TopicPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: {
                type: 'topic',
                name: '',
                content: {
                    text: [],
                    highlighted: false,
                },
            },
            loaded: false,
        };
    }

    componentDidMount() {
        this.locationUpdate();
    }

    setPage(u) {
        this.props.navigate(u);
        this.locationUpdate();
    }

    async locationUpdate() {
        this.setState({
            loaded: false,
        });
        const urlSearch = new URLSearchParams(window.location.search);
        const name = urlSearch.get('i') || '';
        var entry = await ChroamData.getEntryByName(name, 'topic');
        var id = (entry || {}).id;
        if (id === undefined) {
            id = await ChroamData.newTopic(name);
            entry = await ChroamData.getEntryById(id, 'topic');
        }
        this.setState({
            entry,
            loaded: true,
        });
    }

    async saveContent() {
        await ChroamData.setEntry(this.state.entry);
    }

    onLineChange(index, text) {
        const content = JSON.parse(JSON.stringify(this.state.entry.content));
        if (index === content.length) {
            content.text.push(text);
        }
        else {
            content.text[index] = text;
        }
        this.setState({
            entry: { ...this.state.entry, content },
        }, () => this.saveContent());
    }

    onNextLine(index, cb = () => { }, t = '') {
        const content = JSON.parse(JSON.stringify(this.state.entry.content));
        content.text = [
            ...content.text.slice(0, index + 1),
            t,
            ...content.text.slice(index + 1),
        ];
        this.setState({
            entry: { ...this.state.entry, content },
        }, () => { this.saveContent(); cb(); });
    }

    onDeleteLine(index, cb = () => { }) {
        const content = JSON.parse(JSON.stringify(this.state.entry.content));
        content.text.splice(index, 1);
        this.setState({
            entry: { ...this.state.entry, content },
        }, () => { this.saveContent(); cb(); });
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.setPage(u)}>
                <ContentLoader active={!this.state.loaded} />
                <BigHeaderComponent header={this.state.entry.name} subheader={
                    <>
                        {Icons.create(Icons.topic.default, { secondary: true, style: { position: 'relative', top: '5.5px' } })}
                        <div style={{ display: 'inline' }}>Topic</div>
                    </>
                } />
                <EditableTextComponent
                    content={this.state.entry.content}
                    onLineChange={(i, t) => this.onLineChange(i, t)}
                    onNextLine={(i, cb, t) => this.onNextLine(i, cb, t)}
                    onDeleteLine={(i, cb) => this.onDeleteLine(i, cb)}
                    locationUpdate={() => this.locationUpdate()} />
                <div style={{ height: '2rem' }} />
                <LinkListComponent
                    entry={this.state.entry}
                    locationUpdate={() => this.locationUpdate()} />
                <div style={{ height: '2rem' }} />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(TopicPage);
