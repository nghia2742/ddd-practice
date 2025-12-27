# 📦 DDD Order Management System

A comprehensive ecommerce order management system built with **Domain-Driven Design (DDD)** and NestJS.

> Customers can create orders with multiple items and track the lifecycle from Pending → Paid → Shipped → Delivered.
> Includes shipping fees, discounts, taxes, and total amount calculation.

## 🎯 Key Features

- ✅ **Create Orders** with inventory validation
- ✅ **Order Lifecycle Management** (Pending → Paid → Shipped → Delivered)
- ✅ **Dynamic Pricing** (subtotal + shipping + tax - discount)
- ✅ **Shipping Address Validation** with postal code rules
- ✅ **Payment Processing** with multiple payment methods
- ✅ **Order Cancellation** following business rules
- ✅ **Domain Events** for state changes

---

## 📁 Project Structure

```
ddd-practice/
├── src/
│   ├── app.module.ts                 # Main application module
│   ├── main.ts                       # Entry point
│   ├── config/
│   │   └── database.config.ts        # Database configuration
│   │
│   ├── modules/
│   │   └── order/                    # 🏛️ ORDER MODULE (DDD)
│   │       │
│   │       ├── domain/               # 🔴 LAYER: DOMAIN (Business Logic Core)
│   │       │   ├── aggregates/
│   │       │   │   └── order.aggregate.ts     # Aggregate Root - Order
│   │       │   ├── entities/
│   │       │   │   └── order-item.entity.ts   # Child Entity of Order
│   │       │   ├── value-objects/             # Value Objects (immutable)
│   │       │   │   ├── order-id.vo.ts
│   │       │   │   ├── customer-id.vo.ts
│   │       │   │   ├── money.vo.ts
│   │       │   │   ├── quantity.vo.ts
│   │       │   │   ├── address.vo.ts
│   │       │   │   ├── order-status.vo.ts
│   │       │   │   ├── discount.vo.ts
│   │       │   │   └── product-id.vo.ts
│   │       │   ├── services/                  # Domain Services (business logic)
│   │       │   │   ├── pricing.domain-service.ts
│   │       │   │   └── stock.domain-service.ts
│   │       │   ├── policies/                  # Business Policies
│   │       │   │   └── payment.policy.ts
│   │       │   ├── events/                    # Domain Events
│   │       │   │   ├── order-created.event.ts
│   │       │   │   ├── order-paid.event.ts
│   │       │   │   ├── order-shipped.event.ts
│   │       │   │   ├── order-delivered.event.ts
│   │       │   │   └── order-cancelled.event.ts
│   │       │   ├── repositories/              # Repository Interfaces (Ports)
│   │       │   │   ├── order.repository.ts
│   │       │   │   └── stock.repository.ts
│   │       │   └── errors/
│   │       │       └── order.error.ts
│   │       │
│   │       ├── application/          # 🟡 LAYER: APPLICATION (Use Cases)
│   │       │   ├── use-cases/        # Use Cases (Orchestration)
│   │       │   │   ├── create-order.use-case.ts
│   │       │   │   ├── pay-order.use-case.ts
│   │       │   │   ├── ship-order.use-case.ts
│   │       │   │   ├── deliver-order.use-case.ts
│   │       │   │   └── cancel-order.use-case.ts
│   │       │   ├── dto/              # Data Transfer Objects
│   │       │   │   ├── create-order.dto.ts
│   │       │   │   └── order-response.dto.ts
│   │       │   ├── mappers/          # DTO ↔ Domain Mappers
│   │       │   │   └── order.mapper.ts
│   │       │   └── services/         # Application Services
│   │       │       └── (orchestration services)
│   │       │
│   │       ├── infrastructure/       # 🔵 LAYER: INFRASTRUCTURE (Adapters)
│   │       │   ├── entities/         # Database Entities (ORM)
│   │       │   │   ├── order.entity.ts
│   │       │   │   ├── order-item.entity.ts
│   │       │   │   └── stock.entity.ts
│   │       │   ├── repositories/     # Repository Implementations (Adapters)
│   │       │   │   ├── order.repository.ts
│   │       │   │   └── stock.repository.ts
│   │       │   └── mappers/          # Domain ↔ Database Mappers
│   │       │       └── order.mapper.ts
│   │       │
│   │       ├── presentation/         # 🟢 LAYER: PRESENTATION (Controllers)
│   │       │   ├── controllers/
│   │       │   │   └── order.controller.ts
│   │       │   ├── filters/          # Exception Filters
│   │       │   ├── guards/           # Authorization Guards
│   │       │   └── interceptors/     # Response Interceptors
│   │       │
│   │       └── order.module.ts       # NestJS Module Definition
│   │
│   └── shared/                       # 🟣 SHARED KERNEL
│       ├── kernel/                   # Base Classes & Interfaces
│       │   ├── aggregate-root.ts     # Base class for Aggregate Roots
│       │   ├── domain-event.ts       # Interface for Domain Events
│       │   ├── event-handler.interface.ts
│       │   └── repository.interface.ts
│       └── utils/
│           └── uuid.util.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── docker-compose.yml                # Database & Services
├── package.json
├── tsconfig.json
└── README.md
```

