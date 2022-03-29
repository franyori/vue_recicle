import Vue from "vue";
import Router from "vue-router";
import VueRouter from "vue-router";
Vue.use(Router);
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("@/views/dashboard/login"),
  },
  {
    path: "/",
    component: () => import("@/views/dashboard/Index"),
    children: [
      // Dashboard
      {
        name: "Dashboard",
        path: "",
        component: () => import("@/views/dashboard/Dashboard"),
        meta: {
          requiresAuth: true,
        },
      },
      // Pages
      {
        name: "User Profile",
        path: "pages/user",
        component: () => import("@/views/dashboard/pages/UserProfile"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Almacen",
        path: "components/Almacen",
        component: () => import("@/views/dashboard/component/Almacen"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Ventas",
        path: "components/Ventas",
        component: () => import("@/views/dashboard/component/Ventas"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Productos",
        path: "components/Productos",
        component: () => import("@/views/dashboard/component/Productos"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Categorias",
        path: "components/Categorias",
        component: () => import("@/views/dashboard/component/Categorias"),
        meta: {
          requiresAuth: true,
        },
      },
      // Clientes
      {
        name: "Clientes",
        path: "tables/Clientes",
        component: () => import("@/views/dashboard/tables/Clientes"),
        meta: {
          requiresAuth: true,
        },
      },
      // Proveedores
      {
        name: "Proveedor",
        path: "tables/Proveedor",
        component: () => import("@/views/dashboard/tables/Proveedor"),
        meta: {
          requiresAuth: true,
        },
      },
      // Maps
      {
        name: "Compras",
        path: "maps/Compras",
        component: () => import("@/views/dashboard/maps/Compras"),
        meta: {
          requiresAuth: true,
        },
      },
      // Upgrade
      {
        name: "Upgrade",
        path: "upgrade",
        component: () => import("@/views/dashboard/Upgrade"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
