import { v4 as uuidv4 } from 'uuid';
import Parse from 'parse/dist/parse.min.js';

class ChroamData {
    static local = localStorage.getItem('local') ? true : false;

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

    static getEntries() {
        return new Promise(resolve => {
            if (ChroamData.local) {
                resolve(JSON.parse(localStorage.getItem('chroamData') || '[]'));
            }
            else {
                new Parse.Query('entry').equalTo('user', '0').find()
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
                new Parse.Query('entry').equalTo('user', '0').find()
                    .then(res => {
                        var destroyed = 0;
                        const onDestroyed = () => {
                            destroyed++; // TODO: USE AWAIT INSTEAD <----------------
                            if (destroyed >= res.length) {
                                var completed = 0;
                                const onSaved = () => {
                                    completed++;
                                    if (completed >= data.length) {
                                        resolve();
                                    }
                                };
                                for (var e2 of data) {
                                    const o = new Parse.Object('entry');
                                    const { id, type, name, content } = e2;
                                    o.set('user', '0');
                                    o.set('objectId', id);
                                    o.set('type', type);
                                    o.set('name', name);
                                    o.set('content', content);
                                    o.save()
                                        .then(onSaved);
                                }
                            }
                        };
                        for (var e of res) {
                            e.destroy()
                                .then(onDestroyed);
                        }
                    });
            }
        });
    }

    static hasName(name, type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.getEntries()
                    .then(e => resolve(e.findIndex(p => p.name === name && (type === undefined || p.type === type)) !== -1));
            }
            else {
                new Parse.Query('entry').equalTo('user', '0').equalTo('name', name).find()
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
                const q = new Parse.Query('entry').equalTo('user', '0').equalTo('name', name);
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
                ChroamData.getEntries()
                    .then(e => resolve(e.find(p => p.id === id && (type === undefined || p.type === type))));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', '0').equalTo('objectId', id);
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
        const { id, type, name, content } = entry;
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
                ChroamData.timeoutTable[id] = setTimeout(() => {
                    const o = new Parse.Object('entry');
                    o.set('user', '0');
                    if (id) {
                        o.set('objectId', id);
                    }
                    o.set('type', type);
                    o.set('name', name);
                    o.set('content', content);
                    o.save()
                        .then(o2 => resolve(o2.get('objectId')));
                    ChroamData.timeoutTable[id] = undefined;
                }, 400);
            }
        });
    }

    static addEntry(type, name, extras = {}) {
        return ChroamData.setEntry({ type, name, ...extras });
    }

    static removeEntry(id) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                ChroamData.setEntries(ChroamData.getEntries().filter(p => p.id !== id))
                    .then(() => resolve());
            }
            else {
                new Parse.Query('entry').equalTo('user', '0').equalTo('objectId', id).find()
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
        if (ChroamData.hasName(name, 'topic')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return ChroamData.addEntry('topic', name, { content: { text: [] } });
        }
    }

    static newDaily(name) {
        if (ChroamData.hasName(name, 'daily')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return ChroamData.addEntry('daily', name, { content: { text: [] } });
        }
    }

    static newMention(name) {
        if (ChroamData.hasName(name, 'mention')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return ChroamData.addEntry('mention', name);
        }
    }
}

export default ChroamData;
