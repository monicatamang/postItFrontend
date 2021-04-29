import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import CreateAccount from "../views/CreateAccount.vue";
import Login from "../views/Login.vue";
import Feed from "../views/Feed.vue";
import Profile from "../views/Profile.vue";
import EditProfile from "../views/EditProfile.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/CreateAccount',
    name: 'CreateAccount',
    component: CreateAccount
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Feed',
    name: 'Feed',
    component: Feed
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/EditProfile',
    name: 'EditProfile',
    component: EditProfile
  },
]

const router = new VueRouter({
  routes
})

export default router
