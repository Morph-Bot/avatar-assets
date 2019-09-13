import { readdirSync, writeFileSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { processAssetAndBuildAssetDescription } from './processAssetAndBuildAssetDescription'
import { dirSync } from 'tmp'
import { getAssetFolderAbsPath } from '../assets/getAssetFolderAbsPath'
import { Wearable } from 'types'

const { expect } = require('chai')

describe('Build the catalog', () => {
  it.skip('creates a description for all the files', async () => {
    const contentBaseUrl = 'https://dcl-exclusive-stg.now.sh'

    const workingFolder = dirSync()

    const response: Wearable[] = []

    const categoryFolderAbsPath = getAssetFolderAbsPath(__dirname, 2)

    const categoryFolders = readdirSync(categoryFolderAbsPath)

    for (let category of categoryFolders) {
      const assetFolders = readdirSync(resolve(join(categoryFolderAbsPath, category)))

      for (let asset of assetFolders.slice(0, 3)) {
        response.push(
          await processAssetAndBuildAssetDescription(
            join(categoryFolderAbsPath, category, asset),
            workingFolder.name,
            contentBaseUrl
          )
        )
      }
    }
    if (process.env['WRITE_TEST_CATALOG_RESULT']) {
      writeFileSync(join(__dirname, 'expected.json'), JSON.stringify(response, null, 2))
    }
    expect(response).to.deep.equal(JSON.parse(readFileSync(join(__dirname, 'expected.json')).toString()))
    workingFolder.removeCallback()
  })
})
