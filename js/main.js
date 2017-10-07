$(document).ready(function() {
    const CIRCLE_RADIUS = 150;

    const ELLIPSE_RADIUS_X = 300;
    const ELLIPSE_RADIUS_Y = 100;

    const DEFAULT_CIRCLE_X = 200;
    const DEFAULT_CIRCLE_Y = 500;

    const DEFAULT_ELLIPSE_X = 700;
    const DEAFULT_ELLIPSE_Y = 500;

    var canvas = new CanvasApi();
    var drawWizard = new DrawWizard(canvas);

    var $wInput = $('#window-width');
    var $hInput = $('#window-height');

    drawWizard.circleCenter = {
        x: DEFAULT_CIRCLE_X,
        y: DEFAULT_CIRCLE_Y
    };

    drawWizard.ellipseCenter = {
        x: DEFAULT_ELLIPSE_X,
        y: DEAFULT_ELLIPSE_Y
    };

    drawWizard.circleRadius = CIRCLE_RADIUS;

    drawWizard.clearCanvas();
    drawClippingWindow(false);
    drawCircle(false);
    drawEllipse(false);

    function drawClippingWindow(redrawTheSame) {
        var clippingWindowH = $hInput.val();
        var clippingWindowW = $wInput.val();

        if (!redrawTheSame) {
            var clippingWindow = getClippingWindow(canvas.getWidth(), canvas.getHeight(), clippingWindowW, clippingWindowH);

            drawWizard.clippingWindowCoordinates = clippingWindow.coordinates;
            drawWizard.clippingWindowCorners = clippingWindow.corners;
        }

        drawWizard.drawClippingWindow();
    }

    function drawCircle(redrawTheSame) {
        if (!redrawTheSame) {
            drawWizard.curCircleCoordinates =  getEllipse(drawWizard.circleCenter.x, drawWizard.circleCenter.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
        }
        drawWizard.drawCircle();
    }

    function drawEllipse(redrawTheSame) {
        if (!redrawTheSame) {
            drawWizard.curEllipseCoordinates =  getEllipse(drawWizard.ellipseCenter.x, drawWizard.ellipseCenter.y, ELLIPSE_RADIUS_X, ELLIPSE_RADIUS_Y);
        }
        drawWizard.drawEllipse();
    }

    function onInputChanged() {
        drawWizard.clearCanvas();
        drawClippingWindow(false);
        drawCircle(true);
        drawEllipse(true);
    }

    function onCanvasMouseDown(e) {
        var position = canvas.getMousePos(e);
        
        switch (e.which) {
            case 1: {
                drawWizard.circleCenter = position;

                drawWizard.clearCanvas();
                drawClippingWindow(true);
                drawCircle(false); 
                drawEllipse(true);

            } break;
            case 2: {
                drawWizard.ellipseCenter = position;

                drawWizard.clearCanvas();
                drawClippingWindow(true);
                drawCircle(true);
                drawEllipse(false);

            } break;
            case 3: break;
        }
    }

    $wInput.on('change', onInputChanged);
    $hInput.on('change', onInputChanged);

    canvas.setMouseDownListener(onCanvasMouseDown.bind(this));

    $('#play').click(function() {
        drawWizard.rotateAndTransfer();
    });

});    