class ChroamText {
    static serializeText(text) {
        return encodeURIComponent(text);
    }

    static deserializeText(str) {
        return decodeURIComponent(str);
    }
}

export default ChroamText;
