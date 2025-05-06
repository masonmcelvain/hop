#!/usr/bin/env ts-node

import { execSync } from "child_process";
import * as esbuild from "esbuild";
import { z } from "zod";

const TargetSchema = z.union([z.literal("chrome"), z.literal("firefox")]);
const TARGET = TargetSchema.parse(process.env.TARGET);

const cleanupPlugin = (): esbuild.Plugin => ({
   name: "cleanup",
   setup() {
      execSync(`rm -rf dist/${TARGET}`);
      execSync(`rm -f dist/${TARGET}.zip`);
   },
});

const copyAssetsPlugin = (): esbuild.Plugin => ({
   name: "copy-assets",
   setup(build) {
      build.onEnd(() => {
         execSync(`cp -r src/public/${TARGET}/* dist/${TARGET}`);
      });
   },
});

const zipPlugin = (): esbuild.Plugin => ({
   name: "zip",
   setup(build) {
      build.onEnd(() => {
         execSync(`zip -r ../${TARGET}.zip *`, { cwd: `dist/${TARGET}` });
      });
   },
});

const baseOptions: esbuild.BuildOptions = {
   entryPoints: ["src/public/index.tsx", "src/public/index.html"],
   bundle: true,
   loader: {
      ".html": "copy",
   },
   plugins: [cleanupPlugin(), copyAssetsPlugin(), zipPlugin()],
   target: ["chrome58", "firefox57"],
   outdir: `dist/${TARGET}`,
};

async function build() {
   if (process.env.NODE_ENV === "production") {
      esbuild.build({
         ...baseOptions,
         minify: true,
      });
   } else {
      const context = await esbuild.context({
         ...baseOptions,
         sourcemap: true,
      });
      await context.watch();
      console.log("Watching for changes...");
   }
}

build();
