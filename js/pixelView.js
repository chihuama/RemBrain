// mosaic matrix
// called in th func: zoomView
function pixelView(where, commData, pixel, minTime, span, swordID, grayData, starID, netData, selectedPixel){
	var container = where;
	var that=this;

	var w =100;
	var h=100;
	this.svgW = w;
	this.svgH = h;

	container.selectAll("*").remove();

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + (w)+ " " + (h));

	var l = Math.ceil(Math.sqrt(span));

	var data =[];

	for (var i= 0; i<span;i++){
		data.push(commData[minTime+i][pixel][1]);  // gcolor: [][][0]; icolor: [][][1]
	}
	// console.log(data);

	var squareL = w/l;

	svg.selectAll(".timeTile").data(data).enter().append("rect")
							.datum((d,i) => {
								return {
									commID: d,
									pixID: pixel
								};
							})
							.attr("class","timeTile")
							.attr("width", squareL)
							.attr("height",squareL)
							.attr("stroke","black")
							.attr("x",function(d,i){
								return i % l * squareL;
							})
							.attr("y",function(d,i){
								return Math.floor(i / l)*squareL;
							})
							.attr("fill",function(d){
								return colorScale[d.commID];
							})
							.on("click", (d) => {
								// console.log(where);
								// console.log(swordID);
								// console.log(d);

								// var test = d3.mouse(this);
								// console.log(d3.event.clientX);
								// console.log(window.innerWidth * 0.41);

								// if (d3.event.clientX <= window.innerWidth * 0.41) {  // left
								// 	overallColor[pixel] = mosaic.mostCommon(Math.floor(pixel/172), pixel%172);
								// 	sword = new swordPlot(swordID, commData, pixel, grayData);
								// 	star = new starPlot(starID, netData, pixel);
								// } else {  // right
								// 	overallColor[pixel] = mosaicRight.mostCommon(Math.floor(pixel/172), pixel%172);
								// 	swordRight = new swordPlot(swordID, commData, pixel, grayData);
								// 	starRight = new starPlot(starID, netData, pixel);
								// }

								if (swordID === "#swordDivContainerLeft") {
									overallColor[pixel] = mosaic.mostCommon(Math.floor(pixel/172), pixel%172);
									sword = new swordPlot(swordID, commData, pixel, grayData, minTime, span);
									star = new starPlot(starID, netData, pixel);

									d3.select(".mosaicDivContainerLeft").select("#highlight").remove();
									mosaic.selectedPixel = pixel;
								} else if (swordID === "#swordDivContainerRight") {
									overallColor[pixel] = mosaicRight.mostCommon(Math.floor(pixel/172), pixel%172);
									swordRight = new swordPlot(swordID, commData, pixel, grayData, minTime, span);
									starRight = new starPlot(starID, netData, pixel);

									d3.select(".mosaicDivContainerRight").select("#highlight").remove();
									mosaicRight.selectedPixel = pixel;
								}


								svg.append("rect").attr("id", "highlight")
								  .attr("x", 0)
									.attr("y", 0)
									.attr("width", w)
									.attr("height", h)
									.style("fill", "#000000")
									.style("opacity", 0.6)
									.style("stroke", "darkred")
									.style("stroke-width", 8);

							});


	if (pixel === selectedPixel) {
    // console.log(pixel);
		svg.append("rect").attr("id", "highlight")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h)
			.style("fill", "#000000")
			.style("opacity", 0.6)
			.style("stroke", "darkred")
			.style("stroke-width", 8);
	}

}

/*
function pixelViewRect(commData, pixel, minTime, span, w){

	var l = Math.ceil(Math.sqrt(span));

	var data =[];
	for (var i= 0; i<span;i++){
		data.push(commData[minTime+i][pixel][0]);
	}

	var squareL = w/l;

	var r = d3.select(document.createElement("rect"))
							.data(data).enter().append("rect")
							.attr("class","timeTile")
							.attr("width", squareL)
							.attr("height",squareL)
							.attr("stroke","black")
							.attr("x",function(d,i){
								return i % l * squareL;
							})
							.attr("y",function(d,i){
								return Math.floor(i / l)*squareL;
							})
							.attr("fill",function(d){
								return colorScale[d];
							})

	return r;
}*/
