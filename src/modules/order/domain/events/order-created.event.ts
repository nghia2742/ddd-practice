import { DomainEvent } from '@/kernel/domain-event';

export class OrderCreatedEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
