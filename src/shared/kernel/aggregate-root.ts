import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  protected id: string;
  protected createdAt: Date;
  protected domainEvents: DomainEvent[] = [];

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
