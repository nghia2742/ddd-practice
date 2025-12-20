import { DomainEvent } from '@/kernel/domain-event';

export class OrderCancelledEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
