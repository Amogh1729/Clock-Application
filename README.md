# Clock Application

A modern digital clock and timer application built with React, Vite, and Electron.

## Features
- **Digital Clock**: Displays current time with a clean, modern UI.
- **Timer**: Built-in countdown timer with presets (5m, 25m, 1h, 8h).
- **Visual & Audio Alerts**: Plays a sound and flashes the screen upon timer completion.
- **Always on Top**: The application stays visible over other windows.
- **System Tray Support**: Minimizes to the system tray.

## Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Amogh1729/Clock-Application.git
    cd Clock-Application
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run in development mode:**
    ```bash
    npm run dev
    # or to run with electron:
    npm run electron:dev
    ```

## Building the Executable

To generate the `Clock.exe` file for Windows:

```bash
npm run electron:build
```

The output files will be in the `dist_electron_v2` directory.
- **Executable**: `dist_electron_v2/win-unpacked/Clock.exe`
- **Installer**: (if configured) in `dist_electron_v2`

## Technologies
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