### 📊 Layer Explanation

| Layer              | Purpose                 | Dependencies          | Example                       |
| ------------------ | ----------------------- | --------------------- | ----------------------------- |
| **Domain**         | Pure business logic     | No dependencies       | Order, Money, OrderStatusCode |
| **Application**    | Orchestration Use Cases | → Domain              | CreateOrderUseCase            |
| **Infrastructure** | Adapters & Persistence  | → Domain, Application | OrderRepositoryImpl, Database |
| **Presentation**   | Controllers & HTTP      | → Application         | OrderController               |
| **Shared Kernel**  | Reusable Base Classes   | No dependencies       | AggregateRoot, DomainEvent    |

---

## 🔄 Workflows & Main Processes

### 📈 Order Lifecycle

```
┌─────────┐
│ PENDING │  ← Order just created
└────┬────┘
     │ (PayOrderUseCase - Payment)
     ↓
┌─────────┐
│  PAID   │  ← Order paid
└────┬────┘
     │ (ShipOrderUseCase - Shipment)
     ↓
┌──────────┐
│ SHIPPED  │  ← Order shipped
└────┬─────┘
     │ (DeliverOrderUseCase - Delivery)
     ↓
┌───────────┐
│ DELIVERED │  ← Order delivered successfully
└───────────┘

OR:

PENDING ──(CancelOrderUseCase)──> CANCELLED
  PAID ──(CancelOrderUseCase)──> CANCELLED  (only if not shipped)
```

### 1️⃣ **Create Order Workflow**

```
Request from Client
      ↓
[Presentation Layer]
  OrderController.createOrder(dto)
      ↓
[Application Layer]
  CreateOrderUseCase.execute()
      ├─ Validate input (DTO validation)
      ├─ Check Stock via StockDomainService
      ├─ Validate Address
      ├─ Calculate Pricing via PricingDomainService
      │  └─ subtotal + shipping + tax - discount
      ├─ Create Order Aggregate (Domain Layer)
      └─ Save via OrderRepository
      ↓
[Domain Event Published]
  OrderCreatedEvent
      ↓
[Response]
  Return Order DTO to Client
```

### 2️⃣ **Pay Order Workflow**

```
PayOrderRequest
      ↓
[Presentation Layer]
  OrderController.payOrder(orderId, paymentMethod)
      ↓
[Application Layer]
  PayOrderUseCase.execute()
      ├─ Load Order from Repository
      ├─ Check Order.status === PENDING
      ├─ Call PaymentPolicyService.process()
      │  └─ Process payment (credit card / bank / COD)
      ├─ Update Order.status = PAID
      ├─ Set Order.paidAt = now()
      └─ Save Order via Repository
      ↓
[Domain Event Published]
  OrderPaidEvent
      ↓
[Response]
  Return updated Order DTO
```

