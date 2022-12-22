#!/usr/bin/env -S node -r "ts-node/register"

import { execSync } from "child_process";
import { copy } from "esbuild-plugin-copy";
import { build as esbuild } from "esbuild";
import type { Plugin } from "esbuild";
import { z } from "zod";

const TargetSchema = z.union([z.literal("chrome"), z.literal("firefox")]);
type Target = z.infer<typeof TargetSchema>;

const zipPlugin = ({ target }: { target: Target }): Plugin => ({
  name: "zip",
  setup(build) {
    build.onEnd(() => {
      execSync(`zip -r ${target}.zip ${target}`, { cwd: "dist" });
    });
  },
});

async function build(target: Target) {
  execSync(`rm -rf dist/${target}`);

  await esbuild({
    entryPoints: ["src/public/index.tsx"],
    bundle: true,
    watch: process.env.NODE_ENV !== "production",
    minify: true,
    sourcemap: process.env.NODE_ENV !== "production",
    target: ["chrome58", "firefox57"],
    outfile: `dist/${target}/hop.bundle.js`,
    plugins: [
      copy({
        assets: [
          {
            from: "src/public/index.html",
            to: ".",
          },
          {
            from: `src/public/${target}/**/*`,
            to: ".",
          },
        ],
        once: true,
      }),
      zipPlugin({ target }),
    ],
  });
}

build(TargetSchema.parse(process.env.TARGET));
