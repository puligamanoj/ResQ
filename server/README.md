# ResQ PS-2 Intelligence Backend Server

Backend API server and decision intelligence engines for the **ResQ** Disaster Command Center.

---

## 🚀 4 Core Intelligence Engines

1. **Priority Engine (`priorityEngine.js`)**: Dynamic multi-factor priority score calculation formula:
   $$\text{Priority} = \text{Urgency}(30\%) + \text{People Affected}(20\%) + \text{Vulnerability}(20\%) + \text{Accessibility}(15\%) + \text{WaitingTime}(15\%)$$
2. **Allocation Engine (`allocationEngine.js`)**: Optimal resource dispatch algorithm matching available assets to active incidents based on proximity, unit type, and road conditions.
3. **Replanning Engine (`replanningEngine.js`)**: Dynamic re-allocation trigger activated whenever new emergencies arrive, roads are blocked, or assets become unavailable, generating natural language explanations.
4. **Risk Engine (`riskEngine.js`)**: Predictive vulnerability matrix computing sector hazard ratings.
5. **Matching Engine (`matchingEngine.js`)**: Missing persons matching system against shelter registries.

---

## 🛠️ API Routes Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | User authentication & JWT token issuance |
| `/api/disaster/info` | GET | Macro disaster event status & impact metrics |
| `/api/emergencies` | GET / POST | List & submit emergencies (computes dynamic priority) |
| `/api/resources` | GET / PATCH | Resource tracking & status updates |
| `/api/allocations` | GET / POST | Dispatch allocations & resource assignments |
| `/api/allocations/replan` | POST | Trigger AI Dynamic Replanning Engine |
| `/api/shelters` | GET / PATCH | Shelter directory & occupancy updates |
| `/api/missing-persons` | GET / POST | Report & search missing persons registry |
| `/api/roads` | GET / PATCH | Road blockage & detour management |
| `/api/risk-areas` | GET | Sector vulnerability assessments |
| `/api/alerts` | GET / POST | Broadcast alerts feed |

---

## 🚦 Running the Server

```bash
cd server
npm install
npm start
```
