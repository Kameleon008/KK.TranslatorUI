const { screen } = require('electron');

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getCursorPosition() {
    const cursorPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPoint);

    const windowX = cursorPoint.x;
    const windowY = cursorPoint.y;

    const { width, height, x, y } = display.bounds;
    const winWidth = 400, winHeight = 300;

    const finalX = Math.min(Math.max(windowX, x), x + width - winWidth);
    const finalY = Math.min(Math.max(windowY, y), y + height - winHeight);

    return {
        x: finalX,
        y: finalY
    }
}

module.exports = {
    wait,
    getCursorPosition
};