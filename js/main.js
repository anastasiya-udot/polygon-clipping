$(document).ready(function() {
    var ellipseRadiusX = 300;
    var ellipseRadiusY = 100;

    const DEFAULT_CIRCLE_X = 200;
    const DEFAULT_CIRCLE_Y = 500;

    const DEFAULT_ELLIPSE_X = 700;
    const DEAFULT_ELLIPSE_Y = 500;

    const SCALE_DELTA_R = 5;

    var canvas = new CanvasApi();
    var drawWizard = new DrawWizard(canvas);

    var $wInput = $('#window-width');
    var $hInput = $('#window-height');

    drawWizard.circleRadius = 150;

    drawWizard.circleCenter = {
        x: DEFAULT_CIRCLE_X,
        y: DEFAULT_CIRCLE_Y
    };

    drawWizard.ellipseCenter = {
        x: DEFAULT_ELLIPSE_X,
        y: DEAFULT_ELLIPSE_Y
    };


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
            drawWizard.curCircleCoordinates =  getEllipse(drawWizard.circleCenter.x, drawWizard.circleCenter.y, drawWizard.circleRadius, drawWizard.circleRadius);
        }
        drawWizard.drawCircle();
    }

    function drawEllipse(redrawTheSame) {
        if (!redrawTheSame) {
            drawWizard.curEllipseCoordinates =  getEllipse(drawWizard.ellipseCenter.x, drawWizard.ellipseCenter.y, ellipseRadiusX, ellipseRadiusY);
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

    function onKeyboardpress(e) {
        console.log(e);
        switch(e.key) {
            case '/': {
                drawWizard.circleRadius -= SCALE_DELTA_R;
            } break;
            case '*': {
                drawWizard.circleRadius += SCALE_DELTA_R;
            } break;
            case '5': {
                ellipseRadiusX -= SCALE_DELTA_R;
            } break;
            case '6': {
                ellipseRadiusX += SCALE_DELTA_R;
            } break;
            case '2': {
                ellipseRadiusY -= SCALE_DELTA_R;
            } break;
            case '3': {
                ellipseRadiusY += SCALE_DELTA_R;
            } break; 
        }

        drawWizard.clearCanvas();
        drawClippingWindow(false);
        drawCircle(false);
        drawEllipse(false);
    }

    $wInput.on('change', onInputChanged);
    $hInput.on('change', onInputChanged);

    canvas.setMouseDownListener(onCanvasMouseDown.bind(this));

    $(document).on("keydown", onKeyboardpress.bind(this));

    $('#play').click(function() {
        drawWizard.rotateAndTransfer();
    });



});    