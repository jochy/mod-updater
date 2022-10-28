import Backend from './backend.js';

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const store = {
    state() {
        return {
            searchRequest: {
                page: 1,
                query: "",
                filters: null,
                isLoading: false
            },
            searchResult: {
                success: true,
                results: [],
                total: 0,
                time: 0,
            },
            scroll: 0,
            searchScroll: 0,
            nextRequest: undefined,
            isApp: false,
            config: null,
            schedulerStatus: null,
            disableAds: false,
            updates: [],
            applicationManifest: null,
            askLoading: 0,
            issues: [],
            displayedAds: 0,
            status: true,
            theme: 'dark',
            commits: null,
            authenticatedUser: null,
            askAuthentication: 0
        };
    },
    getters: {
        searchRequest: state => state.searchRequest,
        searchResults: state => state.searchResult,
        scroll: state => state.scroll,
        updates: state => state.updates,
        issues: state => state.issues,
        searchScroll: state => state.searchScroll,
        searchQuery: state => state.searchRequest.query,
        isApp: state => state.isApp,
        schedulerStatus: state => state.schedulerStatus,
        hasPendingTask: state => state.schedulerStatus?.currentTasks?.length > 0,
        config: state => state.config,
        askLoading: state => state.askLoading,
        displayedAds: state => state.displayedAds,
        getStatus: state => state.status,
        theme: state => state.theme,
        commits: state => state.commits,
        modsCategories: state => {
            if (state.config == null || state.config.mods == null) {
                return [];
            }
            return [...new Set(state.config.mods
                .filter(it => it.category != null && it.category !== '')
                .map(mod => mod.category))
            ];
        },
        applicationManifest: state => state.applicationManifest,
        disableAds: state => state.disableAds,
        isInstalled: state => id => {
            if (state.config == null || state.config.mods == null) {
                return false;
            }
            return state.config.mods.filter(item => item.id === id).length > 0;
        },
        isInstalling: state => id => {
            if (state.schedulerStatus == null) {
                return false;
            }
            let tmp = [...state.schedulerStatus.currentTasks, ...state.schedulerStatus.queuedTasks];
            return tmp.filter(item => item.id === id).length > 0;
        },
        getInstalled: state => {
            if (state.config == null || state.config.mods == null) {
                return [];
            }
            return state.config.mods.map(item => item.id);
        },
        getInstalledGroup: state => {
          if (state.config == null || state.config.groups == null) {
              return [];
          }
          return state.config.groups;
        },
        getInstalling: state => {
            if (state.schedulerStatus == null) {
                return [];
            }
            let tmp = [...state.schedulerStatus.currentTasks, ...state.schedulerStatus.queuedTasks];
            return tmp.map(item => item.id);
        },
        authenticatedUser: state => state.authenticatedUser,
        getAskAuthentication: state => state.askAuthentication,
    },
    mutations: {
        addDisplayedAd: function (state) {
            state.displayedAds = state.displayedAds + 1;
        },
        setTheme: function (state, theme) {
            state.theme = theme;
        },
        updateStatus: function (state, status) {
            state.status = status;
        },
        removeDisplayedAd: function (state) {
            state.displayedAds = state.displayedAds - 1;
        },
        setScroll: function (state, scroll) {
            state.scroll = scroll;
        },
        setIssues: function (state, issues) {
            state.issues = issues;
        },
        incrementAskLoading: function (state) {
            console.log('incrementAskLoading');
            state.askLoading = state.askLoading + 1;
        },
        setUpdates: function (state, updates) {
            state.updates = updates;
        },
        setSearchScroll: function (state, scroll) {
            state.searchScroll = scroll;
        },
        askSearch: function (state, query) {
            state.searchRequest.query = query;
        },
        useApp: function (state) {
            state.isApp = true;
        },
        setApplicationManifest: function (state, manifest) {
            state.applicationManifest = manifest
        },
        setConfig: function (state, config) {
            console.log("Config set");
            state.config = config;
        },
        schedulerStatus: function (state, status) {
            state.schedulerStatus = status;
        },
        setDisableAds: function (state, disableAds) {
            state.disableAds = disableAds;
        },
        setCommits: function (state, commits) {
            state.commits = commits;
        },
        removeModFromUpdates: function (state, id) {
            state.updates = state.updates.filter(it => it.id !== id);
        },
        setAuthenticatedUser: function(state, user) {
            state.authenticatedUser = user;
        },
        askAuthentication: function(state) {
            state.askAuthentication = state.askAuthentication + 1;
        }
    },
    actions: {
        async search(context, search) {
            if (search.query == null) {
                return;
            }
            if (search.query.trim().length === 0) {
                search.query = '*';
            }
            window.sendGtagEvent("search", {query: search.query});

            context.state.nextRequest = search;
            if (context.state.searchRequest.isLoading) {
                while (this.state.searchRequest.isLoading) {
                    await sleep(100);
                }
                if (this.state.nextRequest.query !== search.query) {
                    console.log(`Skipping searching for ${search.query}`)
                    return;
                }
            }
            context.state.searchRequest.isLoading = true;
            context.state.searchRequest.query = search.query;
            context.state.searchRequest.page = search.page;
            context.state.searchRequest.filters = search.filters;
            if (search.isNewSearch) {
                context.state.searchResult.results = [];
                context.state.searchScroll = 0;
            }

            try {
                const start = new Date();
                const result = await Backend.search(search.query, search.page, search.filters);
                console.log(`Search done in ${new Date() - start} ms`);
                await sleep(100);
                context.state.searchResult.results.push(...result.hits);
                context.state.searchResult.total = result.found;
                context.state.searchResult.time = result.search_time_ms;
                context.state.searchResult.success = true;
            } catch (e) {
                context.state.searchResult.success = false;
                console.error(e);
            }
            context.state.searchRequest.isLoading = false;

        },

        async nextPage(context) {
            // Already fully loaded
            if (context.state.searchResult.results.length >= context.state.searchResult.total || context.state.searchRequest.isLoading) {
                return;
            }

            await context.dispatch('search', {
                query: context.state.searchRequest.query,
                page: context.state.searchRequest.page + 1,
                filters: context.state.searchRequest.filters,
                isNewSearch: false
            });
        }
    }
};

export default {
    store
};
