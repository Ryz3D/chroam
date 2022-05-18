import React from 'react';
import * as mui from '@mui/material';
import muiTheme from '../wrapper/muiTheme';
import {
    ArrowRight,
    Check,
    HorizontalRule,
} from '@mui/icons-material';
import ChroamItem from '../data/chroamItem';
import ChroamData from '../data/chroamData';
import SearchPopoverComponent from './searchPopover';
import { Link } from 'react-router-dom';
import { teal } from '@mui/material/colors';

class EditLineComponent extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.popoverRef = React.createRef();
        this.editLast = this.props.edit;
        this.state = {
            input: this.props.text || '',
            search: '',
            searchMention: false,
        };
    }

    inputUpdate(t, initial = false) {
        // NO WHITESPACE IN MENTION!
        const matches = [...t.matchAll(/\[\[(.*)$/g), ...t.matchAll(/#([äöüÄÖÜß_-\w]*)$/g)];
        if (matches.length > 0) {
            this.setState({
                input: t,
                search: matches[0][1],
                searchMention: matches[0][0].startsWith('#'),
            });
        }
        else {
            this.setState({
                input: t,
                search: '',
            });
        }
        if (t || !initial) {
            this.props.onLineChange(t);
        }
    }

    componentDidUpdate() {
        if (this.props.edit && !this.editLast) {
            const input = this.inputRef.current.getElementsByTagName('div')[0].getElementsByTagName('textarea')[0];
            input.selectionStart = input.selectionEnd = 10000;
            this.inputUpdate(this.props.text, true);
        }
        this.editLast = this.props.edit;
    }

    onClick(event) {
        if (!event.target.id.startsWith('chroamref')) {
            console.log(`set cursor based on ${event.clientX} and ${event.clientY}`);
            this.props.onEdit(true);
        }
    }

    onLineChange(event) {
        if (event.target.value !== this.props.text) {
            this.inputUpdate(event.target.value);
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
            case 46: // delete
                if (!this.props.text) {
                    event.preventDefault();
                    this.props.onLastNextLine();
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
        this.inputUpdate(newText);
    }

    inputBlur(e) {
        if (e.relatedTarget === null || !e.relatedTarget.id.startsWith('searchResult')) {
            this.props.onEdit(false);
        }
    }

    accordionClick() {
        console.log('toggle');
    }

    fillResult(u) {
        const name = decodeURIComponent([...u.matchAll(/\?i=(.*)/g)][0][1]);
        if (u.startsWith('/mention')) {
            ChroamData.newMention(name);
            this.inputUpdate(this.props.text.trimRight() + ' ');
            this.setState({
                search: '',
            });
        }
        if (u.startsWith('/topic')) {
            ChroamData.newTopic(name);
            this.inputUpdate(this.props.text.trimRight() + ']] ');
            this.setState({
                search: '',
            });
        }
    }

    render() {
        var text = this.props.text
            .replace(ChroamItem.uncheckedCheckboxMatch, '')
            .replace(ChroamItem.checkedCheckboxMatch, '')
            .replace(ChroamItem.bulletMatch, '')
            .replace(ChroamItem.accordionMatch, '');
        const textComponents = [];
        const matches = [...text.matchAll(/\[\[(.*?)\]\]/g), ...text.matchAll(/#([äöüÄÖÜß_-\w]*)/g)].sort((a, b) => a.index - b.index);
        var index = 0;
        const textCompStyle = {
            display: 'inline',
        };
        const refCompStyle = {
            ...textCompStyle,
            color: teal.A700,
        };
        for (var i in matches) {
            const m = matches[i];
            const isTopic = m[0].startsWith('[[');
            textComponents.push(<div key={i * 2} style={textCompStyle}>{text.slice(index, m.index)}</div>);
            textComponents.push(<Link key={i * 2 + 1} style={refCompStyle} id={`chroamref${i}`} to={isTopic ? `/topic?i=${encodeURIComponent(m[1])}` : `/mention?i=${encodeURIComponent(m[1])}`}>{m[0]}</Link>);
            index = m.index + m[0].length;
        }
        

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
                        autoFocus onBlur={(e) => this.inputBlur(e)}
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
                            {textComponents}
                        </div>
                    </div>
                }
                {this.inputRef.current !== null &&
                    <SearchPopoverComponent popoverRef={this.popoverRef}
                        open={this.state.search !== '' && this.props.edit} onClose={() => { }}
                        anchorEl={this.inputRef.current}
                        query={this.state.search}
                        allowTopic={!this.state.searchMention}
                        allowDaily={false}
                        allowMention={this.state.searchMention}
                        setPage={(u) => this.fillResult(u)} />
                }
            </div>
        );
    }
}

export default muiTheme(EditLineComponent);
