function swordPlot(where,data,pixel,grayData, minTime, span){
	var container = d3.select(where);

	var w = 3000;
	var singleH = 700;
	var sword = 220;

	this.minTime = minTime;
	this.span = span;

	container.selectAll("*").remove();

	var svg = this.svg = container.append("svg").attr("class","mosaicSvg")
									// .attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + w+ " " + (singleH * 2 + sword) );

	var upperY = d3.scale.linear().range([ singleH, 0]);
	var lowerY = d3.scale.linear().range([ 0,singleH ]);

	var x = d3.scale.linear().range([0,w]);

 	// Number of timestamps
	var times = Object.keys(data).length;
	x.domain([0,times-1]);

	var upperColor=[];
	var lowerColor=[];
	var degree = [];

	var max = 0;

	for (var i=0; i<times;i++){
		var d = data[i][pixel];

		upperColor.push(d[0]); //gcolor
		lowerColor.push(d[1]); //icolor
		if (d[2]){
			degree.push(d[2]);
			if (d[2]>max){
				max = d[2];
			}
		} else{
			degree.push(0);
		}
	}

	// console.log(max);

	var barW = x(1)-x(0);
	upperY.domain([0,max]);
	lowerY.domain([0,max]);

	svg.append("rect").attr("class","sword")
						.attr("x",0)
						.attr("y",singleH)
						.attr("height",sword)
						.attr("width",w)
						.style("fill","#000000")


  // vertical axis and labels
	svg.append("line")
	  .attr("x1", 0)
		.attr("y1", upperY(max))
		.attr("x2", 0)
		.attr("y2", singleH)
		.style("stroke", "black")
		.style("stroke-width", 10);

	svg.append("line")
	  .attr("x1", 0)
		.attr("y1", upperY(max))
		.attr("x2", 50)
		.attr("y2", upperY(max))
		.style("stroke", "black")
		.style("stroke-width", 10);

	svg.append("text")
	  .attr("x", 80)
		.attr("y", upperY(max) + 45)
		.style("fill", "black")
		.style("font-size", 92)
		.text(" " + max);

	// time start & end labels
	svg.append("text")
	  .attr("x", 0)
		.attr("y", singleH + sword + 70)
		.style("fill", "black")
		.style("font-size", 74)
		.text(" " + 0);

	svg.append("text")
	  .attr("x", w - 110)
		.attr("y", singleH + sword + 70)
		.style("fill", "black")
		.style("font-size", 74)
		.text(" " + 100);


	svg.selectAll(".upperBar").data(upperColor).enter().append("rect")
							.attr("class","upperBar")
							.attr("x",function(d,i){
								return x(i);
							})
							.attr("y",function(d,i){
								return upperY(degree[i]);
							})
							.attr("width",barW)
							.attr("height",function(d,i){
								return singleH - upperY(degree[i]);
							})
							.style("fill",function(d,i){
								return colorScale[d];
							})

	svg.selectAll(".lowerBar").data(lowerColor).enter().append("rect")
							.attr("class","lowerBar")
							.attr("x",function(d,i){
								return x(i);
							})
							.attr("y",singleH + sword)
							.attr("width",barW)
							.attr("height",function(d,i){
								return lowerY(degree[i]);
							})
							.style("fill",function(d,i){
								return colorScale[d];
							});


	var maxG = 0;
	var minG = Infinity;
	var gray = [];
	for (var i=0;i<grayData.length;i++){
		gray.push(grayData[i][pixel])
		maxG = Math.max(grayData[i][pixel],maxG);
		minG = Math.min(grayData[i][pixel],minG);
	}

	// Set the ranges
	this.x = d3.scale.linear().range([0, w]);
	var x = this.x;
	this.y = d3.scale.linear().range([singleH+sword, singleH]);
	var y = this.y;
	x.domain([0,grayData.length]);
  y.domain([minG-1, maxG +1]);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d,i) { return y(d); });

	// Add the valueline path.
  svg.append("path")
    .attr("class", "swordLine")
    .attr("d", valueline(gray));


  // highlight the selected time
	svg.append("rect").attr("id", "swordTimeWindow")
		.attr("x", w * this.minTime / 101)
		.attr("y", singleH)
		.attr("height", sword)
		.attr("width", w * this.span / 101)
		.style("fill", "white")
		.style("opacity", 0.5);

	this.changeTime = function(min, span){
		// console.log(min);
		// console.log(span);
		svg.select("#swordTimeWindow")
			.attr("x", w * min / 101)
			.attr("width", w * span / 101);
	}

	// check it !!!!
	this.reset = function(min, span) {
		// container.selectAll("*").remove();
		// console.log(minT);
		// console.log(spanT);
		if (min === undefined) {
			return new swordPlot(where, data, 1, grayData, this.minTime, this.span);
		}
		return new swordPlot(where, data, 1, grayData, min, span);
	}

}