### 3️⃣ **Ship Order Workflow**

```
ShipOrderRequest
      ↓
[Application Layer]
  ShipOrderUseCase.execute()
      ├─ Load Order from Repository
      ├─ Check Order.status === PAID (must be paid)
      ├─ Update Order.status = SHIPPED
      ├─ Set Order.shippedAt = now()
      └─ Save Order via Repository
      ↓
[Domain Event Published]
  OrderShippedEvent
      ↓
[Response]
  Return updated Order DTO
```

### 4️⃣ **Cancel Order Workflow**

```
CancelOrderRequest
      ↓
[Application Layer]
  CancelOrderUseCase.execute()
      ├─ Load Order from Repository
      ├─ Check Order.status ∈ [PENDING, PAID]
      ├─ If PAID: Check not shipped yet
      ├─ Update Order.status = CANCELLED
      └─ Save Order via Repository
      ↓
[Domain Event Published]
  OrderCancelledEvent (may trigger refund)
      ↓
[Response]
  Return updated Order DTO
```

---

## 1️⃣ Domain Model Overview

### 1️⃣ Aggregate Root: Order

```typescript
// src/modules/order/domain/aggregates/order.aggregate.ts

Order (Aggregate Root)
├── id: OrderId (VO)
├── customerId: CustomerId (VO)
├── items: OrderItem[]
│   ├── productId: ProductId (VO)
│   ├── price: Money (VO)
│   └── quantity: Quantity (VO)
├── status: OrderStatusCode (VO - Enum)
├── shippingAddress: Address (VO)
├── discount?: Discount (VO)
├── shippingFee: Money (VO)
├── taxAmount: Money (VO)
├── totalAmount: Money (VO)
├── createdAt: Date
├── paidAt?: Date
├── shippedAt?: Date
└── deliveredAt?: Date
```

### 2️⃣ Entities

```typescript
// OrderItem Entity - Child of Order Aggregate
OrderItem
├── id: OrderItemId (VO)
├── productId: ProductId (VO)
├── price: Money (VO)
├── quantity: Quantity (VO)
└── total: Money (calculated)
```

**Rules:**

- Quantity ≥ 1
- Price is Money VO (amount ≥ 0)
- Cannot modify item after Order is PAID

### 3️⃣ Value Objects

Immutable, identity based on values, no mutable state:

```typescript
Money {
  amount: number,      // ≥ 0
  currency: string     // "VND", "USD", etc.
}

Quantity {
  value: number        // ≥ 1
}

OrderStatusCode {
  value: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
}

Address {
  street: string,
  city: string,
  country: string,
  postalCode: string   // must be valid format
}

Discount {
  type: "PERCENTAGE" | "FIXED",
  value: number        // % ≤ 50%, FIXED ≤ subtotal
}

OrderId / CustomerId / ProductId {
  value: UUID
}
```

**Benefits:**

- ✅ Immutable → thread-safe
- ✅ Self-validating → no invalid state
- ✅ Rich semantics → `Money` not just `number`

### 4️⃣ Domain Services

Services containing complex business logic not suitable for Entities:

```typescript
// PricingDomainService
calculate(subtotal, shippingFee, tax, discount): Money {
  // total = subtotal + shipping + tax - discount
  // Only in domain/services
  // Called from UseCase or Domain Model
}

// StockDomainService
checkAvailability(items[]): boolean {
  // Check if inventory is available
  // Interface in domain, implementation in infrastructure
}
```

### Business Policies

Policies encapsulate specific business rules or workflows:

```typescript
// PaymentPolicy
process(paymentMethod, amount): PaymentResult {
  // Process payment by method
}
```

