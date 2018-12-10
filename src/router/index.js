import Vue from "vue";
import Router from "vue-router";

import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import Billings from "@/components/Billings";
import Settings from "@/components/Settings";

import { auth } from "@/config/firebaseConfig";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "*",
      redirect: "/dashboard"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/billings",
      name: "Billings",
      component: Billings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(
    routeRecord => routeRecord.meta.requiresAuth
  );
  const currentUser = auth.currentUser;
  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
