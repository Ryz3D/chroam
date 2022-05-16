import { v4 as uuidv4 } from 'uuid';

class ChroamData {
    static getIDs() {
        return JSON.parse(localStorage.getItem('data') || '[]');
    }

    static setEntries(data) {
        localStorage.setItem('data', JSON.stringify(data));
    }

    static hasName(name) {
        return this.getIDs().findIndex(p => p.name === name) !== -1;
    }

    static addEntry(type, name) {
        const id = uuidv4();
        this.setEntries([...this.getIDs(), { id, type, name }]);
        return id;
    }

    static removeEntry(id) {
        this.setEntries(this.getIDs().filter(p => p.id !== id));
    }

    static newTopic(name) {
        if (this.hasName(name)) {
            return false;
        }
        else {
            return this.addEntry('topic', name);
        }
    }

    static newMention(name) {
        if (this.hasName(name)) {
            return false;
        }
        else {
            return this.addEntry('mention', name);
        }
    }
}

export default ChroamData;
