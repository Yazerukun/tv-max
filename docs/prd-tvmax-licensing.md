# TV-MAX Vendo SaaS: Enterprise Anti-Bypass Licensing Engine (PRD)

- **Feature:** Production Online Licensing Engine, One-Time Vendo Activation, and Anti-Bypass Guard
- **Users:** Ian (Master SaaS Admin / Authority) and Piso WiFi Vendo Operators & their connecting customers
- **Stack:** React 18, TypeScript, Tailwind CSS, Web Crypto API (SubtleCrypto HMAC-SHA256 & SHA-512), IndexedDB / LocalStorage, Cloudflare Pages Functions / REST Authority API

---

### 1. Problem Statement + Success Metrics

**Problem:**
TV-MAX is deployed on Piso WiFi edge boxes across municipalities in the Philippines. Without hard cryptographic enforcement, vendo operators can clone the web application across multiple machines, roll back system clocks to bypass expiration, or inspect and modify client storage to bypass payment.

**Success Metrics:**
1. **Zero-Bypass Security:** 100% of activation leases are cryptographically signed by Ian's central authority. Tampering with a single bit in local storage immediately invalidates the lease.
2. **Strict Hardware PUF Lock:** 1 Account = 1 Physical Machine. Account credentials cannot be used on a second machine simultaneously.
3. **Frictionless UX:** Activation is strictly **one-time**. Once logged in, the activation modal permanently closes across all subsequent browser restarts, reboots, and power cycles.
4. **Resilient Offline Playback:** Full offline movie/anime playback continues during PLDT/Converge fiber outages as long as the cryptographic ticket is valid.

---

### 2. User Stories & Acceptance Criteria

- **US1: One-Time Vendo Activation**
  - *As a vendo operator*, when I first open TV-MAX, I am prompted with an unclosable activation modal to enter my Username and PIN provided by Ian.
  - *Acceptance:* Validating successfully binds my machine hardware PUF, saves the signed ticket, permanently dismisses the modal, and unlocks full streaming.
- **US2: Tamper-Proof Expiration**
  - *As Ian*, I want subscriptions to strictly expire after 24h (Trial) or 30 Days (Pro).
  - *Acceptance:* When expiration is reached, TV-MAX displays a clean renewal notice (`Please send ₱300 to Ian via GCash`). Monotonic clock tracking blocks system clock rollback attacks.
- **US3: Zero-Touch 1-Click Monthly Renewal**
  - *As Ian*, when an operator pays via GCash, I click `+30d` on my Master Dashboard.
  - *Acceptance:* The operator's machine automatically resumes streaming without requiring the operator to re-type their credentials.
- **US4: Immediate Revocation & Deletion**
  - *As Ian*, if an operator violates terms or fails to pay, I can freeze or delete their key from the Master Controller.
  - *Acceptance:* The paired vendo machine is immediately locked out with an error notice.

---

### 3. Scope

- **In Scope (v1 Production):**
  - Client-side `licensingGuard` with browser PUF fingerprinting (GPU, Canvas, Audio, Concurrency, Screen, persistent crypto UUID).
  - Web Crypto API tamper verification (HMAC-SHA256 signature checking on every app boot).
  - Monotonic high-water mark time tracker protecting against clock rewind attacks.
  - `<VendoActivationModal />`: Clean, responsive activation screen that activates once and never returns.
  - `<VendoStatusBadge />`: Discreet status pill in TV-MAX showing remaining subscription time.
  - `<VendoExpiredModal />`: Clear overlay when lease expires, directing payment to Ian's GCash.
  - Synchronized Cloudflare Pages Function / REST Licensing API for online authentication, heartbeat verification, renewal, and deletion.
  - Master Cloud Dashboard integrated directly for Ian.
- **Out of Scope (v1):**
  - Automated GCash payment gateway webhook (manual GCash confirmation via Ian's dashboard is preferred in v1).

---

### 4. Data Model Changes

#### `LicenseTicket` (Client & Server)
```typescript
interface LicenseTicket {
  accountId: string;          // e.g. "acc-9a28b1"
  operatorName: string;       // e.g. "Cebu Vendo 1"
  username: string;           // e.g. "vendo-101"
  tier: "trial" | "pro_30d";  // 24h or 30 days
  hardwareHash: string;       // 64-char hex PUF hash
  issuedAt: number;           // Unix epoch timestamp
  expiresAt: number;          // Unix epoch timestamp
  signature: string;          // Cryptographic HMAC-SHA256 signature
}
```

#### `MonotonicLedger` (Local Storage)
```typescript
interface MonotonicLedger {
  highWaterMark: number;      // Maximum verified epoch timestamp observed
  lastHeartbeat: number;      // Timestamp of last successful verification
  tamperFlags: number;        // Counter of detected clock-rollback attempts
}
```

---

### 5. Edge Cases & Failure States

1. **Fiber Cut / No Internet at Boot:**
   - *Behavior:* If an already-activated machine boots during an internet blackout, it verifies the local signed `LicenseTicket` against the monotonic ledger. If `now < expiresAt` and no clock tampering occurred, TV-MAX unlocks seamlessly.
2. **Clock Rollback Attack (User sets system time back by 1 year):**
   - *Behavior:* Detected by `now < highWaterMark - 180s`. Playback is frozen and a security violation notice is displayed until the clock is corrected.
3. **Local Storage Tampering (User edits `expiresAt` in DevTools):**
   - *Behavior:* Cryptographic signature verification fails immediately. The ticket is wiped, and the machine drops back to the locked activation screen.
4. **Cloning Drive to Another Vendo Box:**
   - *Behavior:* The cloned box produces a different PUF hardware fingerprint. The signature/hardware mismatch locks the cloned machine.

---

### 6. Open Questions

- *Q1 (Answered):* Should customer phones see any login prompt?  
  *Answer:* No. The activation is strictly per vendo machine; connecting customers stream with zero login.
- *Q2 (Answered):* Do operators need to log in again upon monthly renewal?  
  *Answer:* No. Extending the account on Ian's Master Panel automatically updates the machine lease without requiring any re-login.
