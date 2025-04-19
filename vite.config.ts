import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import {codeInspectorPlugin} from "code-inspector-plugin";
import postcssPresetEnv from "postcss-preset-env";
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin';
import {ViteImageOptimizer} from "vite-plugin-image-optimizer";
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import {type ViteUserConfig, defineConfig} from "vitest/config";
import {version} from "./package.json";

// 支持构建命令传入构建版本
const versionName = process.env.VERSION_NAME || version;

export default defineConfig(({mode = "development"}): ViteUserConfig => {
    const isProduction = mode === "production";
    console.log("部署环境=>\t", mode);

    return {
        plugins: [
            react(),
            tailwindcss(),
            ViteImageOptimizer(),
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), "src/assets/icon")],
                symbolId: "icon-[dir]-[name]",
            }),
            {
                name: "ascii-art",
                configureServer(server) {
                    // 监听服务器启动事件
                    server.httpServer?.once("listening", () => {
                        const asciiPath = path.resolve(__dirname, "ascii.txt");
                        const today = new Date().getDay(); // 0 = 星期天, 1 = 星期一, ..., 5 = 星期五
                        if (today === 5 && fs.existsSync(asciiPath)) {
                            const asciiArt = fs.readFileSync(asciiPath, "utf8");
                            console.log(`\n${asciiArt}\n`);
                        }
                    });
                },
            },
            codeInspectorPlugin({
                bundler: "vite",
            }),
        ],
        css: {
            devSourcemap: true,
            modules: {
                // kebab-case(foo.module.scss) -> camelCase(foo.jsx)
                localsConvention: "camelCase",
                // localsConvention: "camelCaseOnly",
            },
            postcss: {
                plugins: [
                    postcssPresetEnv({
                        stage: 1, // 支持处于 Stage 1 及以上的特性（稳定性较高）
                        autoprefixer: {grid: true}, // 自动添加前缀，支持 grid 布局
                        features: {
                            "nesting-rules": true, // ✅ 开启嵌套规则支持
                            "custom-properties": true, // ✅ 启用 CSS 变量支持
                        },
                    }),
                    postcsspxtoviewport8plugin({
                        unitToConvert: 'px',
                        viewportWidth: file => {
                            let num = 1920;
                            if (file.indexOf('m_') !== -1) {
                                num = 375;
                            }
                            return num;
                        },
                        unitPrecision: 5, // 单位转换后保留的精度
                        propList: ['*'], // 能转化为vw的属性列表
                        viewportUnit: 'vw', // 希望使用的视口单位
                        fontViewportUnit: 'vw', // 字体使用的视口单位
                        selectorBlackList: [/^ignore-/, /^no-vw-/] as unknown as string[], // 指定不转换的类名
                        minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
                        mediaQuery: true, // 媒体查询里的单位是否需要转换单位
                        replace: true, //  是否直接更换属性值，而不添加备用属性
                        exclude: [/node_modules\/ant-design-vue/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
                        include: [], // 如果设置了include，那将只有匹配到的文件才会被转换
                        landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
                        landscapeUnit: 'vw', // 横屏时使用的单位
                        landscapeWidth: 1024, // 横屏时使用的视口宽度
                    }),

                ],
            },
        },

        envDir: "env",
        // 开发阶段的代理服务器, 充当5173和8080服务器的媒介,避免跨域问题, 实际请求仍旧是5173,而不是8080, http 404 看看请求地址对不对
        server: {
            host: "0.0.0.0",
            cors: true,
            port: 5173,
            strictPort: true,
            open: false,
            proxy: {
                "/api/": {
                    target: "http://127.0.0.1:8080",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },

        build: {
            manifest: true,
            assetsDir: `./${versionName}`, // 版本号
            sourcemap: true,
        },

        esbuild: {
            drop: isProduction ? ["console", "debugger"] : [],
        },
        resolve: {
            alias: {
                "#": path.resolve(__dirname, "types"),
                "@": path.resolve(__dirname, "src"),
            },
        },
        test: {
            include: ["__test__/**/*.test.{ts,tsx,js,jsx}"], // 指定你的测试目录和测试文件
            environment: "jsdom", // 如果你测的是 React DOM 环境，务必加上
        },
    };
});
