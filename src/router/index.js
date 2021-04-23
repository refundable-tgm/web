import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PageNotFound from "../components/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/viewer",
    component: Home,
    props: route => ({ query: route.query.uuid }),
    beforeEnter: (to, from, next) => {
      const { uri } = to.query;
      if (uri != null && uri != "/") {
        next(false);
        router.push(uri);
      } else {
        next();
      }
    }
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    props: { pathing: "base" }
  },
  {
    path: "*",
    name: "NotFound",
    component: PageNotFound
  }
];
/*

*/
const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
