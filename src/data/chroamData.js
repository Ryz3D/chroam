import { v4 as uuidv4 } from 'uuid';

class ChroamData {
    static getEntries() {
        return JSON.parse(localStorage.getItem('chroamData') || '[]');
    }

    static setEntries(data) {
        localStorage.setItem('chroamData', JSON.stringify(data));
    }

    static hasName(name, type = undefined) {
        return this.getEntries().findIndex(p => p.name === name && (type === undefined || p.type === type)) !== -1;
    }

    static getEntryByName(name, type = undefined) {
        return this.getEntries().find(p => p.name === name && (type === undefined || p.type === type));
    }

    static getEntryById(id, type = undefined) {
        return this.getEntries().find(p => p.id === id && (type === undefined || p.type === type));
    }

    static setEntry(entry) {
        if (!entry.id) {
            entry.id = uuidv4();
        }
        this.setEntries([...this.getEntries().filter(p => p.id !== entry.id), entry]);
        return entry.id;
    }

    static addEntry(type, name, extras = {}) {
        return this.setEntry({ type, name, ...extras });
    }

    static removeEntry(id) {
        if (localStorage.getItem(id)) {
            localStorage.removeItem(id);
        }
        this.setEntries(this.getEntries().filter(p => p.id !== id));
    }

    static newTopic(name) {
        if (this.hasName(name, 'topic')) {
            return false;
        }
        else {
            return this.addEntry('topic', name, { content: { text: [] } });
        }
    }

    static newDaily(name) {
        if (this.hasName(name, 'daily')) {
            return false;
        }
        else {
            return this.addEntry('daily', name, { content: { text: [] } });
        }
    }

    static newMention(name) {
        if (this.hasName(name, 'mention')) {
            return false;
        }
        else {
            return this.addEntry('mention', name);
        }
    }
}

export default ChroamData;
