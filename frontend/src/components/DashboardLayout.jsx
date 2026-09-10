import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-mobile-header">
          <div className="mobile-brand">
            <span>✈</span>
            Travel Planner
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;