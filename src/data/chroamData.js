import { v4 as uuidv4 } from 'uuid';
import Parse from 'parse/dist/parse.min.js';

class ChroamData {
    static local = localStorage.getItem('local') ? true : false;
    static user = { id: localStorage.getItem('chroamUser') || uuidv4().slice(0, 8) };

    static readDBEntry(e) {
        if (e) {
            return {
                id: e.id,
                type: e.get('type'),
                name: e.get('name'),
                content: e.get('content'),
            };
        }
        else {
            return null;
        }
    }

    static getEntries(type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                resolve(JSON.parse(localStorage.getItem('chroamData') || '[]').filter(p => (p.type === type || type === undefined)));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', ChroamData.user.id);
                if (type !== undefined) {
                    q.equalTo('type', type);
                }
                q.find()
                    .then(res => {
                        resolve(res.map(ChroamData.readDBEntry));
                    });
            }
        });
    }

    static setEntries(data) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                localStorage.setItem('chroamData', JSON.stringify(data));
                resolve();
            }
            else {
                new Parse.Query('entry').equalTo('user', ChroamData.user.id).find()
                    .then(async res => {
                        for (var e of res) {
                            await e.destroy();
                        }
                        for (var e2 of data) {
                            const o = new Parse.Object('entry');
                            const { type, name, content } = e2;
                            o.set('user', ChroamData.user.id);
                            o.set('type', type);
                            o.set('name', name);
                            o.set('content', content);
                            await o.save();
                        }
                        resolve();
                    });
            }
        });
    }

    static hasName(name, type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.getEntries(type)
                    .then(e => resolve(e.findIndex(p => p.name === name) !== -1));
            }
            else {
                new Parse.Query('entry').equalTo('user', ChroamData.user.id).equalTo('name', name).find()
                    .then(res => {
                        resolve(res.length > 0);
                    });
            }
        });
    }

    static getEntryByName(name, type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.getEntries()
                    .then(e => resolve(e.find(p => p.name === name && (type === undefined || p.type === type))));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', ChroamData.user.id).equalTo('name', name);
                if (type !== undefined) {
                    q.equalTo('type', type);
                }
                q.find()
                    .then(res => {
                        resolve(ChroamData.readDBEntry(res[0]));
                    });
            }
        });
    }

    static getEntryById(id, type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.getEntries(type)
                    .then(e => resolve(e.find(p => p.id === id)));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', ChroamData.user.id).equalTo('objectId', id);
                if (type !== undefined) {
                    q.equalTo('type', type);
                }
                q.find()
                    .then(res => {
                        resolve(ChroamData.readDBEntry(res[0]));
                    });
            }
        });
    }

    static timeoutTable = {};

    static setEntry(entry) {
        const { id } = entry;
        return new Promise(resolve => {
            if (ChroamData.local) {
                if (!id) {
                    entry.id = uuidv4();
                }
                ChroamData.getEntries()
                    .then(e => {
                        ChroamData.setEntries([...e.filter(p => p.id !== id), entry])
                            .then(() => resolve(id));
                    });
            }
            else {
                if (ChroamData.timeoutTable[id]) {
                    clearTimeout(ChroamData.timeoutTable[id]);
                }
                ChroamData.timeoutTable[id] = setTimeout((e) => {
                    const o = new Parse.Object('entry');
                    o.set('user', ChroamData.user.id);
                    if (e.id) {
                        o.set('objectId', e.id);
                    }
                    o.set('type', e.type);
                    o.set('name', e.name);
                    o.set('content', e.content);
                    o.save()
                        .then(o2 => resolve(o2.id));
                    ChroamData.timeoutTable[e.id] = undefined;
                }, 400, entry);
            }
        });
    }

    static addEntry(type, name, extras = {}) {
        return new Promise(resolve => {
            ChroamData.setEntry({ type, name, ...extras })
                .then((id) => resolve(id));
        });
    }

    static removeEntry(id) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.getEntries()
                    .then(entries => {
                        ChroamData.setEntries(entries.filter(p => p.id !== id))
                            .then(() => resolve());
                    });
            }
            else {
                new Parse.Query('entry').equalTo('user', ChroamData.user.id).equalTo('objectId', id).find()
                    .then(res => {
                        if (res[0] !== undefined) {
                            res[0].destroy()
                                .then(() => resolve());
                        }
                    });
            }
        });
    }

    static newTopic(name) {
        return new Promise(resolve => {
            ChroamData.hasName(name, 'topic')
                .then(exists => {
                    if (exists) {
                        resolve(false);
                    }
                    else {
                        ChroamData.addEntry('topic', name, { content: { text: [], highlighted: false } })
                            .then((id) => resolve(id));
                    }
                });
        });
    }

    static newDaily(name) {
        return new Promise(resolve => {
            ChroamData.hasName(name, 'daily')
                .then(exists => {
                    if (exists) {
                        resolve(false);
                    }
                    else {
                        ChroamData.addEntry('daily', name, { content: { text: [], highlighted: false } })
                            .then((id) => resolve(id));
                    }
                });
        });
    }

    static newMention(name) {
        return new Promise(resolve => {
            ChroamData.hasName(name, 'mention')
                .then(exists => {
                    if (exists) {
                        resolve(false);
                    }
                    else {
                        ChroamData.addEntry('mention', name)
                            .then((id) => resolve(id));
                    }
                });
        });
    }
}

export default ChroamData;
