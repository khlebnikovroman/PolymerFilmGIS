import * as d3 from "d3"

const value = (x, y) => -(x ** 2 + y ** 2);
const height = 1200;
const width = 1200;
let thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let color = d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateMagma)
let x = d3.scaleLinear([-20, 20], [0, width + 28])
let y = d3.scaleLinear([-20, 20], [height, 0])

const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
const x0 = -q / 2, x1 = width + 28 + q;
const y0 = -q / 2, y1 = height + q;
const n = Math.ceil((x1 - x0) / q);
const m = Math.ceil((y1 - y0) / q);
const grid = new Array(n * m);
for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
        grid[j * n + i] = value(x.invert(i * q + x0), y.invert(j * q + y0));
    }

    grid.x = -q;
    grid.y = -q;
    grid.k = q;
    grid.n = n;
    grid.m = m;
}
let transform = ({type, value, coordinates}) => {
    return {
        type, value, coordinates: coordinates.map(rings => {
            return rings.map(points => {
                return points.map(([x, y]) => ([
                    grid.x + grid.k * x,
                    grid.y + grid.k * y
                ]));
            });
        })
    };
}

let contours = d3.contours()
    .size([grid.n, grid.m])
    .thresholds(thresholds)
    (grid)
    .map(transform)

const xAxis = g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove())

const yAxis = g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove())
let svg = d3.create("svg")
    .attr("viewBox", [0, 0, width + 28, height])
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("width", "calc(100% + 28px)");

svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
    .attr("fill", d => color(d.value))
    .attr("d", d3.geoPath());

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);
svg = svg.node()
export {svg}