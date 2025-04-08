class DomainEvent {
    constructor(payload) {
        if (this.constructor === DomainEvent) {
            throw new Error("DomainEvent is abstract and can't be instantiated directly.");
        }

        this.payload = payload;
        this.timestamp = new Date();
        this.name = this.getEventName();
    }

    getEventName() {
        throw new Error("getEventName() must be implemented by subclass.");
    }
}

export default DomainEvent