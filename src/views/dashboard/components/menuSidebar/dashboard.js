import { navigateLocation } from "@routes/navigateLocation";
// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Reports",
      type: "item",
      url: navigateLocation.DASHBOARD.DEFAULT,
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
