import { v4 as uuidv4 } from 'uuid';
import Parse from 'parse/dist/parse.min.js';

class ChroamData {
    static local = true;

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
                        resolve(res.map(this.readDBEntry));
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
                resolve(this.getEntries().findIndex(p => p.name === name && (type === undefined || p.type === type)) !== -1);
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
                resolve(this.getEntries().find(p => p.name === name && (type === undefined || p.type === type)));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', '0').equalTo('name', name);
                if (type !== undefined) {
                    q.equalTo('type', type);
                }
                q.find()
                    .then(res => {
                        resolve(this.readDBEntry(res[0]));
                    });
            }
        });
    }

    static getEntryById(id, type = undefined) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                resolve(this.getEntries().find(p => p.id === id && (type === undefined || p.type === type)));
            }
            else {
                const q = new Parse.Query('entry').equalTo('user', '0').equalTo('objectId', id);
                if (type !== undefined) {
                    q.equalTo('type', type);
                }
                q.find()
                    .then(res => {
                        resolve(this.readDBEntry(res[0]));
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
                this.setEntries([...this.getEntries().filter(p => p.id !== id), entry]);
                resolve(id);
            }
            else {
                if (this.timeoutTable[id]) {
                    clearTimeout(this.timeoutTable[id]);
                }
                this.timeoutTable[id] = setTimeout(() => {
                    console.log(id);
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
                }, 400);
            }
        });
    }

    static addEntry(type, name, extras = {}) {
        return this.setEntry({ type, name, ...extras });
    }

    static removeEntry(id) {
        return new Promise(resolve => {
            if (ChroamData.local) {
                this.setEntries(this.getEntries().filter(p => p.id !== id));
                resolve();
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
        if (this.hasName(name, 'topic')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return this.addEntry('topic', name, { content: { text: [] } });
        }
    }

    static newDaily(name) {
        if (this.hasName(name, 'daily')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return this.addEntry('daily', name, { content: { text: [] } });
        }
    }

    static newMention(name) {
        if (this.hasName(name, 'mention')) {
            return new Promise(resolve => resolve(false));
        }
        else {
            return this.addEntry('mention', name);
        }
    }
}

export default ChroamData;
