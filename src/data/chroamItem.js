class ChroamItem {
    static uncheckedCheckboxMatch = /^\[?\s*\]/;
    static checkedCheckboxMatch = /^\[?x\]/;
    static bulletMatch = /^\s*-\s*/;
    static accordionMatch = /^\s*>\s*/;

    static isCheckbox(t) {
        return this.isUncheckedCheckbox(t) || this.isCheckedCheckbox(t);
    }

    static isUncheckedCheckbox(t) {
        return t.match(this.uncheckedCheckboxMatch) ? true : false;
    }

    static isCheckedCheckbox(t) {
        return t.match(this.checkedCheckboxMatch) ? true : false;
    }

    static isBullet(t) {
        return t.match(this.bulletMatch) ? true : false;
    }

    static isAccordion(t) {
        return t.match(this.accordionMatch) ? true : false;
    }
}

export default ChroamItem;
