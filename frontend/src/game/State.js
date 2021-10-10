export default class State {
    constructor(type) {
        this.type = type;
    }

    _toJSON() {
        return {
            type: this.type
        };
    }

    _fromJSON(obj) {
        return obj.type == this.type;
    }
}