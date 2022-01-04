import React from 'react';
import * as d3 from 'd3';

function D3Canvas() {
    
    const temperatureData = [ 8, 5, 13, 9, 12 ]

    d3.select(this.refs.temperatures)
        .selectAll("h2")
        .data(temperatureData)
        .enter()
            .append("h2")
            .text("New Temperature")

    return (null)
}

export default D3Canvas