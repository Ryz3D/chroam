import React from 'react';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import Icons from '../data/icons';
import LinkListComponent from '../components/linkList';
import ChroamData from '../data/chroamData';

class MentionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: {
                id: undefined,
                type: 'mention',
                name: '',
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
        var id = (ChroamData.getEntryByName(name, 'mention') || {}).id;
        if (id === undefined) {
            id = ChroamData.newMention(name);
        }
        this.setState({
            entry: ChroamData.getEntryById(id),
        });
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.setPage(u)}>
                <BigHeaderComponent header={this.state.entry.name} subheader={
                    <>
                        {Icons.create(Icons.mention.default, { secondary: true, style: { position: 'relative', top: '5.5px' } })}
                        <div style={{ display: 'inline' }}>Mention</div>
                    </>
                } />
                <br />
                <LinkListComponent entry={this.state.entry} />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(MentionPage);
