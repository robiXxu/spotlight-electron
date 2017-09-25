module.exports = {
    mainWindow: {
        width: 600,
        height: 80,
        frame: false,
        resizable: false,
        movable: true, // doesn't seem to work ~ workaround needed
        alwaysOnTop: true,
        skipTaskbar: true,
        title: "Spotlight Electron",
        autoHideMenuBar: true,
        useContentSize: false,
    },
    fuse: {
        keys: ['name'],
        shouldSort: true,
        threshold: 0.1
    },
    output: {
        max: 5,
        heightPerItem: 45
    }
};