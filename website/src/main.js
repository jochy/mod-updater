import {createApp} from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import {createRouter, createWebHistory} from "vue-router";
import Home from './components/Home.vue';
import Search from './components/Search.vue';
import {createStore} from "vuex";
import Store from "./store.js";
import Detail from './components/Detail.vue';
import DetailGroup from './components/DetailGroup.vue';
import Download from "./components/Download.vue";
import Contact from "./components/Contact.vue";
import About from "./components/About.vue";
import Faq from "./components/Faq.vue";
import Mods from './components/Mods.vue';
import ConfigScreen from "@/components/ConfigScreen.vue";
import IssueScreen from "@/components/issues/IssueScreen.vue";
import Status from "@/components/Status.vue";
import * as Sentry from "@sentry/vue";
import {BrowserTracing} from "@sentry/tracing";
import {version} from '../package.json';
import 'element-plus/theme-chalk/dark/css-vars.css';
import VueLazyload from '@jambonn/vue-lazyload';
import Versioning from "@/components/versioning/Versioning.vue";
import FirebaseAuth from "@/components/login/FirebaseAuth.vue";
import {createI18n} from 'vue-i18n';
//import CKEditor from '@ckeditor/ckeditor5-vue';
import en from './i18n/en.json';
import fr from './i18n/fr.json';
import es from './i18n/es.json';
import it from './i18n/it.json';
import de from './i18n/de.json';
import pt from './i18n/pt.json';
import pl from './i18n/pl.json';
import sv from './i18n/sv.json';

const routes = [
    {path: '/', name: 'home', component: Home},
    {path: '/search', name: 'search', component: Search},
    {path: '/detail/:id', name: 'detail', component: Detail},
    {path: '/detailGroup/:id', name: 'detailGroup', component: DetailGroup},
    {path: '/config', name: 'config', component: ConfigScreen},
    {path: '/download', name: 'download', component: Download},
    {path: '/contact', name: 'contact', component: Contact},
    {path: '/about', name: 'about', component: About},
    {path: '/faq', name: 'faq', component: Faq},
    {path: '/groupmods', name: 'mods', component: Mods},
    {path: '/issues', name: 'issues', component: IssueScreen},
    {path: '/status', name: 'status', component: Status},
    {path: '/versioning', name: 'versioning', component: Versioning},
    {path: '/login', name:'login', component: FirebaseAuth},
];

const scrollableElementSelector = '.el-scrollbar > .el-scrollbar__wrap'; // change id
const scrollPositions = Object.create(null);

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        const element = document.querySelector(scrollableElementSelector);

        if (savedPosition && element !== null && to.name in scrollPositions) {
            /*console.log(
                '%c%s',
                'color:hotpink;',
                'scrollBehavior: navigating to history entry, scroll to saved position',
            );*/

            element.scrollTop = scrollPositions[to.name];
        } else if (element) {
            //console.log('%c%s', 'color:hotpink;', 'navigating to new history entry, scroll to top');
            element.scrollTop = 0;
        }

    },
});

const store = createStore(Store.store);

router.beforeEach((to, from, next) => {
    const element = document.querySelector(scrollableElementSelector);
    if (element !== null) {
        scrollPositions[from.name] = element.scrollTop;
    }

    let appScreens = ['mods', 'issues', 'config'];
    if (appScreens.includes(to.name) && !store.getters.isApp) {
        next({name: 'home'});
        return;
    }

    next();
});
router.afterEach((to) => {
    window.setPage(to);
});

let app = createApp(App);

Sentry.init({
    app,
    dsn: "https://cb62e3bcfcde4055a380f2e683210dbe@sentry.du-petit-lionceau.ovh/3",
    integrations: [
        new BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: ["localhost", "sims-mods-updater.com", /^\//],
        }),
    ],
    release: "smu-web@" + version,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.05,
});

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        fr,
        es,
        it,
        de,
        pt,
        pl,
        sv
    }
})


app.use(i18n)
    .use(router)
    .use(store)
    //.use(CKEditor)
    .use(VueLazyload, {
        preLoad: 2,
        loading: "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='margin: auto%3b background: none%3b display: block%3b shape-rendering: auto%3b' width='221px' height='221px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3e%3cpath d='M37 50A13 13 0 0 0 63 50A13 13.9 0 0 1 37 50' fill='%2393dbe9' stroke='none'%3e%3canimateTransform attributeName='transform' type='rotate' dur='1s' repeatCount='indefinite' keyTimes='0%3b1' values='0 50 50.45%3b360 50 50.45'%3e%3c/animateTransform%3e%3c/path%3e%3c!-- %5bldio%5d generated by https://loading.io/ --%3e%3c/svg%3e",
        attempt: 5
    })
    .mount('#app');

