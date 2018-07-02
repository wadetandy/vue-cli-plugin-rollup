module.exports = (api, {
}) => {

  api.registerCommand('rollup', {

  },async args => {
    const rollup = require('rollup')
    const externals = require("@yelo/rollup-node-external")

    const vue = require("rollup-plugin-vue")
    const filesize = require("rollup-plugin-filesize")

    let vueOpts = {
      compileTemplate: true,
      css: true,
      // scss: scssOpts,
    }

    let plugins = [
      // vueSvgComponent(),
    // const vueSvgComponent = require("rollup-plugin-vue-svg-component")
    ]

    if (api.hasPlugin('typescript')) {
      const typescript = require("rollup-plugin-typescript2")

      plugins.push(typescript({}))
      vueOpts.typescript = {
        compilerOptions: {
          importHelpers: true,
        }
      }
    }

    if (api.hasPlugin('babel')) {
      const babel = require("rollup-plugin-babel")
      plugins.push(babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }))
    }
    // const scss = require("rollup-plugin-scss")

    plugins.unshift(vue(vueOpts))
    plugins.push(filesize())

    let rollupInputOptions = {
      // input: opts.entry,
      external: externals(),
      experimentalCodeSplitting: true,
      experimentalDynamicImport: true,
      plugins,
    }
    let rollupOutputOptions = {
      dir: opts.dest,
      format: opts.format,
    }

    const bundle = await rollup.rollup(rollupInputOptions);

    // // generate code and a sourcemap
    // const { code, map } = await bundle.generate(outputOptions);

    // // or write the bundle to disk
    // await bundle.write(outputOptions);
  })

  api.extendPackage({
    scripts: {
      rollup: 'vue-cli-service rollup'
    }
  })
}