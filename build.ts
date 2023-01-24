#!/usr/bin/env ts-node

import { execSync } from "child_process";
import * as esbuild from "esbuild";
import { z } from "zod";

const TargetSchema = z.union([z.literal("chrome"), z.literal("firefox")]);
type Target = z.infer<typeof TargetSchema>;
const target = TargetSchema.parse(process.env.TARGET);

const cleanupPlugin = ({ target }: { target: Target }): esbuild.Plugin => ({
   name: "cleanup",
   setup() {
      execSync(`rm -rf dist/${target}`);
      execSync(`rm -f dist/${target}.zip`);
   },
});

const copyAssetsPlugin = ({ target }: { target: Target }): esbuild.Plugin => ({
   name: "copy-assets",
   setup(build) {
      build.onEnd(() => {
         execSync(`cp -r src/public/${target}/* dist/${target}`);
      });
   },
});

const zipPlugin = ({ target }: { target: Target }): esbuild.Plugin => ({
   name: "zip",
   setup(build) {
      build.onEnd(() => {
         execSync(`zip -r ../${target}.zip *`, { cwd: `dist/${target}` });
      });
   },
});

const baseOptions: esbuild.BuildOptions = {
   entryPoints: ["src/public/index.tsx", "src/public/index.html"],
   bundle: true,
   loader: {
      ".html": "copy",
   },
   target: ["chrome58", "firefox57"],
   outdir: `dist/${target}`,
   plugins: [
      cleanupPlugin({ target }),
      copyAssetsPlugin({ target }),
      zipPlugin({ target }),
   ],
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
