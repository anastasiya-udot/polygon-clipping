function DrawWizard(canvas) {
    this.canvas = canvas;

    const RED = "rgba(122, 20, 20, 1)";
    const BLUE = "rgba(20, 44, 122, 1)";
    const GREEN = "rgba(6, 105, 10, 1)";

    const TRANSFER_VALUE = 5;
    const SPEED = 50;

    const ONE_DEGREE = 2 * Math.PI / 180;

    const GAP_LENGTH = 10;

    this.timeoutDrawing = null;

    this.curCircleCoordinates = [];
    this.curEllipseCoordinates = [];
    this.clippingWindowCoordinates = [];

    this.clippingWindowCorners = {};

    this.ellipseCenter = null;
    this.circleCenter = null;

    this.clearCanvas = function() {
        this.canvas.clear();
    };

    this.drawClippingWindow = function() {
        this.canvas.drawPolygon(this.clippingWindowCoordinates, GREEN);
    };

    this.drawEllipse = function() {
        var coordinates = this._clippingFilter(this.curEllipseCoordinates, this.curCircleCoordinates);
        var dotted = this._makeDotted(coordinates.dotted);

        this.canvas.drawPolygon(coordinates.solid, BLUE);
        this.canvas.drawPolygon(dotted, GREEN);
    };
    
    this.drawCircle = function() {
        var coordinates = this._clippingFilter(this.curCircleCoordinates);

        this.canvas.drawPolygon(coordinates.solid, RED);
    };

    this._sortByY = function(coordinates) {
        coordinates.sort(function(pointA, pointB) {
            return pointA.y - pointB.y;
        });
    };

    this._sortByX = function(coordinates) {
        coordinates.sort(function(pointA, pointB) {
            return pointA.x - pointB.x;
        });
    };

    this._checkIsOutOfClipperWindow = function(point) {
        var a = this.clippingWindowCorners.a;
        var b = this.clippingWindowCorners.b;
        var c = this.clippingWindowCorners.c;
        var d = this.clippingWindowCorners.d;

        if (a.y <= point.y && a.x <= point.x &&
            b.y <= point.y && b.x >= point.x &&
            c.y >= point.y && c.x >= point.x &&
            d.y >= point.y && d.x <= point.x) {

            return false;
        } 

        return true;
    };

    this._findCommonPoints = function(coordinatesA, coordinatesB) {
        var common = [];

        coordinatesA.forEach(function(pointA) {
            coordinatesB.forEach(function(pointB) {
                if ((Math.floor(pointA.x) - Math.floor(pointB.x) == 0) && (Math.floor(pointA.y) - Math.floor(pointB.y) == 0)) {
                    common.push(pointB);
                }
            });
        });

        return common;
    };

    this._checkIsInCircle = function(point) {
        return Math.pow(point.x - this.circleCenter.x, 2) + Math.pow(point.y - this.circleCenter.y, 2) < Math.pow(this.circleRadius, 2);
    };

    this._makeDotted = function(coordinates) {
        var counter = 0;
        var result = [];

        for (var p = 0; p < coordinates.length; p += 1) {
            if (counter > GAP_LENGTH) {
                p += GAP_LENGTH;
                counter = 0;
                continue;
            }

            counter++;
            result.push(coordinates[p]);
        }

        return result;
    };


    this._clippingFilter = function(coordinates, additionalClipper) {
        var _this = this;
        var innerPoints = coordinates.filter(function(point) { return !_this._checkIsOutOfClipperWindow(point); });
        var dottedPart = [];
        var solidPart = [];

        if (additionalClipper) {
            innerPoints.forEach(function(point) {
                if (_this._checkIsInCircle(point)) {
                    dottedPart.push(point);
                } else {
                    solidPart.push(point);
                }
            });
        } else {
            solidPart = innerPoints;
        }

        return {
            solid: solidPart,
            dotted: dottedPart
        }
    };

    this._divideIntoControlPoints = function(coordinates) {
        var controlPointPeriod = coordinates.length / CONTROL_POINTS_COUNT;
        var controlPoints = [];
        var coordinatesFirstHalf = [];
        var coordinatesSecondHalf = [];
        var tempCoordinates = coordinates.slice(0);

        this._sortByX(tempCoordinates);

        while (tempCoordinates.length) {
            coordinatesFirstHalf.push(tempCoordinates.pop());

            if (!tempCoordinates.length) {
                break;
            }

            coordinatesSecondHalf.push(tempCoordinates.pop());
        }

        var index = 0;

        while (index <= coordinatesFirstHalf) {
            controlPoints.push(coordinatesFirstHalf[index])
            index += controlPointPeriod;
        }

        index = 0;

        while (index <= coordinatesSecondHalf) {
            controlPoints.push(coordinatesSecondHalf[index])
            index += controlPointPeriod;
        }

        return controlPoints;
    };


    this.getFrame = function(clippingCoordinates, cCoordinates, elCoordinates) {
        var _this = this;
    
        return new Promise(function(resolve) {

            this.timeoutDrawing = setTimeout(function() {

                _this.clearCanvas();
                _this.drawCircle();
                _this.drawEllipse();
                _this.drawClippingWindow();

                resolve();
            }, SPEED);
    
        });
    };

    this.clearTimeout = function() {
        this.timeoutDrawing && clearTimeout(this.timeoutDrawing);
    };

    this.rotateCoordinates = function(initCoordinates, transferDirection, center, angle) {
        return initCoordinates.map(function(point) {
            return {
                x: Math.floor(center.x + (point.x - center.x) * Math.cos(angle) - (point.y - center.y) * Math.sin(angle) * transferDirection),
                y: Math.floor(center.y + (point.y - center.y) * Math.cos(angle) + (point.x - center.x) * Math.sin(angle) * transferDirection)
            };
        });
    };

    this.transferCoordiates = function(coordinates, transferDirection, value) {        
        return coordinates.map(function(point) {
            return {
                x: point.x + transferDirection * value,
                y: point.y
            };
        });
    };

    this.rotateAndTransfer = function() {
        var _this = this;

        var circleDirection;
        var ellipseDirection;

        var initialCirclePostion = $.extend({}, this.circleCenter);
        var initialEllipseelPosition = $.extend({}, this.ellipseCenter);

        var angle = 0;
        var transfer = 0;

        var canvasCenterX = this.canvas.getXCenter();

        if (initialCirclePostion.x <= canvasCenterX) {
            circleDirection = 1;
        } else {
            circleDirection = -1;
        }

        if (initialEllipseelPosition.x <= canvasCenterX) {
            ellipseDirection = 1;
        } else {
            ellipseDirection = -1;
        }

        var initialCircleCoordinates = this.curCircleCoordinates.slice(0);
        var initialEllipseCoordinates = this.curEllipseCoordinates.slice(0);

        var generateFramesSequenсe = function() {
    
            if (_this.circleCenter.x < canvasCenterX && _this.ellipseCenter.x > canvasCenterX ||
                _this.circleCenter.x > canvasCenterX && _this.ellipseCenter.x < canvasCenterX) {

                _this.getFrame().then(function() {

                    angle += ONE_DEGREE;
                    transfer += TRANSFER_VALUE;

                    _this.circleCenter.x = initialCirclePostion.x + circleDirection * transfer;
                    _this.ellipseCenter.x = initialEllipseelPosition.x + ellipseDirection * transfer;
                    
                    var tempCircleCoordinates = _this.rotateCoordinates(initialCircleCoordinates, circleDirection, initialCirclePostion, angle);
                    _this.curCircleCoordinates = _this.transferCoordiates(tempCircleCoordinates, circleDirection, transfer);

                    var tempEllipseCoordinates = _this.rotateCoordinates(initialEllipseCoordinates, ellipseDirection, initialEllipseelPosition, angle);
                    _this.curEllipseCoordinates= _this.transferCoordiates(tempEllipseCoordinates, ellipseDirection, transfer);
                    
                    generateFramesSequenсe();
                });
            }
        };

        generateFramesSequenсe();
    };

}