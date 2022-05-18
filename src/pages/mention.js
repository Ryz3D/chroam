import React from 'react';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import EditableTextComponent from '../components/editableText';

class MentionPage extends React.Component {
    constructor(props) {
        super(props);

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
        this.name = urlSearch.get('i') || '';
        // get or create id
        this.setState({
            //content: JSON.parse(localStorage.getItem(ChroamDate.serializeDate(this.date)) || '{"text":[],"highlighted":false}'),
        });
    }

    saveContent() {
        // localStorage.setItem(ChroamDate.serializeDate(this.date), JSON.stringify(this.state.content));
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
                <BigHeaderComponent header={this.name} subheader={
                    <>
                        {Icons.create(Icons.mention.default, { secondary: true, style: { position: 'relative', top: '5.5px' } })}
                        <div style={{ display: 'inline' }}>Mention</div>
                    </>
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

export default routerNavigate(MentionPage);
