import React from 'react';
import { Link } from 'react-router-dom';
import BasicUIComponent from '../components/basicUI';
import ChroamData from '../data/chroamData';
import routerNavigate from '../wrapper/routerNavigate';

class TopicsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: ChroamData.getEntries(),
        };
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
                <div style={rootStyle}>
                    {this.state.entries.filter(p => p.type === 'topic').map((e, i) =>
                        <p key={i}>
                            <Link to={`/topic?i=${encodeURIComponent(e.name)}`}>
                                - {e.name}
                            </Link>
                        </p>
                    )}
                </div>
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(TopicsPage);
