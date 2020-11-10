class EventTarget {
    constructor() {
        this.eventMap = {};
    }
    on(eventName, callback) {
        (this.eventMap[eventName] = this.eventMap[eventName] || new Set()).add(callback);
        return () => this.off(eventName, callback);
    }

    off(eventName, callback) {
        (this.eventMap[eventName] = this.eventMap[eventName] || new Set()).delete(callback);
    }

    emit(eventName, payload) {
        (this.eventMap[eventName] = this.eventMap[eventName] || new Set()).forEach(callback => callback(payload));
    }
}