const path = require('path')
const portfinder = require('portfinder')
const { createServer } = require('http-server')
const create = require('@vue/cli-test-utils/createTestProject')
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')
const launchPuppeteer = require('@vue/cli-test-utils/launchPuppeteer')

exports.createSampleProject = async (name, options, customAssert) => {
  let browser, server, page
  test('build', async () => {
    const project = await create(name, options)

    const { stdout } = await project.run('vue-cli-service build')
    expect(stdout).toMatch('Build complete.')

    const port = await portfinder.getPortPromise()
    server = createServer({ root: path.join(project.dir, 'dist') })

    await new Promise((resolve, reject) => {
      server.listen(port, err => {
        if (err) return reject(err)
        resolve()
      })
    })

    const launched = await launchPuppeteer(`http://localhost:${port}/`)
    browser = launched.browser
    page = launched.page

    const h1Text = await page.evaluate(() => {
      return document.querySelector('h1').textContent
    })

    expect(h1Text).toMatch('Welcome to Your Vue.js + TypeScript App')

    if (customAssert) {
      await customAssert(project, page)
    }
  })

  afterAll(async () => {
    await browser.close()
    server.close()
  })
}
