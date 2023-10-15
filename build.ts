#!/usr/bin/env ts-node

import { execSync } from "child_process";
import * as esbuild from "esbuild";
import { z } from "zod";

const TargetSchema = z.union([z.literal("chrome"), z.literal("firefox")]);
type Target = z.infer<typeof TargetSchema>;
const target = TargetSchema.parse(process.env.TARGET);
const NodeEnvSchema = z.union([
   z.literal("development"),
   z.literal("production"),
]);
type NodeEnv = z.infer<typeof NodeEnvSchema>;
const nodeEnv = NodeEnvSchema.parse(process.env.NODE_ENV);

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

type TailwindPluginProps = {
   target: Target;
   nodeEnv: NodeEnv;
};
const tailwindPlugin = ({
   target,
   nodeEnv,
}: TailwindPluginProps): esbuild.Plugin => ({
   name: "tailwind",
   setup(build) {
      build.onStart(() => {
         const minify = nodeEnv === "production" ? "--minify" : "";
         execSync(
            `tailwindcss -i src/globals.css -o dist/${target}/output.css ${minify}`,
         );
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
   plugins: [
      cleanupPlugin({ target }),
      copyAssetsPlugin({ target }),
      tailwindPlugin({ target, nodeEnv }),
      zipPlugin({ target }),
   ],
   target: ["chrome58", "firefox57"],
   outdir: `dist/${target}`,
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
