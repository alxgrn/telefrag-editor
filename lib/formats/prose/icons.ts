/**
 * Иконки для меню
 * Все взято из https://react-icons.github.io/react-icons/icons/lu/
 */

// Сюда будем помещать все остальное
const createSVG = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');  
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('height', '1em');
    svg.setAttribute('width', '1em');
    return svg;
};

// Рамка вокруг иконки
const createBorder = () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('width', '18');
    rect.setAttribute('height', '18');
    rect.setAttribute('x', '3');
    rect.setAttribute('y', '3');
    rect.setAttribute('rx', '2');
    rect.setAttribute('ry', '2');
    return rect;
};

// Картинка
export const iconImage = () => {
    const svg = createSVG();
    const rect = createBorder();

    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', '9');
    circle.setAttribute('cy', '9');
    circle.setAttribute('r', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21');
  
    svg.appendChild(rect);
    svg.appendChild(circle);
    svg.appendChild(path);
  
    return { dom: svg };
};

// Горизонтальная линия
export const iconHR = () => {
    const svg = createSVG();
    const rect = createBorder();    
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', 'M3 12h18');
    svg.appendChild(rect);
    svg.appendChild(path);
    return { dom: svg };
};

// Жирный текст
export const iconBold = () => {
    const svg = createSVG();
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', 'M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8');
    svg.appendChild(path);
    return { dom: svg };
};

// Наклонный текст
export const iconItalic = () => {
    const line1 = document.createElementNS('http://www.w3.org/2000/svg','line');
    line1.setAttribute('x1', '19');
    line1.setAttribute('x2', '10');
    line1.setAttribute('y1', '4');
    line1.setAttribute('y2', '4');

    const line2 = document.createElementNS('http://www.w3.org/2000/svg','line');
    line2.setAttribute('x1', '14');
    line2.setAttribute('x2', '5');
    line2.setAttribute('y1', '20');
    line2.setAttribute('y2', '20');

    const line3 = document.createElementNS('http://www.w3.org/2000/svg','line');
    line3.setAttribute('x1', '15');
    line3.setAttribute('x2', '9');
    line3.setAttribute('y1', '4');
    line3.setAttribute('y2', '20');

    const svg = createSVG();
    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);
    return { dom: svg };
};

// Подчеркнутый
export const iconUnderline = () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', 'M6 4v6a6 6 0 0 0 12 0V4');

    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', '4');
    line.setAttribute('x2', '20');
    line.setAttribute('y1', '20');
    line.setAttribute('y2', '20');

    const svg = createSVG();
    svg.appendChild(path);
    svg.appendChild(line);
    return { dom: svg };
};

// Зачеркнутый
export const iconStrikethrough = () => {
    const path1 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path1.setAttribute('fill', 'none');
    path1.setAttribute('d', 'M16 4H9a3 3 0 0 0-2.83 4');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path2.setAttribute('fill', 'none');
    path2.setAttribute('d', 'M14 12a4 4 0 0 1 0 8H6');

    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', '4');
    line.setAttribute('x2', '20');
    line.setAttribute('y1', '12');
    line.setAttribute('y2', '12');

    const svg = createSVG();
    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(line);
    return { dom: svg };
};

// Ссылка
export const iconLink = () => {
    const path1 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path1.setAttribute('fill', 'none');
    path1.setAttribute('d', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path2.setAttribute('fill', 'none');
    path2.setAttribute('d', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71');

    const svg = createSVG();
    svg.appendChild(path1);
    svg.appendChild(path2);
    return { dom: svg };
};

// Строка кода
export const iconCode = () => {    
    const polyline1 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    polyline1.setAttribute('fill', 'none');
    polyline1.setAttribute('points', '16 18 22 12 16 6');

    const polyline2 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    polyline2.setAttribute('fill', 'none');
    polyline2.setAttribute('points', '8 6 2 12 8 18');

    const svg = createSVG();
    svg.appendChild(polyline1);
    svg.appendChild(polyline2);
    return { dom: svg };
};

// Заголовок
export const iconHeading = () => {
    const path1 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path1.setAttribute('fill', 'none');
    path1.setAttribute('d', 'M6 12h12');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path2.setAttribute('fill', 'none');
    path2.setAttribute('d', 'M6 20V4');

    const path3 = document.createElementNS('http://www.w3.org/2000/svg','path');
    path3.setAttribute('fill', 'none');
    path3.setAttribute('d', 'M18 20V4');

    const svg = createSVG();
    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);
    return { dom: svg };
};
