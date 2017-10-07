function getEllipse(x, y, Rx, Ry) {
    var coordinates1 = [];
    var coordinates2 = [];
    var coordinates3 = [];
    var coordinates4 = [];

   /* for (var t = 0; t < 2 * Math.PI; t += 0.01) {
        coordinates.push({
            x: x + Rx * Math.cos(t),
            y: y + Ry * Math.sin(t)
        });
    }

    return coordinates;*/

    draw_ellipse(x, y, Rx, Ry);


    return coordinates1.concat(coordinates2, coordinates3, coordinates4);

    function pixel4(x, y, _x, _y) { // Рисование пикселя для первого квадранта, и, симметрично, для остальных
        coordinates1.push({ x: x + _x, y: y + _y });
        coordinates2.unshift({ x: x - _x, y: y + _y });
        coordinates3.push({ x: x - _x, y: y - _y });
        coordinates4.unshift({ x: x + _x, y: y - _y });
    }

    function draw_ellipse(x, y, a, b) {
        var _x = 0; // Компонента x
        var _y = b; // Компонента y
        var a_sqr = a * a; // a^2, a - большая полуось
        var b_sqr = b * b; // b^2, b - малая полуось
        var delta = 4 * b_sqr * ((_x + 1) * (_x + 1)) + a_sqr * ((2 * _y - 1) * (2 * _y - 1)) - 4 * a_sqr * b_sqr; // Функция координат точки (x+1, y-1/2)
        while (a_sqr * (2 * _y - 1) > 2 * b_sqr * (_x + 1)) // Первая часть дуги
        {
            pixel4(x, y, _x, _y);
            if (delta < 0) // Переход по горизонтали
            {
                _x++;
                delta += 4 * b_sqr * (2 * _x + 3);
            }
            else // Переход по диагонали
            {
                _x++;
                delta = delta - 8 * a_sqr * (_y - 1) + 4 * b_sqr * (2 * _x + 3);
                _y--;
            }
        }
        delta = b_sqr * ((2 * _x + 1) * (2 * _x + 1)) + 4 * a_sqr * ((_y + 1) * (_y + 1)) - 4 * a_sqr * b_sqr; // Функция координат точки (x+1/2, y-1)
        while (_y + 1 != 0) // Вторая часть дуги, если не выполняется условие первого цикла, значит выполняется a^2(2y - 1) <= 2b^2(x + 1)
        {
            pixel4(x, y, _x, _y);
            if (delta < 0) // Переход по вертикали
            {
                _y--;
                delta += 4 * a_sqr * (2 * _y + 3);
            }
            else // Переход по диагонали
            {
                _y--;
                delta = delta - 8 * b_sqr * (_x + 1) + 4 * a_sqr * (2 * _y + 3);
                _x++;
            }
        }
    }

}


function getClippingWindow(cW, cH, width, height) {
    var coordinates = [];

    var center = {
        x: Math.floor(cW / 2),
        y: Math.floor(cH / 2)
    };

    var pointA = {
        x: center.x - Math.floor(width / 2),
        y: center.y - Math.floor(height / 2)
    };

    var pointB = {
        x: center.x + Math.floor(width / 2),
        y: center.y - Math.floor(height / 2)
    };

    var pointC = {
        x: center.x + Math.floor(width / 2),
        y: center.y + Math.floor(height / 2)
    };

    var pointD = {
        x: center.x - Math.floor(width / 2),
        y: center.y + Math.floor(height / 2)
    };

    coordinates.push(pointA);

    var x = pointA.x;

    while (x < pointB.x) {
        x += 1;
        coordinates.push({ x: x, y: pointA.y });
    }

    var y = pointB.y;
    
    while (y < pointC.y) {
        y += 1;
        coordinates.push({ x: pointB.x, y: y });
    }

    x = pointC.x;

    while (x > pointD.x) {
        x -= 1;
        coordinates.push({ x: x, y: pointC.y });
    }

    y = pointD.y;
    
    while (y > pointA.y) {
        y -= 1;
        coordinates.push({ x: pointD.x, y: y });
    }

    return {
        coordinates: coordinates,
        corners: {
            a: pointA,
            b: pointB,
            c: pointC,
            d: pointD
        }
    }
}