### 5️⃣ Domain Events

Events published when Aggregate state changes:

```typescript
// Domain Events - Occur when state changes
OrderCreatedEvent {
  orderId: OrderId,
  customerId: CustomerId,
  totalAmount: Money,
  createdAt: Date
}

OrderPaidEvent {
  orderId: OrderId,
  paidAt: Date
}

OrderShippedEvent {
  orderId: OrderId,
  shippedAt: Date
}

OrderDeliveredEvent {
  orderId: OrderId,
  deliveredAt: Date
}

OrderCancelledEvent {
  orderId: OrderId,
  cancelledAt: Date
}
```

**Usage:**

- Published from Aggregate Root
- Subscribed from Event Subscribers (Infrastructure Layer)
- Trigger side effects (send emails, update analytics, etc.)

---

## ⚙️ Setup & Running Guide

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Configure Database**

Update `.env` file (or use `docker-compose.yml`):

```bash
# Start PostgreSQL with Docker
docker-compose up -d
```

### 3. **Start Development Server**

```bash
# Watch mode (auto-reload on code changes)
npm run start:dev

# Server will run at: http://localhost:3000
```

### 4. **Format & Lint**

```bash
npm run format     # Prettier format code
npm run lint       # ESLint check & fix
```

---

## 📝 API Examples (Runnable)

### 🔗 Base URL: `http://localhost:3000`

### **1️⃣ Create Order**

**Endpoint:** `POST /orders`

**Request Body:**

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "660e8400-e29b-41d4-a716-446655440001",
      "price": 100000,
      "quantity": 1
    },
    {
      "productId": "660e8400-e29b-41d4-a716-446655440002",
      "price": 50000,
      "quantity": 3
    }
  ],
  "shippingAddress": {
    "street": "123 Nguyen Hue",
    "city": "Ho Chi Minh",
    "country": "VN",
    "postalCode": "700000"
  },
  "discount": {
    "type": "PERCENTAGE",
    "value": 10
  },
  "currency": "VND",
  "shippingFee": 25000
}
```

**Response (201 Created):**

```json
{
  "id": "251292e7-1c6e-4cdc-bb08-9857a65a050d",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "17dfbcbe-119d-48da-900f-42336d6654c7",
      "productId": "660e8400-e29b-41d4-a716-446655440001",
      "price": 100000,
      "quantity": 1,
      "total": 100000
    },
    {
      "id": "69d66dc3-6943-4195-af43-7d75c14d658d",
      "productId": "660e8400-e29b-41d4-a716-446655440002",
      "price": 50000,
      "quantity": 3,
      "total": 150000
    }
  ],
  "currency": "VND",
  "status": "PENDING",
  "shippingAddress": {
    "street": "123 Nguyen Hue",
    "city": "Ho Chi Minh",
    "country": "VN",
    "postalCode": "700000"
  },
  "shippingFee": 25000,
  "taxAmount": 25000,
  "totalAmount": 275000,
  "discount": {
    "type": "PERCENTAGE",
    "value": 10
  },
  "createdAt": "2025-12-27T05:14:31.005Z"
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "items": [{"productId": "660e8400-e29b-41d4-a716-446655440001", "price": {"amount": 100000, "currency": "VND"}, "quantity": 2}],
    "shippingAddress": {"street": "123 Nguyen Hue", "city": "Ho Chi Minh", "country": "VN", "postalCode": "700000"}
  }'
```

---

### **2️⃣ Pay Order**

**Endpoint:** `POST /orders/:orderId/pay`

**Request Body:**

```json
{
  "paymentMethod": "CREDIT_CARD"
}
```

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PAID",
  "paidAt": "2025-12-20T10:05:00Z",
  "totalAmount": {
    "amount": 283000,
    "currency": "VND"
  }
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/orders/770e8400-e29b-41d4-a716-446655440000/pay \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "CREDIT_CARD"}'
```

---

