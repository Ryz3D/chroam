import React from 'react';
import TextRootComponent from './textRoot';
import EditLineComponent from './editLine';

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

    onEdit(i, v) {
        if (v !== true) {
            var editOverride = null;
            if (v === -1) {
                editOverride = i - 1;
            }
            if (this.deleteIfEmtpy(i, editOverride)) {
                return;
            }
        }
        switch (v) {
            case true:
                this.setState({ edit: i });
                break;
            case false:
                this.setState({ edit: -1 });
                break;
            case -1:
                this.setState({ edit: Math.max(i - 1, 0) });
                break;
            case 1:
                this.setState({ edit: Math.min(i + 1, this.props.content.text.length) });
                break;
            default:
                break;
        }
    }

    onLineChange(i, t) {
        this.props.onLineChange(i, t);
    }

    onNextLine(i) {
        this.props.onNextLine(i, () => this.setState({
            edit: Math.min(i + 1, this.props.content.text.length),
        }));
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

    render() {
        console.log(this.state.edit);
        return (
            <TextRootComponent>
                {this.props.content.text.map((line, i) =>
                    <EditLineComponent key={i} text={line} edit={this.state.edit === i}
                        onEdit={(v) => this.onEdit(i, v)}
                        onLineChange={(t) => this.onLineChange(i, t)}
                        onNextLine={() => this.onNextLine(i)}
                        onLastLine={(d) => this.onLastLine(i, d)} />
                )}
                <EditLineComponent text='' focus={this.props.content.text.length === 0} edit={this.state.edit === this.props.content.text.length}
                    onEdit={(v) => this.onEdit(this.props.content.text.length, v)}
                    onLineChange={(t) => this.onLineChange(this.props.content.text.length, t)}
                    onNextLine={() => console.log('i refuse')}
                    onLastLine={(d) => this.onLastLine(this.props.content.text.length, d)} />
            </TextRootComponent>
        );
    }
}

export default EditableTextComponent;
