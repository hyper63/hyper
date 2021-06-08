
module.exports = {
  packages: [
    'packages/*',
    'images/*',
    'launcher'
  ],
  // * Setting the cwd ensure adio runs from root of project, ie. pre-commit checks run via 'git commit' in a packages/* directory
  cwd: __dirname,
  ignoreDirs: ['node_modules']
}