### **3️⃣ Ship Order**

**Endpoint:** `POST /orders/:orderId/ship`

**Request Body:** (Empty)

```json
{}
```

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "SHIPPED",
  "shippedAt": "2025-12-20T10:10:00Z"
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/orders/770e8400-e29b-41d4-a716-446655440000/ship \
  -H "Content-Type: application/json"
```

---

### **4️⃣ Deliver Order**

**Endpoint:** `POST /orders/:orderId/deliver`

**Request Body:** (Empty)

```json
{}
```

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "DELIVERED",
  "deliveredAt": "2025-12-20T10:20:00Z"
}
```

---

### **5️⃣ Cancel Order**

**Endpoint:** `POST /orders/:orderId/cancel`

**Request Body:** (Empty)

```json
{}
```

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "CANCELLED",
  "cancelledAt": "2025-12-20T10:15:00Z"
}
```

**Conditions:**

- Can only cancel when status is `PENDING` or `PAID` (not shipped)
- If status is `SHIPPED` or `DELIVERED`, system will return error

---

### **6️⃣ Get Order**

**Endpoint:** `GET /orders/:orderId`

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "DELIVERED",
  "items": [...],
  "subtotal": {...},
  "shippingFee": {...},
  "taxAmount": {...},
  "totalAmount": {...},
  "createdAt": "2025-12-20T10:00:00Z",
  "paidAt": "2025-12-20T10:05:00Z",
  "shippedAt": "2025-12-20T10:10:00Z",
  "deliveredAt": "2025-12-20T10:20:00Z"
}
```

---

## 🧪 Testing

### **Unit Tests**

```bash
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

### **E2E Tests**

```bash
npm run test:e2e
```

---

## 🏗️ Clean Architecture + DDD

### **Dependency Diagram**

```
Presentation Layer (Controllers)
        ↓ depends on
Application Layer (UseCase)
        ↓ depends on
Domain Layer (Business Logic)
        ↑ interface only
Infrastructure Layer (Database, External Services)
        ↑
