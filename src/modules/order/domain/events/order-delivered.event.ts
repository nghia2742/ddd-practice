import { DomainEvent } from '@/kernel/domain-event';

export class OrderDeliveredEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
