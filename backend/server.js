/*
 * @Author: xiawang1024
 * @Date: 2025-06-23 10:17:14
 * @LastEditTime: 2025-06-23 13:50:46
 * @LastEditors: xiawang1024
 * @Description: 
 * @FilePath: \NetshManager\backend\server.js
 * 工作，生活，健康
 */
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 54321;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend's dist directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Helper function to run shell commands
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution Error: ${error.message}`);
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                console.warn(`Stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

// Parse the output of 'netsh interface portproxy show all'
const parseNetshOutput = (output) => {
    const lines = output.trim().split('\n');
    const rules = [];
    for (let i = 4; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        if (parts.length >= 4) {
            rules.push({
                listenAddress: parts[0],
                listenPort: parts[1],
                connectAddress: parts[2],
                connectPort: parts[3],
            });
        }
    }
    return rules;
};

// API to get all rules
app.get('/api/rules', async (req, res) => {
    try {
        const output = await runCommand('netsh interface portproxy show all');
        const rules = parseNetshOutput(output);
        res.json(rules);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get rules.', ...err });
    }
});

// API to add a new rule
app.post('/api/rules', async (req, res) => {
    const { listenAddress, listenPort, connectAddress, connectPort } = req.body;
    if (!listenAddress || !listenPort || !connectAddress || !connectPort) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const command = `netsh interface portproxy add v4tov4 listenport=${listenPort} listenaddress=${listenAddress} connectport=${connectPort} connectaddress=${connectAddress}`;
    try {
        await runCommand(command);
        res.status(201).json({ message: 'Rule added successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add rule.', ...err });
    }
});

// API to delete a rule
app.delete('/api/rules', async (req, res) => {
    const { listenAddress, listenPort } = req.body;
    if (!listenAddress || !listenPort) {
        return res.status(400).json({ message: 'Listen address and port are required.' });
    }
    const command = `netsh interface portproxy delete v4tov4 listenport=${listenPort} listenaddress=${listenAddress}`;
    try {
        await runCommand(command);
        res.status(200).json({ message: 'Rule deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete rule.', ...err });
    }
});

// Fallback for SPA: send index.html for any other non-API requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Netsh Manager server listening on http://localhost:${port}`);
    // Automatically open the browser
    runCommand(`start http://localhost:${port}`).catch(err => console.error('Failed to open browser:', err));
});