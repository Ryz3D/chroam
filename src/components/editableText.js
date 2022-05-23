import React from 'react';
import TextRootComponent from './textRoot';
import EditLineComponent from './editLine';
import ChroamItem from '../data/chroamItem';

/*

TODO:
 - CTRL-Z undo CTRL-SHIFT-Z redo

*/

class EditableTextComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: -1,
        };
    }

    deleteIfEmtpy(i, editOverride = null) {
        if (!this.props.content.text[i] && i < this.props.content.text.length) {
            this.props.onDeleteLine(i, () => this.setState({
                edit: editOverride === null ? -1 : editOverride,
            }));
            return true;
        }
        return false;
    }

    addIfNew() {
        if (this.state.edit === this.props.content.text.length) {
            this.props.onLineChange(this.state.edit, '');
        }
    }

    onEdit(i, v) {
        if (v !== true) {
            var editOverride = null;
            if (v === -1) {
                editOverride = i - 1;
            }
            if (!(v === 1 && i === this.props.content.text.length - 1)) {
                if (this.deleteIfEmtpy(i, editOverride)) {
                    return;
                }
            }
        }
        switch (v) {
            case true:
                this.setState({ edit: i }, () => this.addIfNew());
                break;
            case false:
                this.setState({ edit: -1 });
                break;
            case -1:
                this.setState({ edit: Math.max(i - 1, 0) });
                break;
            case 1:
                const contentLength = this.props.content.text.findLastIndex(p => p) + 1;
                this.setState({ edit: Math.min(i + 1, contentLength) }, () => this.addIfNew());
                break;
            default:
                break;
        }
    }

    onLineChange(i, t) {
        this.props.onLineChange(i, t);
    }

    onNextLine(i, line) {
        var newContent = '';
        if (ChroamItem.isCheckbox(line)) {
            newContent = '[] ';
        }
        if (ChroamItem.isBullet(line)) {
            newContent = '- ';
        }
        if (ChroamItem.isAccordion(line)) {
            // newContent = '> ';
        }
        this.props.onNextLine(i, () => this.setState({
            edit: Math.min(i + 1, this.props.content.text.length),
        }), newContent);
    }

    onLastLine(i, del) {
        if (del) {
            this.props.onDeleteLine(i, () => this.setState({
                edit: i - 1,
            }));
        }
        else {
            this.setState({
                edit: i - 1,
            });
        }
    }

    onLastNextLine(i) {
        this.props.onDeleteLine(i, () => this.setState({
            edit: i,
        }));
    }

    render() {
        const lineStyle = {
            display: 'flex',
            flexDirection: 'column',
        };
        const lineNStyle = {
            position: 'absolute',
            right: '15px',
            color: '#777',
            userSelect: 'none',
        };

        return (
            <TextRootComponent>
                {this.props.content.text.map((line, i) =>
                    <div style={lineStyle} key={i}>
                        <div>
                            <EditLineComponent text={line} edit={this.state.edit === i}
                                onEdit={(v) => this.onEdit(i, v)}
                                onLineChange={(t) => this.onLineChange(i, t)}
                                onNextLine={() => this.onNextLine(i, line)}
                                onLastLine={(d) => this.onLastLine(i, d)}
                                onLastNextLine={() => this.onLastNextLine(i)} />
                        </div>
                        <div style={lineNStyle}>
                            #{i + 1}
                        </div>
                    </div>
                )}
                <EditLineComponent text='' edit={this.state.edit === this.props.content.text.length}
                    onEdit={(v) => this.onEdit(this.props.content.text.length, v)}
                    onLineChange={(t) => this.onLineChange(this.props.content.text.length, t)}
                    onNextLine={() => console.log('i refuse')}
                    onLastLine={(d) => this.onLastLine(this.props.content.text.length, d)}
                    onLastNextLine={() => { }}
                    highlight />
            </TextRootComponent>
        );
    }
}

export default EditableTextComponent;
