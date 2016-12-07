function starPlot(where,data, pixel){
	var container = d3.select(where);
	// console.log(where);
	var that=this;

	var w =200;
	var h=200;
	this.svgW = w;
	this.svgH = h;

	container.selectAll("*").remove();
	var svg = container.append("svg").attr("class","mosaicSvg")
									//.attr("preserveAspectRatio","none")
									.attr("viewBox",(-w/2)+" "+ (-h/2) +" " + (w)+ " " + (h));

    var rectangle = svg.append("rect")
	    .attr("x", -w/2)
			.attr("y", -h/2)
			.attr("width", w)
			.attr("height", h)
			.style("fill", "white");

	var key0 = Object.keys(data)[0]
	var nCat = Object.keys(data[key0]).length;
	var angleStep = 2 * Math.PI / nCat;

	for (var i=0; i< nCat;i++){
		svg.append("line")
		  .attr("x1",0)
			.attr("y1",0)
			.attr("stroke-dasharray", 1 +","+ 1)
			.attr("x2",Math.cos( i * angleStep) * w/2 * 0.9)
			.attr("y2",Math.sin( i * angleStep) * h/2 * 0.9)
			.attr("class","starPlotAxis");

	  svg.append("text")
		  .attr("transform", "translate(" + Math.cos( i * angleStep) * w/2 * 0.91 + "," + Math.sin( i * angleStep) * h/2 * 0.91 + ")")
		  .attr("dy", ".35em")
		  .attr("text-anchor", "start")
		  .attr("font-size", 18)
		  .style("fill", "black")
		  .text(i);
	}

	var line;
  var d="";

	if (pixel in data){
		for (var i=0; i< nCat;i++){
			var key = Object.keys(data[key0])[i];
			d += (i==0? "M":"L") +  (Math.cos( i * angleStep) * w/2 * 0.9 * data[pixel][key]) + " " + (Math.sin( i * angleStep) * h/2 * 0.9 * data[pixel][key]) + " ";
		}
		d+= "Z";

		line = svg.append("path").attr("d",d)
		  .attr("fill",overallColor[pixel])
			.attr("stroke","black");
			//.attr("class","starPlotPath");
	}

	this.changeColor = function() {
		// console.log(pixel);
		// console.log(overallColor[pixel]);
		line = svg.append("path").attr("d",d)
		  .attr("fill",overallColor[pixel]);
			// .attr("stroke","black");
	}

	this.reset = function() {
		return new starPlot(where,data, 1);
	}

}

/*
function overallStarPlot(where,data){
	var container = d3.select(where);
	var that=this;

	var w =1000;
	var h=1000;
	this.svgW = w;
	this.svgH = h;

	container.selectAll("*").remove();
	var svg = container.append("svg").attr("class","mosaicSvg")
									//.attr("preserveAspectRatio","none")
									.attr("viewBox",(-w/2)+" "+ (-h/2) +" " + (w)+ " " + (h));

  var rectangle = svg.append("rect")
             .attr("x", -w/2)
					   .attr("y", -h/2)
					   .attr("width", w)
					   .attr("height", h)
					   .style("fill", "white");

	var key0 = Object.keys(data)[0]
	var nCat = Object.keys(data[key0]).length;
	var angleStep = 2 * Math.PI / nCat;

	for (var i=0; i< nCat;i++){
		svg.append("line").attr("x1",0)
						  .attr("y1",0)
						  //.attr("stroke-dasharray", 1 +","+ 1)
						  .attr("x2",Math.cos( i * angleStep) * w/2 * 0.9)
						  .attr("y2",Math.sin( i * angleStep) * h/2 * 0.9)
						  .attr("class","overallStarPlotAxis");

		svg.append("text")
		   .attr("transform", "translate(" + Math.cos( i * angleStep) * w/2 * 0.95 + "," + Math.sin( i * angleStep) * h/2 * 0.95 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 60)
		   .style("fill", "black")
		   .text(i);
	}

	for (var pixel in data){
		var d="";
		for (var i=0; i< nCat;i++){
			var key = Object.keys(data[key0])[i];
			d += (i==0? "M":"L") +  (Math.cos( i * angleStep) * w/2 * 0.9 * data[pixel][key]) + " " + (Math.sin( i * angleStep) * h/2 * 0.9 * data[pixel][key]) + " ";
		}

		d+= "Z";

		var line = svg.append("path").attr("d",d)
									.attr("stroke",overallColor[pixel])
									.attr("class","overallStarPlotPath");
	}
}*/
