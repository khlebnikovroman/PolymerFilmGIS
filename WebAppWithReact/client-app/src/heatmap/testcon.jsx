import React from 'react';
import {contourDensity} from 'd3-contour';
import {scaleLinear} from 'd3-scale';
import {addressPoints2} from "../components/map/exampleData2";

const Heatmap = () => {
    function contourGenerator(data) {
        console.log(data)
        const xScale = scaleLinear().domain([0, 1]).range([0, 500]); // adjust domain and range as needed
        const yScale = scaleLinear().domain([0, 1]).range([0, 500]); // adjust domain and range as needed
        const valueScale = scaleLinear().domain([0, 100]).range([0, 1]); // adjust domain and range as needed

        return contourDensity()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .weight(d => valueScale(d[2]))
            .size([500, 500]) // adjust size as needed
            .bandwidth(40) // adjust bandwidth as needed
            .thresholds(10) // adjust number of thresholds as needed
            (data);
    }

    const data = addressPoints2.map(([x, y, weight]) => ({0: x, 1: y, 2: weight}));
    const contours = contourGenerator(data);

    return (
        <svg width={500} height={500}>
            {contours.map((contour, i) => (
                <path
                    key={i}
                    d={contour}
                    fill="none"
                    stroke="black"
                    strokeWidth={2}
                />
            ))}
        </svg>
    );
}

export default Heatmap;