Shared Kernel (Base Classes, Events)
```

### **Key Rules**

1. **Domain Layer has no dependencies** - Contains core business logic
2. **Application Layer depends on Domain** - Orchestrates use cases
3. **Infrastructure depends on Domain** - Implements repository interfaces
4. **Presentation depends on Application** - Controllers call UseCases
5. **Shared Kernel**: Base classes, used by all layers

---

## 📚 Key Concepts

### **Aggregate Root (Order)**

- Entity responsible for managing aggregate state
- Protects business rules
- Publishes domain events

### **Value Objects**

- Immutable
- Has business meaning (Money not just number)
- Self-validating

### **Domain Services**

- Logic too complex for entity
- No state
- Depends on repositories (interfaces)

### **Use Cases**

- Orchestrate domain model
- One use case per file
- May throw domain exceptions

### **Repository Pattern**

- Interface in domain
- Implementation in infrastructure
- Abstracts away persistence details

### **Domain Events**

- Published when aggregate state changes
- Subscribed from infrastructure (event subscribers)
- Trigger side effects

---

## 🔍 2️⃣ Order Aggregate – Detailed Business Rules

### 🧱 Order Entity - Fields & Constraints

**Main fields:**

- `id`: OrderId (VO)
- `customerId`: CustomerId (VO)
- `items`: OrderItem[]
- `status`: OrderStatusCode (VO - enum)
- `shippingAddress`: Address (VO)
- `discount?`: Discount (VO - optional)
- `shippingFee`: Money (VO)
- `taxAmount`: Money (VO)
- `totalAmount`: Money (VO)
- `createdAt`: Date
- `paidAt?`: Date
- `shippedAt?`: Date
- `deliveredAt?`: Date

#### 🔐 Rule 1: Order Lifecycle

Orders can only transition between states following these rules:

- `PENDING` → `PAID` → `SHIPPED` → `DELIVERED`
- `PENDING` → `CANCELLED`
- `PAID` → `CANCELLED` (only if not shipped)

**🚫 Invalid transitions:**

- Cannot ship if not paid
- Cannot cancel after shipped
- Cannot mark delivered if not shipped

#### 🧮 Rule 2: Pricing Calculation

Total amount is calculated as:

```
subtotal = sum(items.price × items.quantity)
total = subtotal + shippingFee + taxAmount - discountAmount
```

**Details:**

- `shippingFee`: Depends on distance
- `taxAmount`: 10% (default)
- `discount`: Only applies if subtotal > 500,000 VND
- Item price must be Money VO

💡 **Uses PricingDomainService**

#### 🔐 Rule 3: OrderItem

OrderItem always follows:

- `quantity` ≥ 1
- `price` is Money VO
- Cannot modify item after Order is PAID

#### 🚚 Rule 4: ShippingAddress

**Value Object:**

- `street`: Street name
- `city`: City name
- `country`: Country
- `postalCode`: Postal code

**Constraints:**

- Postal code must be valid format
- Country must be in supported list

#### 🏷 Rule 5: Discount

**Discount VO:**

- `type`: "PERCENTAGE" | "FIXED"
- `value`: number

**Constraints:**

- Percentage ≤ 50%
- Fixed ≤ subtotal
- Cannot apply discount after payment

#### 🛒 Rule 6: Stock Validation

Order can only be created if all items are in stock.

➡️ **Uses StockDomainService**

#### 💰 Rule 7: Payment

Orders can be paid via:

- Credit card
- Bank transfer
- COD (Cash on Delivery)

**Rules:**

- Order must be in PENDING state
- Successful payment → triggers OrderPaidEvent

---

## 3️⃣ Use Cases (Application Layer)

Main use cases:

### **1️⃣ CreateOrderUseCase**

**Input:**

- `customerId`
- `items[]`
- `shippingAddress`
- `discount?`

**Process:**

1. Validate input from DTO
2. Check inventory via StockDomainService
3. Validate shipping address
4. Calculate pricing via PricingDomainService
5. Create Order Aggregate (Domain)
6. Save via OrderRepository
7. Publish OrderCreatedEvent

### **2️⃣ PayOrderUseCase**

**Input:**

- `orderId`
- `paymentMethod`

**Process:**

1. Load Order from Repository
2. Check Order.status === PENDING
3. Process payment via PaymentPolicy
4. Update status → PAID, set paidAt
5. Save Order
6. Publish OrderPaidEvent

### **3️⃣ ShipOrderUseCase**

**Process:**

1. Load Order from Repository
2. Check Order.status === PAID
3. Update status → SHIPPED, set shippedAt
4. Save Order
5. Publish OrderShippedEvent

### **4️⃣ DeliverOrderUseCase**

**Process:**

1. Load Order from Repository
2. Check Order.status === SHIPPED
3. Update status → DELIVERED, set deliveredAt
4. Save Order
5. Publish OrderDeliveredEvent

### **5️⃣ CancelOrderUseCase**

**Process:**

1. Load Order from Repository
2. Check Order.status ∈ [PENDING, PAID]
3. If PAID: Check not shipped yet
4. Update status → CANCELLED
5. Save Order
6. Publish OrderCancelledEvent

---

## 📦 Repository Interfaces (Ports)

### **OrderRepository**

Interface defined in Domain, implemented in Infrastructure:

```typescript
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  save(order: Order): Promise<void>;
  delete(id: OrderId): Promise<void>;
}
```

### **StockRepository**

Used only by StockDomainService:

```typescript
interface StockRepository {
  checkAvailability(items: OrderItem[]): Promise<boolean>;
}
```

---

## 🔍 Detailed Architecture: DDD + Clean Architecture + NestJS

```
src/
  modules/
    order/
      # 🔴 DOMAIN LAYER (Business Logic Core)
      domain/
        aggregates/
          order.aggregate.ts        # Aggregate Root
        entities/
          order-item.entity.ts      # Child Entity
        value-objects/
          order-id.vo.ts
          customer-id.vo.ts
          money.vo.ts
          quantity.vo.ts
          address.vo.ts
          order-status.vo.ts
          discount.vo.ts
          product-id.vo.ts
        services/
          pricing.domain-service.ts # Pricing calculation
          stock.domain-service.ts   # Stock checking
        policies/
          payment.policy.ts         # Payment processing
        repositories/
          order.repository.ts       # Interface (Port)
          stock.repository.ts
        events/
          order-created.event.ts
          order-paid.event.ts
          order-shipped.event.ts
          order-delivered.event.ts
          order-cancelled.event.ts
        errors/
          order.error.ts

      # 🟡 APPLICATION LAYER (Use Cases & Orchestration)
      application/
        use-cases/
          create-order.use-case.ts
          pay-order.use-case.ts
          ship-order.use-case.ts
          deliver-order.use-case.ts
          cancel-order.use-case.ts
        dto/
          create-order.dto.ts       # Input DTO
          order-response.dto.ts     # Output DTO
        mappers/
          order.mapper.ts           # DTO ↔ Domain mapping
        services/
          # Application-level services (orchestration only)

      # 🔵 INFRASTRUCTURE LAYER (Adapters & Persistence)
      infrastructure/
        entities/
          order.entity.ts           # TypeORM Entity
          order-item.entity.ts
          stock.entity.ts
        repositories/
          order.repository.ts       # Implementation (Adapter)
          stock.repository.ts
        mappers/
          order.mapper.ts           # Domain ↔ DB mapping
        subscribers/
          order-created.subscriber.ts

      # 🟢 PRESENTATION LAYER (Controllers & HTTP)
      presentation/
        controllers/
          order.controller.ts       # HTTP Endpoints
        filters/                    # Exception Filters
          all-exceptions.filter.ts  # Catch all unhandled exceptions
          base-exception.filter.ts  # Base filter class
          index.ts                  # Filters export
        guards/                     # Authorization
        interceptors/               # Response formatting

      # 📋 Module Definition
      order.module.ts              # NestJS Module

  # 🟣 SHARED KERNEL (Reusable Base Classes)
  shared/
    kernel/
      aggregate-root.ts            # Base for Aggregate Roots
      domain-event.ts              # Interface for Domain Events
      event-handler.interface.ts
      repository.interface.ts
    utils/
      uuid.util.ts
