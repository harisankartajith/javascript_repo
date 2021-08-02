var svg = d3.select("#barChart"),
        margin = 60,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin


var xScale = d3.scaleBand().range([width, 0]).padding(0.4),
yScale = d3.scaleLinear().range([height, 0]);

d3.csv("fifa-world-cup.csv", function(error, data) {
    if (error) {
        throw error;
    }

    xScale.domain(data.map(function(d) { return d.YEAR; }));
    
    d3.select("#xAxis")
    .attr("transform", "translate(" + margin + "," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text") 
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
        return "rotate(-65)" 
    });

    var yAxisHandleForUpdate = d3.select("#yAxis")
                                .attr("transform", "translate(" + margin + ", 0)")
                                .call(d3.axisLeft(yScale));
     
    var updateBars = function(value) {
        yScale.domain([0, d3.max(data, function(d) { return d[value]; })]);        
        yAxisHandleForUpdate.call(d3.axisLeft(yScale));

        var g = d3.select("#bars")
                    .attr("transform", "translate(" + margin + ", 0)");

        var bars = g.selectAll(".bar")
                    .data(data);

        bars.enter().append("rect")
             .attr("class", "bar")
             .attr("x", function(d) { return xScale(d.YEAR); })
             .attr("y", function(d) { return yScale(d[value]); })
             .attr("width", xScale.bandwidth())
             .attr("height", function(d) { return height - yScale(d[value]); });

        bars.transition().duration(800)
             .attr("y", function(d) { return yScale(d[value]); })
             .attr("height", function(d) { return height - yScale(d[value]); });

        bars.exit().remove();
    };


    d3.select("#dataset").on('change', function() {
        var newData = d3.select(this).property('value').toUpperCase();
        if (newData == "ATTENDANCE"){
            newData = "AVERAGE_" + newData;
        }    
        updateBars(newData);
    });

    var initialData = "AVERAGE_ATTENDANCE";
    updateBars(initialData);
});