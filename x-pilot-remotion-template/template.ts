import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Template, waitForPort } from 'e2b'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const WORKDIR = '/app'

const serviceDirectories = [
  'output',
  'src/scenes',
  'src/assets/images',
  'src/assets/fonts',
  'src/assets/audio',
  'src/assets/videos',
]

const directoriesToCopy = ['public', 'src', 'web-uploader']
const filesToCopy = [
  'remotion.config.ts',
  'render.js',
  'tailwind.config.js',
  'postcss.config.js',
  'tsconfig.json',
  'remotion-studio-custom.css',
  'test_push.sh',
]

export const template = Template({
  fileContextPath: projectRoot,
  fileIgnorePatterns: ['x-pilot-remotion-template', 'node_modules', 'build', 'examples', 'docs'],
})
  .fromNodeImage('20-slim')
  .aptInstall(
    [
      'ffmpeg',
      'python3',
      'python3-pip',
      'build-essential',
      'python3-dev',
      'fonts-liberation',
      'fonts-dejavu-core',
    ],
    { noInstallRecommends: true },
  )
  .setWorkdir(WORKDIR)
  .copy(['package.json', 'package-lock.json'], `${WORKDIR}/`)
  .runCmd('npm ci --legacy-peer-deps')
  .copy('web-uploader/requirements.txt', `${WORKDIR}/web-uploader/requirements.txt`)
  .runCmd('pip3 install --no-cache-dir -r web-uploader/requirements.txt')
  .copyItems([
    ...directoriesToCopy.map((dir) => ({
      src: dir,
      dest: `${WORKDIR}/${dir}`,
      resolveSymlinks: true,
    })),
    ...filesToCopy.map((file) => ({
      src: file,
      dest: `${WORKDIR}/${file}`,
      resolveSymlinks: true,
    })),
  ])
  .runCmd(`mkdir -p ${serviceDirectories.map((dir) => `${WORKDIR}/${dir}`).join(' ')}`)
  .setEnvs({
    NODE_ENV: 'production',
    PYTHONUNBUFFERED: '1',
    DISPLAY: ':99',
  })
  .setStartCmd(`cd ${WORKDIR} && npm run dev`, waitForPort(3000))