```

---

## 📚 DDD Concepts Summary

| Concept            | Meaning                               | Used In                                 |
| ------------------ | ------------------------------------- | --------------------------------------- |
| **Aggregate Root** | Entity responsible for managing state | Domain - Order                          |
| **Entity**         | Object with identity, mutable         | Domain - OrderItem                      |
| **Value Object**   | Immutable, identity by value          | Domain - Money, Quantity                |
| **Domain Service** | Logic too complex for entity          | Domain - PricingService                 |
| **Use Case**       | Business process, orchestration       | Application - CreateOrderUseCase        |
| **Domain Event**   | Event when state changes              | Domain → Infrastructure                 |
| **Repository**     | Abstraction over persistence          | Interface: Domain, Impl: Infrastructure |
| **DTO**            | Data Transfer, no logic               | Application/Presentation                |

---

## 🚀 Next Steps

1. **Implement Value Objects** with validation
2. **Implement Order Aggregate** with domain rules
3. **Implement Domain Services** (PricingService, StockService)
4. **Implement Use Cases** with proper error handling
5. **Implement Repositories** with TypeORM
6. **Add Event Subscribers** for side effects
7. **Write Unit Tests** for domain logic
8. **Write E2E Tests** for workflows

---

## 📖 References

- [Domain-Driven Design by Eric Evans](https://domaindrivedesign.org/)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
