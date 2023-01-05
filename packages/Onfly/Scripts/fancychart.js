import * as d3Shape from 'd3-shape';
import * as d3Selection from 'd3-selection';
import * as d3Ease from 'd3-ease';
import * as d3Interpolate from 'd3-interpolate';

/// --------------
/// Simple Charts Library based on d3.js to create some simple graphs based on a percentage number
/// by @ahoiin, Sebastian Sadowski
/// --------------

// define class
export function Fancychart(width, height, colors, color_deactivated) {
  // Define Variables
  this.outerWidth = width || 200;
  this.outerHeight = height || 120;
  this.colors = colors || ['#00ACE4', '#00D8A5', '#9b59b6', '#F1B719', '#e74c3c'];
  this.color_deactivated = color_deactivated || '#e5e5e5';
  this.color_current = Math.random() * colors.length;

  this.duration = 700;
}

// horizontal bar, like a progress bar
Fancychart.prototype.circles = function (el, val, color) {
  const that = this;
  const data = [val, 100 - parseInt(val)];
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const innerWidth = that.outerWidth - margin.left - margin.right;
  const innerHeight = that.outerHeight - margin.top - margin.bottom;
  var color = color || that.colors[Math.round(Math.random() * that.colors.length)];
  const paddingEl = 14;
  const elementsInRow = 13;
  const radius = 4;
  let row = 1;
  const dataset = [];

  data.forEach(function (d, i) {
    while (d--) {
      const c = i == 0 ? color : that.color_deactivated;
      dataset.push({ color: c });
    }
  });

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', that.outerWidth)
    .attr('height', that.outerHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const circle = svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .style('fill', function (d, i) {
      return d.color;
    })
    .attr('r', 0)
    .style('opacity', 0)
    .attr('cx', function (d, i) {
      row = i % elementsInRow == 0 ? i / elementsInRow : row;
      return (i + 1 - row * elementsInRow) * paddingEl;
    })
    .attr('cy', function (d, i) {
      row = i % elementsInRow == 0 ? i / elementsInRow : row;
      return row * paddingEl;
    });

  // simple animation on load: opaciy
  circle
    .transition()
    .duration(that.duration)
    .delay(function (d, i) {
      return 15 * i;
    })
    .style('opacity', 1)
    .attr('r', radius);
};

// horizontal bar, like a progress bar
Fancychart.prototype.barHorizontal = function (el, val, color) {
  const that = this;
  const data = [100, parseInt(val)];
  const margin = { top: 0, right: 0, bottom: 0, left: 10 };
  const innerWidth = that.outerWidth - margin.left - margin.right;
  const innerHeight = that.outerHeight - margin.top - margin.bottom;
  var color = color || that.colors[Math.round(Math.random() * that.colors.length)];
  marginInnerEl = 12;

  const x = d3.scale
    .linear()
    .range([0, innerWidth])
    .domain([
      0,
      d3.max(data, function (d) {
        return d;
      }),
    ]);

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', that.outerWidth)
    .attr('height', that.outerHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${innerHeight - 5}) rotate(0)`);

  const g = svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('g')
    .style('opacity', 0)
    .attr('transform', function (d, i) {
      marginEl = i == 1 ? marginInnerEl / 4 : 0;
      return `translate(${marginEl},${marginEl})`;
    });

  const rect = g
    .append('rect')
    .style('fill', function (d, i) {
      const c = i == 1 ? color : that.color_deactivated;
      return c;
    })
    .attr('width', 0)
    .attr('height', function (d, i) {
      marginEl = i == 1 ? marginInnerEl : 0;
      return innerHeight / 4 - marginEl / 2;
    })
    .attr('rx', marginInnerEl) // set the x corner curve radius
    .attr('ry', marginInnerEl);

  // simple animation on load: opaciy
  g.transition()
    .duration(that.duration)
    .delay(function (d, i) {
      return 200 * i;
    })
    .style('opacity', 1);

  // simple animation on load: movement
  rect
    .transition()
    .duration(that.duration)
    .ease('quad')
    .delay(function (d, i) {
      return 200 * i;
    })
    .attr('width', function (d, i) {
      marginEl = i == 1 ? marginInnerEl : 0;
      return x(d) - marginEl;
    });
};

// vertical bar chart with the option to rotate it 45degree
Fancychart.prototype.barVertical = function (el, val, color, rotate) {
  const that = this;
  const data = [100, parseInt(val)];
  const margin = rotate
    ? { top: 20, right: 70, bottom: 20, left: 5 }
    : { top: 20, right: 50, bottom: 1, left: 10 };
  const innerWidth = that.outerWidth - margin.left - margin.right;
  const innerHeight = that.outerHeight - margin.top - margin.bottom;
  var rotate = rotate || false;
  var color = color || that.colors[Math.round(Math.random() * that.colors.length)];
  marginInnerEl = 5;

  const y = d3.scale
    .linear()
    .range([innerHeight, 0])
    .domain([
      0,
      d3.max(data, function (d) {
        return d;
      }),
    ]);

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', that.outerWidth)
    .attr('height', that.outerHeight)
    .append('g')
    .attr('transform', function (d) {
      const t = rotate
        ? `translate(${margin.left + innerWidth / 2},${0}) rotate(45)`
        : `translate(${margin.left + innerWidth / 2 - innerHeight / 2},${margin.top - 10})`;
      return t;
    });

  const g = svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('g')
    .style('opacity', 0)
    .attr('transform', function (d, i) {
      marginEl = i == 1 ? marginInnerEl : 0;
      return `translate(${marginEl},${marginEl})`;
    });

  const rect = g
    .append('rect')
    .style('fill', function (d, i) {
      const c = i == 1 ? color : that.color_deactivated;
      return c;
    })
    .attr('width', function (d, i) {
      marginEl = i == 1 ? marginInnerEl : 0;
      return innerHeight - marginEl * 2;
    })
    .attr('y', function (d) {
      return innerHeight + marginInnerEl / 2;
    })
    .attr('height', function (d, i) {
      return 0;
    }) ///
    .attr('rx', marginInnerEl) // set the x corner curve radius
    .attr('ry', marginInnerEl);

  // simple animation on load: opaciy
  g.transition()
    .duration(that.duration)
    .delay(function (d, i) {
      return 200 * i;
    })
    .style('opacity', 1);

  // simple animation on load: movement
  rect
    .transition()
    .duration(that.duration)
    .ease('quad')
    .delay(function (d, i) {
      return 200 * i;
    })
    .attr('y', function (d) {
      return y(d);
    })
    .attr('height', function (d, i) {
      marginEl = i == 0 ? marginInnerEl * 2 : 0;
      return innerHeight - y(d) + marginEl;
    });
};

// donut chart
Fancychart.prototype.donut = function (el, val, color) {
  const that = this;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const innerWidth = that.outerWidth - margin.left - margin.right;
  const innerHeight = that.outerHeight - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const data = [val, 100 - val];
  var color = color || that.colors[Math.round(Math.random() * that.colors.length)];

  const arc = d3Shape
    .arc()
    .outerRadius(radius)
    .innerRadius(radius - 10);

  const pie = d3Shape
    .pie()
    .sort(null)
    .value(function (d) {
      return d;
    });

  const svg = d3Selection
    .select(el)
    .append('svg')
    .attr('width', that.outerWidth)
    .attr('height', that.outerHeight)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left + innerWidth / 2},${margin.top + innerHeight / 2})`
    );

  const g = svg.selectAll('.arc').data(pie(data)).enter().append('g').style('opacity', 0);

  const path = g
    .append('path')
    .attr('d', arc)
    .style('stroke-width', '3px')
    .style('stroke', '#fff')
    .style('fill', function (d, i) {
      const c = i == 0 ? color : that.color_deactivated;
      return c;
    });

  // simple animation on load: opacity
  g.transition()
    .duration(that.duration)
    .ease(d3Ease.easeQuad)
    .delay(function (d, i) {
      return 200 * i;
    })
    .style('opacity', 1);

  path.transition().duration(that.duration).ease(d3Ease.easeQuad).attrTween('d', arcTween);

  function arcTween(finish) {
    const start = {
      startAngle: 0,
      endAngle: 0,
    };
    const i = d3Interpolate.interpolate(start, finish);
    return function (d) {
      return arc(i(d));
    };
  }
};
