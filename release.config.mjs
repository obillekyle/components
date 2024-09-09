/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  repositoryUrl: 'https://github.com/obillekyle/components',
  tagFormat: 'v${version}',
  branches: [
    'main',
    {
      name: 'next',
      channel: 'next',
      prerelease: 'next'
    },
    {
      name: 'pre/rc',
      channel: 'pre/rc',
      prerelease: 'rc'
    },
    {
      name: 'beta',
      channel: 'beta',
      prerelease: true
    },
    {
      name: 'alpha',
      channel: 'alpha',
      prerelease: true
    }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'bun run build'
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: 'packages/lib'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'packages/lib/dist/**/*',
            label: 'Components'
          }
        ]
      }
    ],
    '@semantic-release/git'
  ],
  preset: 'angular'
}
