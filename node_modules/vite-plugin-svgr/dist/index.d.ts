import { FilterPattern } from "@rollup/pluginutils";
import type { Config } from "@svgr/core";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";
export interface ViteSvgrOptions {
    /**
     * Export React component as default. Notice that it will overrides
     * the default behavior of Vite, which exports the URL as default
     *
     * @default false
     */
    exportAsDefault?: boolean;
    svgrOptions?: Config;
    esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
    exclude?: FilterPattern;
    include?: FilterPattern;
}
export default function viteSvgr({ exportAsDefault, svgrOptions, esbuildOptions, include, exclude, }?: ViteSvgrOptions): Plugin;
