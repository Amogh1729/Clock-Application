import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Logger
const logPath = path.join(path.dirname(process.execPath), 'app-startup.log');
function log(message) {
    try {
        fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
    } catch (e) {
        console.error('Failed to write log:', e);
    }
}

log('App starting...');

function createWindow() {
    log('createWindow called');
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Note: Security risk, but kept for simplicity per plan
            contextIsolation: false,
        },
        autoHideMenuBar: false,
        icon: path.join(__dirname, '../dist/icon.png')
    });

    win.setMenu(null);



    win.once('ready-to-show', () => {
        log('Window ready to show');
        win.show();
    });

    win.maximize();

    const distPath = path.join(__dirname, '../dist/index.html');
    log(`Dist path resolved to: ${distPath}`);

    const startUrl = process.env.ELECTRON_START_URL || `file://${distPath}`;
    log(`Loading URL: ${startUrl}`);

    // Load the app
    if (process.env.ELECTRON_START_URL) {
        win.loadURL(startUrl);
    } else {
        win.loadFile(distPath).catch(e => {
            log(`Failed to load file: ${e.message}`);
            dialog.showErrorBox('Load Error', `Failed to load app: ${e.message}`);
        });
    }

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        log(`Page failed to load: ${errorCode} - ${errorDescription}`);
    });
}

app.whenReady().then(() => {
    log('App is ready');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}).catch(e => {
    log(`App ready error: ${e.message}`);
});

app.on('window-all-closed', () => {
    log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}\n${error.stack}`);
    if (app.isReady()) {
        dialog.showErrorBox('Error', `Uncaught Exception: ${error.message}`);
    }
});
