#!/usr/bin/env ts-node

import { execSync } from "child_process";
import { copy } from "esbuild-plugin-copy";
import * as esbuild from "esbuild";
import { z } from "zod";

const TargetSchema = z.union([z.literal("chrome"), z.literal("firefox")]);
type Target = z.infer<typeof TargetSchema>;
const target = TargetSchema.parse(process.env.TARGET);

const zipPlugin = ({ target }: { target: Target }): esbuild.Plugin => ({
   name: "zip",
   setup(build) {
      build.onEnd(() => {
         execSync(`zip -r ../${target}.zip *`, { cwd: `dist/${target}` });
      });
   },
});

execSync(`rm -rf dist/${target}`);
execSync(`rm -f dist/${target}.zip`);

const baseOptions: esbuild.BuildOptions = {
   entryPoints: ["src/public/index.tsx", "src/public/index.html"],
   bundle: true,
   loader: {
      ".html": "copy",
   },
   target: ["chrome58", "firefox57"],
   outdir: `dist/${target}`,
   plugins: [
      copy({
         assets: [
            {
               from: `src/public/${target}/**/*`,
               to: ".",
            },
         ],
         once: true,
      }),
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
