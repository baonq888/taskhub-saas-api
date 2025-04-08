import DomainEvent from "../../../../core/events/DomainEvent.js";

export class TaskAssignedEvent extends DomainEvent {
    getEventName() {
        return "task.assigned";
    }
}