import { createServer } from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

const PORT = 3001;

function runDotnetTest(testFilter) {
  return new Promise((resolve) => {
    const args = ['test', '--logger', '"console;verbosity=detailed"'];

    if (testFilter) {
      args.push('--filter', `"${testFilter}"`);
    }

    console.log(`Running: dotnet ${args.join(' ')}`);
    console.log(`Working directory: ${projectRoot}`);

    const process = spawn('dotnet', args, {
      cwd: projectRoot,
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(data.toString());
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(data.toString());
    });

    process.on('close', (code) => {
      const passed = code === 0;
      const output = stdout + stderr;

      // Parse test results from output
      const testResults = parseTestOutput(output);

      resolve({
        passed,
        exitCode: code,
        output,
        testResults,
      });
    });

    process.on('error', (err) => {
      resolve({
        passed: false,
        exitCode: -1,
        output: err.message,
        testResults: [],
        error: err.message,
      });
    });
  });
}

function parseTestOutput(output) {
  const results = [];
  const lines = output.split('\n');
  const seenTests = new Set();

  for (const line of lines) {
    // Match xUnit format: "[xUnit.net 00:00:00.22]     TestName [FAIL]"
    const xunitFailMatch = line.match(/\[xUnit\.net[^\]]+\]\s+([\w.]+)\s+\[FAIL\]/);
    if (xunitFailMatch && xunitFailMatch[1].includes('.') && !seenTests.has(xunitFailMatch[1])) {
      seenTests.add(xunitFailMatch[1]);
      results.push({
        name: xunitFailMatch[1],
        passed: false,
        message: 'Test failed',
      });
      continue;
    }

    // Match passed tests (English): "  Passed TestName [123ms]"
    const passedMatch = line.match(/^\s*Passed\s+([\w.]+)/);
    if (passedMatch && passedMatch[1].includes('.') && !seenTests.has(passedMatch[1])) {
      seenTests.add(passedMatch[1]);
      results.push({
        name: passedMatch[1],
        passed: true,
        message: 'Test passed',
      });
      continue;
    }

    // Match passed tests (Polish): "  Powodzenie TestName [123ms]"
    const passedMatchPL = line.match(/^\s*Powodzenie\s+([\w.]+)/);
    if (passedMatchPL && passedMatchPL[1].includes('.') && !seenTests.has(passedMatchPL[1])) {
      seenTests.add(passedMatchPL[1]);
      results.push({
        name: passedMatchPL[1],
        passed: true,
        message: 'Test passed',
      });
      continue;
    }

    // Match failed tests (English): "  Failed TestName [123ms]"
    const failedMatch = line.match(/^\s*Failed\s+([\w.]+)/);
    if (failedMatch && failedMatch[1].includes('.') && !seenTests.has(failedMatch[1])) {
      seenTests.add(failedMatch[1]);
      results.push({
        name: failedMatch[1],
        passed: false,
        message: 'Test failed',
      });
      continue;
    }

    // Match failed tests (Polish): "  Niepowodzenie TestName [123ms]"
    const failedMatchPL = line.match(/^\s*Niepowodzenie\s+([\w.]+)/);
    if (failedMatchPL && failedMatchPL[1].includes('.') && !seenTests.has(failedMatchPL[1])) {
      seenTests.add(failedMatchPL[1]);
      results.push({
        name: failedMatchPL[1],
        passed: false,
        message: 'Test failed',
      });
      continue;
    }
  }

  // If no individual results found but tests passed, parse from summary
  // "Powodzenie!    — niepowodzenie:     0, powodzenie:     4"
  if (results.length === 0) {
    const summaryMatch = output.match(/powodzenie:\s*(\d+)/i);
    if (summaryMatch) {
      const passedCount = parseInt(summaryMatch[1], 10);
      if (passedCount > 0) {
        // Extract test names from the test run output (look for test dll loading)
        const testClassMatch = output.match(/Przebieg testu dla:.*?(\w+\.Tests)\.dll/);
        const testProject = testClassMatch ? testClassMatch[1] : 'Tests';

        // For now, create generic passed results based on count
        for (let i = 0; i < passedCount; i++) {
          results.push({
            name: `${testProject}.Test${i + 1}`,
            passed: true,
            message: 'Test passed',
          });
        }
      }
    }
  }

  return results;
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/run-tests') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { testFilter } = body ? JSON.parse(body) : {};
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Running tests with filter: ${testFilter || '(all)'}`);
        console.log('='.repeat(50));

        const result = await runDotnetTest(testFilter);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message, passed: false }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Test runner server listening on http://localhost:${PORT}`);
  console.log(`Project root: ${projectRoot}`);
});
