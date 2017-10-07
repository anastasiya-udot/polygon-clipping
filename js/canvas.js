function CanvasApi() {
    this.elem = document.getElementById("draw-area");;
    this.canvas = this.elem.getContext("2d");;

    const GRAY = "rgba(26, 22, 22, 1)";

    const PIXEL_WIDTH = 1;
    const PIXEL_HEIGHT = 1;

    this.setPixel = function(x, y, color) {
        this.canvas.fillStyle = color;
        this.canvas.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT); 
    };

    this.getXCenter = function() {
        return Math.floor(this.elem.width / 2);
    };

    this.getYCenter = function() {
        return Math.floor(this.elem.height / 2);
    };

    this.getWidth = function() {
        return this.elem.width;
    };

    this.getHeight = function() {
        return this.elem.height;
    };

    this.getMousePos = function(e) {
        var rect = this.elem.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
    }

    this.drawPolygon = function(coordinates, color) {
        var _this = this;

        color = color || GRAY;

        coordinates.forEach(function(point) {
            _this.setPixel(point.x, point.y, color);
        });
    };

    this.clear = function() {
        this.canvas.clearRect(0, 0, this.elem.width, this.elem.height)
    };

    this.setMouseDownListener = function(callback) {
        $(this.elem).mousedown(callback);
    }
}
