interface StatsCardsProps {
  stats: {
    totalOrders: number;
    totalRevenue: { number: string; currencyCode: string };
    pendingOrders: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="dashboard__stats">
      <div className="dashboard__stat-card">
        <span className="dashboard__stat-label">Total Orders</span>
        <span className="dashboard__stat-value">{stats.totalOrders}</span>
      </div>
      <div className="dashboard__stat-card">
        <span className="dashboard__stat-label">Revenue</span>
        <span className="dashboard__stat-value">
          ${parseFloat(stats.totalRevenue.number).toFixed(2)}
        </span>
      </div>
      <div className="dashboard__stat-card">
        <span className="dashboard__stat-label">Pending</span>
        <span className="dashboard__stat-value">{stats.pendingOrders}</span>
      </div>
    </div>
  );
}
