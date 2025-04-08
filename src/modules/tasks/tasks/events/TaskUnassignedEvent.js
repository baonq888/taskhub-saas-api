import DomainEvent from "../../../../core/events/DomainEvent.js";

export class TaskUnassignedEvent extends DomainEvent {
    getEventName() {
        return "task.unassigned";
    }
}