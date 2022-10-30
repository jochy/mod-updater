<template>
  <div style="display:inline-block;vertical-align: middle;margin: 0 10px">
    <el-tooltip v-if="authenticatedUser == null" :content="$t(`message.app.user_not_signed_in`)">
      <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                 @click="openDialog" style="cursor: pointer"/>
    </el-tooltip>
    <el-popover v-else :width="200">
      <template #reference>
        <el-avatar :size="32" :src="authenticatedUser.photoURL">
          <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
        </el-avatar>
      </template>
      <template #default>
        <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
          <el-button type="warning" link @click="signOut">{{$t(`message.app.sign_out`)}}</el-button>
        </div>
      </template>
    </el-popover>
    <el-dialog
        v-model="popup.show"
        :title="$t(`message.app.authenticate`)"
        width="30%"
        style="text-align: center"
    >
      <div id="firebaseui-auth-container" :lang="$i18n.locale"></div>
    </el-dialog>
    <div id="firebaseui-auth-container-background" style="display: none"></div>
  </div>
</template>

<script>
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, EmailAuthProvider} from "firebase/auth";
import * as firebaseui from 'firebaseui';
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "FirebaseAuth",
  data: () => ({
    popup: {
      show: false,
      loading: false
    },
    auth: null,
    firebaseConfig: {
      apiKey: "AIzaSyDPQhKNtO98I4CkItFIQqSP1usp3t4Qsdg",
      authDomain: "smod-manager.firebaseapp.com",
      projectId: "smod-manager",
      storageBucket: "smod-manager.appspot.com",
      messagingSenderId: "128345234146",
      appId: "1:128345234146:web:58aa94e084f1db7a63dcbb",
      measurementId: "G-WBTM2N1JRC"
    },
    firebaseConfigUI: {
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
        TwitterAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      tosUrl: 'https://sims-mods-updater.com/about',
      privacyPolicyUrl: "https://sims-mods-updater.com/about",
    }
  }),
  computed: {
    ...mapGetters(['authenticatedUser', 'getAskAuthentication']),
  },
  methods: {
    ...mapMutations(['setAuthenticatedUser']),
    signInAttempSuccessful(authResult, redirectUrl) {
      console.log('authResult', authResult)
      console.log('redirectUrl', redirectUrl)
    },
    signInAttempFailure(error) {
      alert('Sign in failed.')
      console.log('error', error)
    },
    firebaseUiShown: function () {
      this.popup.loading = false;
    },
    openDialog: async function () {
      this.popup.show = true;
      this.popup.loading = true;
      await this.$nextTick();

      let ui = firebaseui.auth.AuthUI.getInstance("smu-auth-ui");
      ui.start('#firebaseui-auth-container', this.firebaseConfigUI);
    },
    signOut: function() {
      this.auth.signOut();
    }
  },
  watch: {
    getAskAuthentication: function() {
      if (!this.popup.show) {
        this.openDialog();
      }
    }
  },
  mounted() {
    this.firebaseConfigUI.callbacks = {
      signInSuccessWithAuthResult: this.signInAttempSuccessful,
      signInFailure: this.signInAttempFailure,
      uiShown: this.firebaseUiShown,
    }
    let app = initializeApp(this.firebaseConfig)
    this.auth = getAuth(app);
    this.auth.onAuthStateChanged(() => this.setAuthenticatedUser(this.auth.currentUser));
    let ui = new firebaseui.auth.AuthUI(this.auth, "smu-auth-ui")
    ui.start('#firebaseui-auth-container-background', this.firebaseConfigUI);
  }
}
</script>

<style>
#firebaseui-auth-container {
  color: var(--el-text-color-primary);
}

#firebaseui-auth-container img {
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

#firebaseui-auth-container ul {
  list-style-type: none;
}

#firebaseui-auth-container button {
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid var(--el-border-color);
}

#firebaseui-auth-container .firebaseui-label {
  margin-right: 10px;
}

#firebaseui-auth-container .firebaseui-input {
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  outline: none !important;
  padding: 4px;
  min-width: 200px;
}

.firebaseui-id-secondary-link {
  padding: 4px;
  min-width: 50px;
  margin: 5px;
}

.firebaseui-id-submit {
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9);
  padding: 4px;
  min-width: 50px;
  margin: 5px;
}

.firebaseui-id-submit:hover {
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-white) !important;
  background-color: var(--el-color-primary);
  padding: 4px;
  min-width: 50px;
}

#firebaseui-auth-container .firebaseui-input:focus {
  border-color: var(--el-color-primary) !important;
}

#firebaseui-auth-container .firebaseui-input:focus-visible {
  border-color: var(--el-color-primary) !important;
}

#firebaseui-auth-container button:hover {
  border-color: var(--el-color-primary) !important;
}

.firebaseui-idp-text-short {
  display: none;
}

.firebaseui-idp-text-long {
  vertical-align: super;
  margin-left: 10px;
}

.firebaseui-idp-button {
  width: 200px;
  text-align: left;
}

.firebaseui-list-item {
  margin: 5px;
}

.firebaseui-tos {
  display: none;
}

.firebaseui-idp-button .firebaseui-idp-text {
  color: white;
}

.firebaseui-idp-list {
  padding: 0;
}

.firebaseui-idp-button[data-provider-id="google.com"] .firebaseui-idp-text {
  color: black;
}
</style>