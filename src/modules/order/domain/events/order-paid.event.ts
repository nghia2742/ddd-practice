import { DomainEvent } from '@/kernel/domain-event';

export class OrderPaidEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
