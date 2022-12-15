import React from 'react';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import LinkListComponent from '../components/linkList';
import ChroamData from '../data/chroamData';
import ContentLoader from '../components/contentLoader';
import routerLocation from '../wrapper/routerLocation';

class MentionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: {
                type: 'mention',
                name: '',
            },
            loaded: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.locationUpdate();
        }
    }

    componentDidMount() {
        this.locationUpdate();
    }

    async locationUpdate() {
        this.setState({
            loaded: false,
        });
        const urlSearch = new URLSearchParams(window.location.search);
        const name = urlSearch.get('i') || '';
        var entry = await ChroamData.getEntryByName(name, 'mention');
        var id = (entry || {}).id;
        if (id === undefined) {
            id = await ChroamData.newMention(name);
            entry = await ChroamData.getEntryById(id, 'mention');
        }
        this.setState({
            entry,
            loaded: true,
        });
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}>
                <ContentLoader active={!this.state.loaded} />
                <BigHeaderComponent header={this.state.entry.name} subheader={
                    <>
                        {Icons.create(Icons.mention.default, { secondary: true, style: { position: 'relative', top: '5.5px' } })}
                        <div style={{ display: 'inline' }}>Mention</div>
                    </>
                } />
                <br />
                <LinkListComponent
                    entry={this.state.entry} />
                <div style={{ height: '2rem' }} />
            </BasicUIComponent>
        );
    }
}

export default routerLocation(routerNavigate(MentionPage));
