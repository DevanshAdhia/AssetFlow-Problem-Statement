# Asset Manager Workflow

The Asset Manager handles the core operational lifecycle of assets within the system, from registration to auditing.

## Responsibilities & Daily Tasks

1. **Inventory Entry**
   - Register new assets into the directory.
   - Generate Asset Tags (e.g. AF-0001) and set initial status as `Available`.
2. **Allocation**
   - Allocate assets to specific employees or departments.
3. **Approvals Pipeline (Kanban)**
   - Review and approve/reject transfer requests when a double-allocation conflict occurs.
   - Review and approve maintenance requests (shifting asset status to `Under Maintenance`).
4. **Returns & Check-ins**
   - Approve asset returns.
   - Capture condition check-in notes when an asset is returned and revert its status back to `Available`.
5. **Auditing Resolution**
   - Review auto-generated discrepancy reports from completed audit cycles.
   - Take action on assets flagged as "Missing" or "Damaged".
