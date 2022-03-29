<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />
    <dashboard-core-view />

    <dashboard-core-settings />
    <FlashMessage></FlashMessage>
  </v-app>
</template>

<script>
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreAppBar: () => import("./components/core/AppBar"),
    DashboardCoreDrawer: () => import("./components/core/Drawer"),
    DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./components/core/View")
  },

  data: () => ({
    expandOnHover: false
  }),
  props: ["<FlashMessage></FlashMessage>"]
};
</script>
