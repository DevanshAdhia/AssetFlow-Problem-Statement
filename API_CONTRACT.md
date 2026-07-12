# AssetFlow - API Contract for Backend Developers

This document outlines the REST API endpoints and JSON payload structures expected by the AssetFlow frontend. The frontend is currently using mocked data, but once these APIs are implemented, the frontend will integrate them.

## Base URLs
- **Local Development (Backend):** `http://localhost:5000/api/v1`
- **Staging / QA:** `https://staging-api.assetflow.example.com/api/v1`
- **Production:** `https://api.assetflow.example.com/api/v1`

---

## 1. Authentication
### `POST /auth/login`
- **Description**: Authenticates a user.
- **Request Body**:
  ```json
  { "email": "user@example.com", "password": "securepassword" }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "u1",
      "name": "Bharat Rathor",
      "role": "Admin",
      "department": "IT"
    }
  }
  ```

---

## 2. Dashboard Metrics
### `GET /dashboard/kpis`
- **Description**: Fetches the high-level counts for the dashboard.
- **Response**:
  ```json
  {
    "available": 120,
    "allocated": 320,
    "maintenance": 12,
    "bookings": 34
  }
  ```

---

## 3. Assets & Allocation
### `GET /assets/search?query=AF-001`
- **Description**: Searches for an asset by tag or name.
- **Response**:
  ```json
  [
    {
      "id": "a1",
      "tag": "AF-001",
      "name": "Dell XPS 15 Laptop",
      "status": "Allocated",
      "currentHolder": "John Smith",
      "location": "Floor 2, IT Dept",
      "condition": "Good"
    }
  ]
  ```

### `POST /assets/transfer`
- **Description**: Requests a transfer. Fails if the asset is currently blocked (double-allocation check).
- **Request Body**:
  ```json
  {
    "assetId": "a1",
    "to": "HR Department",
    "reason": "New employee onboarding"
  }
  ```
- **Response (Success)**: `200 OK`
- **Response (Blocked)**: `409 Conflict` (Asset is already allocated)

---

## 4. Maintenance (Kanban)
### `GET /maintenance/tasks`
- **Description**: Retrieves all maintenance tasks.
- **Response**:
  ```json
  [
    {
      "id": "t1",
      "title": "Projector bulb replacement",
      "asset": "Projector X-1",
      "tag": "AF-009",
      "priority": "High",
      "column": "pending",
      "date": "2026-10-12"
    }
  ]
  ```

### `PATCH /maintenance/tasks/:id/move`
- **Description**: Moves a task to a different Kanban column.
- **Request Body**:
  ```json
  { "newColumn": "approved" }
  ```

---

## 5. Audit & Verification
### `GET /audit/current`
- **Description**: Fetches the current audit cycle list.
- **Response**:
  ```json
  {
    "scope": "Audit cycle beginning April - Q4",
    "assets": [
      {
        "id": "A001",
        "tag": "AF-001",
        "name": "Dell XPS 15",
        "expected": "IT Dept",
        "reported": "IT Dept",
        "status": "Verified"
      }
    ]
  }
  ```

---

## 6. Notifications & Logs
### `GET /notifications`
- **Description**: Fetches user notifications.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Asset Assigned",
      "message": "MacBook Pro has been assigned.",
      "time": "2 min ago",
      "read": false,
      "type": "alerts"
    }
  ]
  ```

### `GET /activity-logs`
- **Description**: Fetches chronological system logs.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "date": "12/07/2026",
      "user": "Admin",
      "action": "Created Department",
      "status": "Success"
    }
  ]
  ```
