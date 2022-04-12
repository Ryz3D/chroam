import React from 'react';
import * as mui from '@mui/material';
import Icons from '../data/icons';

class SearchResultComponent extends React.Component {
    render() {
        return (
            <mui.ListItemButton id={`searchResult${this.props.id}`} disabled={this.props.disabled} onClick={this.props.onClick}>
                {this.props.type &&
                    Icons.create(Icons[this.props.type][this.props.new ? 'new' : 'default'], { startIcon: true })}
                {this.props.children}
            </mui.ListItemButton>
        );
    }
}

export default SearchResultComponent;
