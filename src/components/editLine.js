import React from 'react';
import * as mui from '@mui/material';
import muiTheme from '../wrapper/muiTheme';
import {
    ArrowRight,
    Check,
    HorizontalRule,
} from '@mui/icons-material';
import ChroamItem from '../data/chroamItem';

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

    checkboxClick(checked) {
        var newText = this.props.text;
        if (checked) {
            newText = newText.replace(ChroamItem.uncheckedCheckboxMatch, '[x]');
        }
        else {
            newText = newText.replace(ChroamItem.checkedCheckboxMatch, '[]');
        }
        this.props.onLineChange(newText);
    }

    accordionClick() {
        console.log('toggle');
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
            backgroundColor: this.props.theme.palette.primary.dark + '30',
        };
        const boxStyle = {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            minHeight: '24px',
            borderRadius: '4px',
            border: this.props.highlight ? ('1px solid ' + this.props.theme.palette.primary.dark + '30') : '',
            backgroundColor: this.props.highlight ? (this.props.theme.palette.primary.dark + '15') : '',
        };
        const checkboxStyle = {
            position: 'relative',
            verticalAlign: 'text-top',
            width: '18px',
            height: '18px',
            borderRadius: '5px',
            border: '2px solid ' + this.props.theme.palette.primary.main,
            textAlign: 'center',
            color: this.props.theme.palette.primary.main,
            cursor: 'pointer',
        };
        const checkStyle = {
            position: 'absolute',
            top: '-3px',
            left: '-2.5px',
        };
        const bulletStyle = {
            marginBottom: '-4.5px',
            marginRight: '-3px',
            width: '100%',
        };
        const accordionStyle = {
            marginBottom: '-4.5px',
            marginLeft: '-2px',
            marginRight: '-2px',
            cursor: 'pointer',
        };
        const textStyle = {
            width: '100%',
            height: '100%',
            minHeight: '22px',
            marginLeft: '3px',
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
                    <div style={boxStyle}>
                        {ChroamItem.isUncheckedCheckbox(this.props.text) &&
                            <div style={checkboxStyle} onClick={() => this.checkboxClick(true)} />
                        }
                        {ChroamItem.isCheckedCheckbox(this.props.text) &&
                            <div style={checkboxStyle} onClick={() => this.checkboxClick(false)}>
                                <Check fontSize='small' style={checkStyle} />
                            </div>
                        }
                        {ChroamItem.isBullet(this.props.text) &&
                            <div>
                                <HorizontalRule fontSize='small' style={bulletStyle} />
                            </div>
                        }
                        {ChroamItem.isAccordion(this.props.text) &&
                            <div onClick={() => this.accordionClick()}>
                                <ArrowRight fontSize='small' style={accordionStyle} />
                            </div>
                        }
                        <div style={textStyle} onClick={(e) => this.onClick(e)}>
                            {this.props.text
                                .replace(ChroamItem.uncheckedCheckboxMatch, '')
                                .replace(ChroamItem.checkedCheckboxMatch, '')
                                .replace(ChroamItem.bulletMatch, '')
                                .replace(ChroamItem.accordionMatch, '')
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default muiTheme(EditLineComponent);
