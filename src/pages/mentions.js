import React from 'react';
import { Link } from 'react-router-dom';
import BasicUIComponent from '../components/basicUI';
import ContentLoader from '../components/contentLoader';
import ChroamData from '../data/chroamData';
import routerNavigate from '../wrapper/routerNavigate';

class MentionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            loaded: false,
        };
    }

    componentDidMount() {
        ChroamData.getEntries('mention')
            .then(entries => this.setState({
                entries,
                loaded: true,
            }));
    }

    render() {
        const rootStyle = {
            width: '100%',
            height: '100%',
            margin: 'auto',
            overflow: 'auto',
        };

        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.props.navigate(u)}>
                <ContentLoader active={!this.state.loaded} />
                <div style={rootStyle}>
                    {this.state.entries.map((e, i) =>
                        <p key={i}>
                            <Link to={`/mention?i=${encodeURIComponent(e.name)}`}>
                                - {e.name}
                            </Link>
                        </p>
                    )}
                </div>
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(MentionsPage);
