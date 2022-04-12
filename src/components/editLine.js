import React from 'react';
import * as mui from '@mui/material';

class EditLineComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        };
    }

    setEdit(edit, event) {
        if (event) {
            // TODO
            console.log(`set cursor based on ${event.clientX} and ${event.clientY}`);
        }
        this.setState({ edit });
    }

    onKeyDown(event) {
        if (event.keyCode === 13) {
            if (!event.shiftKey) {
                // TODO
                console.log('move to next line via prop onNextLine');
            }
            this.setState({ edit: false });
        }
    }

    render() {
        // TODO: LINE BREAK INPUT

        const inputStyle = {
            width: '100%',
            marginTop: '-2.5px',
            marginLeft: '-14px',
            height: '24px',
            overflow: 'hidden',
        };
        const textStyle = {
            width: '100%',
            cursor: 'pointer',
        };

        return (
            this.state.edit ?
                <mui.TextField
                    variant='outlined' style={inputStyle}
                    autoFocus onBlur={() => this.setEdit(false)}
                    value={this.props.text} onChange={(e) => this.props.onChange(e.target.value)}
                    onKeyDown={(e) => this.onKeyDown(e)} />
                :
                <div style={textStyle} onClick={(e) => this.setEdit(true, e)}>
                    {this.props.text}
                </div>
        );
    }
}

export default EditLineComponent;
