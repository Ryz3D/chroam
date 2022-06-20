import React from 'react';
import * as mui from '@mui/material';
import BasicUIComponent from '../components/basicUI';
import ChroamData from '../data/chroamData';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dwHref: '',
            dwName: '',
            newChroamData: [],
            dailyCount: 0,
            mentionCount: 0,
            topicCount: 0,
            dailyNew: 0,
            mentionNew: 0,
            topicNew: 0,
            confirmImportOpen: false,
            online: false,
        };
        this.downloadRef = React.createRef();
        this.fileRef = React.createRef();
    }

    export() {
        this.setState({
            dwHref: URL.createObjectURL(new Blob([
                JSON.stringify(ChroamData.getEntries()),
            ], {
                type: 'application/json',
            })),
            dwName: 'chroamData.json',
        }, () => this.downloadRef.current.click());
    }

    import() {
        this.fileRef.current.click();
    }

    actuallyImport(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const fr = new FileReader();
            fr.onloadend = () => {
                var newChroamData = [];
                try {
                    newChroamData = JSON.parse(fr.result);
                }
                catch (e) {
                    console.error(e);
                }
                if (newChroamData.length > 0) {
                    const cData = ChroamData.getEntries();
                    this.setState({
                        newChroamData,
                        dailyCount: newChroamData.filter(p => p.type === 'daily').length,
                        mentionCount: newChroamData.filter(p => p.type === 'mention').length,
                        topicCount: newChroamData.filter(p => p.type === 'topic').length,
                        dailyNew: newChroamData.filter(p => p.type === 'daily' && !cData.some(p2 => p2.id === p.id)).length,
                        mentionNew: newChroamData.filter(p => p.type === 'mention' && !cData.some(p2 => p2.id === p.id)).length,
                        topicNew: newChroamData.filter(p => p.type === 'topic' && !cData.some(p2 => p2.id === p.id)).length,
                        confirmImportOpen: true,
                    });
                }
            };
            fr.readAsText(files[0]);
        }
        event.target.value = null;
    }

    importOverwrite() {
        ChroamData.setEntries(this.state.newChroamData);
        this.setState({
            confirmImportOpen: false,
        });
    }

    importAppend() {
        var newData = ChroamData.getEntries();
        for (var e of this.state.newChroamData) {
            const iId = e.id;
            const newEntry = newData.find(p => p.id === iId);
            if (newEntry) {
                newEntry.name = e.name;
                if (e.type !== 'mention') {
                    newEntry.content ||= {};
                    var newText = newEntry.content.text || [];
                    for (var line of e.content.text) {
                        const iLine = line;
                        if (!newText.some(p => p === iLine)) {
                            newText.push(line);
                        }
                    }
                    newEntry.content.text = newText;
                    newData = [...newData.filter(p => p.id !== iId), newEntry];
                }
            }
            else {
                newData.push(e);
            }
        }
        ChroamData.setEntries(newData);
        this.setState({
            confirmImportOpen: false,
        });
    }

    onOnlineChange(online) {
        this.setState({
            online,
        });
        localStorage.setItem('local', online ? '' : '1');
        ChroamData.local = !online;
    }

    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.props.navigate(u)}>
                <div>
                    <mui.ButtonGroup fullWidth variant='contained' color='primary'>
                        <mui.Button onClick={() => this.export()}>
                            JSON Export
                        </mui.Button>
                        <mui.Button onClick={() => this.import()}>
                            JSON Import
                        </mui.Button>
                    </mui.ButtonGroup>
                    <mui.FormControlLabel control={<mui.Checkbox checked={this.state.online} onChange={(e, checked) => this.onOnlineChange(checked)} />} label='Enable Database' />
                    <mui.Modal open={this.state.confirmImportOpen} onClose={() => this.setState({ confirmImportOpen: false })}
                        sx={{ margin: '8vh auto', width: '80vw' }}>
                        <mui.Card sx={{ width: '80vw', padding: '15px' }}>
                            <mui.Typography>
                                Do you want to overwrite your current data or append this file? It contains:
                                <br />
                                - {this.state.dailyCount} dailies ({this.state.dailyNew} new)
                                <br />
                                - {this.state.mentionCount} mentions ({this.state.mentionNew} new)
                                <br />
                                - {this.state.topicCount} topics ({this.state.topicNew} new)
                            </mui.Typography>
                            <div style={{ height: '10px' }} />
                            <mui.ButtonGroup fullWidth variant='outlined'>
                                <mui.Button onClick={() => this.importOverwrite()}>
                                    Overwrite
                                </mui.Button>
                                <mui.Button onClick={() => this.importAppend()}>
                                    Append
                                </mui.Button>
                            </mui.ButtonGroup>
                        </mui.Card>
                    </mui.Modal>
                    <a style={{ display: 'none' }} ref={this.downloadRef} href={this.state.dwHref} download={this.state.dwName}>download</a>
                    <input style={{ display: 'none' }} type='file' ref={this.fileRef} onChange={(e) => this.actuallyImport(e)} accept='application/json' />
                </div>
            </BasicUIComponent>
        );
    }
}

export default SettingsPage;
