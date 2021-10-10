export class PubSub {
    constructor() {
        this.counter = 0;
        this.listeners = {};
    }

    publish(key, data) {
        if (this.listeners[key]) {
            let listenerKeys = Object.keys(this.listeners[key]);
            for (let i = 0; i < listenerKeys.length; ++i) {
                listenerKeys[key][listenerKeys[i]](data);
            }
        }
    }

    subscribe(key, callback) {
        let subKey = this.counter++;
        this.listeners[key][subKey] = callback;
        return subKey;
    }

    unsub(key, listenerID) {
        delete this.listeners[key][listenerID];
    }
}