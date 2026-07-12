export const currentUser = {
  name: "Bharat Rathor",
  email: "bharat@example.com",
  phone: "+91 9876543210",
  department: "Engineering",
  role: "Admin",
  status: "Active",
  avatar: "https://ui-avatars.com/api/?name=Bharat+Rathor&background=2563EB&color=fff"
};

export const kpiData = {
  available: 120,
  allocated: 320,
  maintenance: 12,
  bookings: 34
};

export const recentActivities = [
  { id: 1, text: "Laptop AF-001 Assigned to John", time: "10 mins ago", type: "assignment" },
  { id: 2, text: "Maintenance Approved for Projector", time: "1 hour ago", type: "maintenance" },
  { id: 3, text: "Room B2 Booked by Sarah", time: "2 hours ago", type: "booking" },
  { id: 4, text: "Asset Returned: Monitor 4K", time: "1 day ago", type: "return" }
];

export const notificationsList = [
  { id: 1, title: "Asset Assigned", message: "MacBook Pro M3 has been assigned to you.", time: "2 min ago", read: false, type: "alerts" },
  { id: 2, title: "Maintenance Approved", message: "Your request for Keyboard replacement is approved.", time: "10 min ago", read: false, type: "approvals" },
  { id: 3, title: "Booking Confirmed", message: "Conference Room A booking confirmed for 3 PM.", time: "1 hour ago", read: true, type: "bookings" },
  { id: 4, title: "Overdue Return Alert", message: "Projector AF-009 return is overdue by 1 day.", time: "2 hours ago", read: false, type: "alerts" },
  { id: 5, title: "Audit Discrepancy", message: "1 laptop missing from expected location.", time: "5 hours ago", read: true, type: "alerts" }
];

export const activityLogsData = [
  { id: 1, date: "12/07/2026", user: "Admin", action: "Created Department", status: "Success" },
  { id: 2, date: "11/07/2026", user: "Asset Manager", action: "Allocated Laptop", status: "Success" },
  { id: 3, date: "10/07/2026", user: "John Doe", action: "Requested Monitor", status: "Pending" },
  { id: 4, date: "09/07/2026", user: "System", action: "Backup Completed", status: "Success" }
];
