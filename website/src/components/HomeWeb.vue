<template>
  <div v-if="!isCentralSimmer" style="width: 100%; position: absolute; z-index:-1000">
    <Particles
        id="tsparticles"
        :particlesInit="particlesInit"
        :options="{
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: false,
                                mode: 'push'
                            },
                            onHover: {
                                enable: false,
                                mode: 'repulse'
                            },
                            resize: true
                        },
                        modes: {
                            bubble: {
                                distance: 400,
                                duration: 2,
                                opacity: 0.4,
                                size: 40
                            },
                            push: {
                                quantity: 4
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4
                            }
                        }
                    },
                    particles: {
                        color: {
                            value: '#dedede'
                        },
                        links: {
                            color: '#ffffff',
                            distance: 100,
                            enable: true,
                            opacity: 0.2,
                            width: 1
                        },
                        collisions: {
                            enable: true
                        },
                        move: {
                            direction: 'none',
                            enable: true,
                            outMode: 'bounce',
                            random: false,
                            speed: 1,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 900
                            },
                            value: 80
                        },
                        opacity: {
                            value: 0.5
                        },
                        shape: {
                            type: 'circle'
                        },
                        size: {
                            random: true,
                            value: 5
                        }
                    },
                    detectRetina: true
                }"
    />
  </div>
  <div class="home-container" :style="foregroundStyle">
    <el-space direction="vertical" style="max-width: 100%;flex-wrap: nowrap !important;" :fill="true">
      <el-card shadow="always" class="cardTitle">
        <h1 style="font-size: 24px">{{ $t(`message.app.never_lose_time_again`) }}</h1>
        <h3 v-if="modsCount != null">{{ $t(`message.app.choose_between_more_than`, {modsCount: modsCount}) }}</h3>
        <p class="subtitle">
          {{ $t(`message.app.psst_its_free`) }}
          <i class="em em-blush" aria-role="presentation" aria-label="SMILING FACE WITH SMILING EYES"></i>
        </p>
        <el-button type="primary" size="large" plain @click="this.$router.push('/download')">
          {{ $t(`message.app.start_using_app_button`) }}
        </el-button>
      </el-card>
      <last-mods type="downloaded" @loaded="onResize"/>
      <ads/>
      <last-mods type="updated" @loaded="onResize"/>
      <ads/>
    </el-space>
  </div>
</template>

<script>
import Backend from '../backend.js';
import LastMods from "./LastMods.vue";
import Ads from "./google/Ads.vue";
import {loadFull} from "tsparticles";
import {mapGetters} from "vuex";

export default {
  name: "HomeWeb",
  components: {
    LastMods, Ads
  },
  data: function () {
    return {windowHeight: window.innerHeight - 65 - 100, modsCount: null}
  },
  computed: {
    ...mapGetters(['isCentralSimmer']),
    backgroundStyle: function () {
      return `height: ${this.windowHeight}px`;
    },
    foregroundStyle: function () {
      return `min-height: ${this.windowHeight}px; height:100%`;
    }
  },
  methods: {
    onResize: function () {
      this.windowHeight = window.innerHeight - 65;
      if (!this.isApp) {
        this.windowHeight -= 100;
      }
    },
    particlesInit: async function (engine) {
      await loadFull(engine);
    }
  },
  async mounted() {
    window.updateTitleAndDescription('Sims mods updater', 'Search around more than 200000 mods and custom contents for the game The Sims 4 and install them through our application. The application will handle automatically all updates. This means more time to play and more fun! You are guaranteed to always have the last update!');
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.modsCount = await Backend.count();
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.cardTitle {
  backdrop-filter: blur(2px);
  background-color: transparent !important;
}

.subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-style: italic;
}
</style>