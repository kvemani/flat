import * as core from '@actions/core'
import { ConnectionString } from 'connection-string'
import { createWriteStream, readFileSync, writeFileSync } from 'fs'
import { createConnection, DatabaseType } from 'typeorm'
import { PyFroidConfig } from '../config'
import * as path from 'path'
import stringify from 'csv-stringify'
import { exec } from '@actions/exec'

export default async function fetchPyFroid(config: PyFroidConfig): Promise<string> {
  var data = '<empty>'
  core.debug('Running PyFroid')
  try {
    const prepfilepath = path.join('.github/workflows', config.prepfile_path)
    core.debug(prepfilepath)

    const { exec } = require("child_process");
    exec("python " + prepfilepath, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`)
      data = stdout
    });
  } catch (error) {
    core.setFailed(
      `Unable to run PyFroid`
    )
    throw error
  }

  const outfile = `${config.outfile_basename}.txt`
  try {
    core.info('Writing PyFroid data')
    writeFileSync(outfile, data)
    return outfile
  } catch (error) {
    core.setFailed(`Unable to write results to ${outfile}: ${error.message}`)
    throw error
  }
}
