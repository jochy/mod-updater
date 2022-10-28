import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import visualizer from 'rollup-plugin-visualizer';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    plugins: [
        vue(),
        visualizer(),
        vueJsx({})
    ],
    server: {
        port: 8080,
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src')
            }
        ]
    }
})