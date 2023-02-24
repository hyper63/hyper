#! /usr/bin/env node

const { existsSync } = require('fs');
const { exec, execSync } = require('child_process');
const { platform, arch } = require('os');
const { dirname, join } = require('path');

const chalk = require('chalk');
const ora = require('ora');

const destDir = join(dirname(__filename));
const binaryDest = join(destDir, 'hyper-nano');

function getBinary() {
  const binaries = {
    linux: 'hyper-x86_64-unknown-linux-gnu',
    win32: 'hyper-x86_64-pc-windows-msvc.exe',
    darwinx86_64: 'hyper-x86_64-apple-darwin',
    darwinarm64: 'hyper-aarch64-apple-darwin',
  };

  const os = platform();
  let binary = undefined;

  if (os === 'linux' || os === 'win32') {
    binary = binaries[os];
  } else if (os === 'darwin') {
    // darwin, so if arm64, use aarch64 binary, otherwise use darwin x86-64 binary
    const architecture = arch() === 'arm64' ? 'arm64' : 'x86_64';
    binary = binaries[`${os}${architecture}`];
  }

  return binary;
}

async function main() {
  if (!existsSync(binaryDest)) {
    const binary = getBinary();
    if (binary) {
      const spinner = ora('Downloading hyper {nano}').start();
      await new Promise((resolve, reject) => {
        // TODO: make cross platform
        exec(
          `curl https://hyperland.s3.amazonaws.com/${binary} -o ${binaryDest} && chmod +x ${binaryDest}`,
          { cwd: destDir, stdio: 'ignore', stderr: 'inherit' },
        ).on('close', (code) => code ? reject(code) : resolve(code));
      });
      spinner.stop();
    } else {
      console.log(
        chalk.yellow(
          `Platform ${platform()} not supported by hyper nano. Skipping hyper nano binary install...`,
        ),
      );
    }
  }

  if (existsSync(binaryDest)) {
    const args = process.argv.slice(2, process.argv.length);

    execSync(
      `./hyper-nano ${args.join(' ')}`,
      {
        stdio: 'inherit',
        cwd: destDir,
      },
    );
  }
}

main();
