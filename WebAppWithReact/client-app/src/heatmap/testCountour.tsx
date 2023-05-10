export {}
//
//
// import React, {useRef} from "react";
// //import {svg} from "./countoursGenerator"
// import * as d3 from "d3"
// import Consumer from "./consumer";
// import {addressPoints2} from "../components/map/exampleData2";
// import Consumer2 from "./consumer";
//
// export const MultilineChart = () => {
//     const svgRef = useRef(null);
//     const width = 12000;
//     const height = 12000;
//    
//
//     React.useEffect(() => {
//        
//         // Create root container where we will append all other chart elements
//         const svg = d3.select(svgRef.current);
//
//         const data2:Consumer2[] = addressPoints2.map(p=>new Consumer2(Number(p[0]),Number(p[1]),Number(p[2])))
//        
//         var xRange = [-180,180];
//         var yRange = [-90,90];
//         svg.select("#App")
//             .append("svg")
//             .attr("width", width*2)
//             .attr("height", height*2)
//             .append("g");
//         const densityData = d3
//             .contourDensity()
//             .x(function (d) {
//                 // @ts-ignore
//                 return d.lat;
//             }) // x and y = column name in input data
//             .y(function (d) {
//                 // @ts-ignore
//                
//                 return d.long;
//             })
//             .weight(function (d) {
//                 // @ts-ignore
//                 return d.power;
//             })
//             .size([width, height])
//             // @ts-ignore
//             .bandwidth(5)(data2);
//         var colorArray = [
//             "red",
//             "blue",
//             "pink",
//             "yellow",
//             "brown",
//             "purple",
//             "black",
//             "white",
//             "green"
//         ];
//         var step = d3
//             .scaleLinear()
//             .domain([1, colorArray.length]) //8 steps of color
//             .range([1, densityData.length]); // range of frequency values
//        
//         var stepDomain = [];
//         for (let i in densityData) {
//             stepDomain.push(step(+i + 1));
//         }
//         stepDomain[0] = -1;
//         stepDomain[stepDomain.length - 1] = 1;
//         // @ts-ignore
//         var color = d3.scaleLinear().domain(stepDomain).range(colorArray);
//
//         svg
//             .append("g")
//             .selectAll("path")
//             .data(densityData)
//             .join("path")
//             .attr("fill", (d, i) => color(i))
//             .attr("d", d3.geoPath());
//     }, []); // Redraw chart if data changes
//
//     return <svg ref={svgRef} width={width} height={height} />;
// };
