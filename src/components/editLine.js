import React from 'react';
import * as mui from '@mui/material';

class EditLineComponent extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.editLast = this.props.edit;
    }

    componentDidUpdate() {
        if (this.props.edit && !this.editLast) {
            const input = this.inputRef.current.getElementsByTagName('div')[0].getElementsByTagName('textarea')[0];
            input.selectionStart = input.selectionEnd = 10000;
        }
        this.editLast = this.props.edit;
    }

    onClick(event) {
        console.log(`set cursor based on ${event.clientX} and ${event.clientY}`);
        this.props.onEdit(true);
    }

    onLineChange(event) {
        if (event.target.value !== this.props.text) {
            this.props.onLineChange(event.target.value);
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 13: // enter
                event.preventDefault();
                if (!event.shiftKey) {
                    this.props.onNextLine();
                }
                this.props.onEdit(false, event);
                return false;
            case 8: // backspace
                if (!this.props.text) {
                    event.preventDefault();
                    this.props.onLastLine(true);
                    return false;
                }
                break;
            case 38: // arrow up
                event.preventDefault();
                this.props.onEdit(-1);
                return false;
            case 40: // arrow down
                event.preventDefault();
                this.props.onEdit(1);
                return false;
            default:
                break;
        }
    }

    render() {
        const rootStyle = {
            margin: this.props.edit ? '4px 0' : '5px 0',
        };
        const inputStyle = {
            width: '105.6%',
            minHeight: '24px',
            marginTop: '-3.5px',
            marginLeft: '-8px',
            marginRight: '-20px',
        };
        const textStyle = {
            width: '100%',
            minHeight: '24px',
            cursor: 'pointer',
        };

        return (
            <div style={rootStyle}>
                {this.props.edit ?
                    <mui.TextField ref={this.inputRef}
                        InputProps={{ style: { padding: '4px 8px' } }}
                        multiline variant='outlined' style={inputStyle}
                        autoFocus onBlur={() => this.props.onEdit(false)}
                        value={this.props.text} onChange={(e) => this.onLineChange(e)}
                        onKeyDown={(e) => this.onKeyDown(e)} />
                    :
                    <div style={textStyle} onClick={(e) => this.onClick(e)}>
                        {this.props.text}
                    </div>
                }
            </div>
        );
    }
}

export default EditLineComponent;
