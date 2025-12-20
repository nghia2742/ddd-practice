import { DomainEvent } from '@/kernel/domain-event';

export class OrderShippedEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
