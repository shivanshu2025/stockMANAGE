const { spawn, spawnSync } = require('child_process');
const net = require('net');
const path = require('path');
const os = require('os');

const root = path.join(__dirname, '..');
const serverDir = path.join(root, 'server');
const clientDir = path.join(root, 'client');
const isWindows = os.platform() === 'win32';

const children = [];
let backendReady = false;
let frontendReady = false;
let bannerShown = false;
let shuttingDown = false;
let frontendPort = Number(process.env.CLIENT_PORT || process.env.VITE_PORT || 5173);
let backendPort = Number(process.env.PORT || 5000);

function killTree(pid) {
  if (!pid) return;
  if (isWindows) {
    try {
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } catch (_) {}
  } else {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch (_) {}
  }
}

function killAll() {
  children.forEach((c) => killTree(c.pid));
}

function showBanner() {
  if (bannerShown) return;
  bannerShown = true;
  process.stdout.write(
    '\n' +
      '========================================\n' +
      'STOCK INVENTORY SYSTEM\n' +
      '======================\n' +
      '\n' +
      '[OK] MongoDB connected\n' +
      `[OK] Backend running: http://localhost:${backendPort}\n` +
      `[OK] Frontend running: http://localhost:${frontendPort}\n` +
      '\n' +
      '[OK] Development server started successfully\n' +
      '\n' +
      '========================================\n' +
      '\n'
  );
}

function checkReady() {
  if (backendReady && frontendReady) showBanner();
}

function startBackend() {
  const nodemonBin = path.join(serverDir, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
  const child = spawn(process.execPath, [nodemonBin, '--quiet', 'server.js'], {
    cwd: serverDir,
    env: {
      ...process.env,
      PORT: String(backendPort),
      CLIENT_URL: process.env.CLIENT_URL || `http://localhost:${frontendPort}`,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    if (text.includes('MongoDB connected') && !backendReady) {
      backendReady = true;
    }
    if (text.includes('Backend running') && backendReady) {
      checkReady();
    }
    if (/^\[nodemon\]/m.test(text)) {
      process.stdout.write(text);
    }
  });
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  child.on('error', (err) => {
    console.error(`[backend] failed to start: ${err.message}`);
    shutdown(1);
  });
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.error(`\nBackend process exited unexpectedly (code ${code ?? 'unknown'}).`);
    console.error('Stopping frontend and exiting...');
    shutdown(code || 1);
  });

  children.push(child);
}

function startFrontend() {
  const viteBin = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [viteBin, '--port', String(frontendPort), '--strictPort'], {
    cwd: clientDir,
    env: {
      ...process.env,
      BACKEND_PORT: String(backendPort),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    if (/ready in|localhost:/i.test(text) && !frontendReady) {
      frontendReady = true;
      checkReady();
    }
  });
  setTimeout(() => {
    if (!frontendReady && !child.exitCode && !shuttingDown) {
      frontendReady = true;
      checkReady();
    }
  }, 1500);
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  child.on('error', (err) => {
    console.error(`[frontend] failed to start: ${err.message}`);
    shutdown(1);
  });
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.error(`\nFrontend process exited unexpectedly (code ${code ?? 'unknown'}).`);
    console.error('Stopping backend and exiting...');
    shutdown(code || 1);
  });

  children.push(child);
}

function isPortAvailable(port) {
  const hosts = ['127.0.0.1', '::1'];
  return new Promise((resolve) => {
    let pending = hosts.length;
    let available = true;

    hosts.forEach((host) => {
      const server = net.createServer();

      server.once('error', () => {
        available = false;
        pending -= 1;
        if (pending === 0) resolve(available);
      });
      server.once('listening', () => {
        server.close(() => {
          pending -= 1;
          if (pending === 0) resolve(available);
        });
      });
      server.listen(port, host);
    });
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    if (await isPortAvailable(port)) return port;
  }

  throw new Error(`No available frontend port found from ${startPort} to ${startPort + 19}.`);
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('\nShutting down...');
  killAll();
  setTimeout(() => process.exit(code), 1500);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => {
  if (!shuttingDown) killAll();
});

async function main() {
  const requestedFrontendPort = frontendPort;
  frontendPort = await findAvailablePort(requestedFrontendPort);

  if (frontendPort !== requestedFrontendPort) {
    console.log(`Port ${requestedFrontendPort} is already in use. Using ${frontendPort} for the frontend.`);
  }

  const requestedBackendPort = backendPort;
  backendPort = await findAvailablePort(requestedBackendPort);

  if (backendPort !== requestedBackendPort) {
    console.log(`Port ${requestedBackendPort} is already in use. Using ${backendPort} for the backend.`);
  }

  startBackend();
  startFrontend();
}

main().catch((error) => {
  console.error(`[dev] ${error.message}`);
  shutdown(1);
});
