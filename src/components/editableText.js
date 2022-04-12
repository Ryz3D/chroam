import React from 'react';
import TextRootComponent from './textRoot';
import EditLineComponent from './editLine';

class EditableTextComponent extends React.Component {
    lineChange(t) {
        console.log(t);
        this.props.lineChange(t);
    }

    render() {
        return (
            <TextRootComponent>
                {this.props.content.text.map((line, i) =>
                    <EditLineComponent key={i} text={line}
                        onChange={(t) => this.lineChange(i, t)} />
                )}
                <EditLineComponent text='' focus={this.props.content.length === 0}
                    onChange={(t) => this.lineChange(this.props.content.length, t)} />
            </TextRootComponent>
        );
    }
}

export default EditableTextComponent;
