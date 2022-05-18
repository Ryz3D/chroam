import { v4 as uuidv4 } from 'uuid';

class ChroamData {
    static getEntries() {
        return JSON.parse(localStorage.getItem('chroamData') || '[]');
    }

    static setEntries(data) {
        localStorage.setItem('chroamData', JSON.stringify(data));
    }

    static hasName(name) {
        return this.getEntries().findIndex(p => p.name === name) !== -1;
    }

    static addEntry(type, name) {
        const id = uuidv4();
        this.setEntries([...this.getEntries(), { id, type, name }]);
        return id;
    }

    static removeEntry(id) {
        this.setEntries(this.getEntries().filter(p => p.id !== id));
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
