var overallColor={};
// var overallColorLeft={};
// var overallColorRight={};
var pStartPointShared;  // the top left corner of mosaic plot
var pStartPointSharedPre;  // when sync zoom

var initAction = null;


function mosaicView(where, rows, cols, commData, min, span, swordID, starID, netData, grayData, imgData){
	var container = d3.select(where);
	container.selectAll("*").remove();

	var r = rows;
	var c = cols;
	var that = this;

	// var ZOOM_ID = "#zoomDivContainer";
	var SWORD_ID = swordID;

	this.cols = c;
	this.rows = rows;
	this.commData = commData;
	this.minTimeShown = min;
	this.span = span;
	this.action = viewAction;

	var cellSize = 10;
	var pixels;

	this.pStartPoint;
	this.selectedPixel = 0;

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + c * cellSize + " " + r * cellSize)
									.style("background-color", "none");

	var img = svg.append("svg:image")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("width", c * cellSize)
  	.attr("height", r * cellSize)
	  .attr("xlink:href", "img/" + imgData + ".jpg");

	this.zoomDiv = container.append("div").attr("class","zoomDivContainer");

	var data = [];

	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			data.push({ "r": i, "c":j});
		}
	}

	this.lensSize = 5;

	// Create the mosaic tiles
	svg.selectAll(".tile").data(data).enter().append("rect")
											.attr("class","tile")
											.attr("width", cellSize)
											.attr("height",cellSize)
											.attr("x",function(d){
												return d["c"] * cellSize;
											})
											.attr("y",function(d){
												return d["r"] * cellSize;
											});


	this.lensRect = svg.append("rect").attr("class","lens")
									.attr("width", (this.action=="zoom"? this.lensSize : 1) * cellSize)
									.attr("height", (this.action=="zoom"? this.lensSize :1) * cellSize)
									.style("fill","transparent")
									.style("stroke","#000000")
									.style("stroke-width", Math.floor(cellSize / 3))
									.on("mouseup",function(d){
										if (that.action == "zoom"){
											pixels = [];
											that.pStartPoint = d;
											pStartPointShared = d;

											for (var i=0;i<that.lensSize;i++){
												for (var j=0;j<that.lensSize;j++){
													pixels.push( (d["r"] + i)* that.cols + d["c"] + j );
												}
											}
											that.zoom = new zoomView(that.zoomDiv,that.commData,pixels,that.minTimeShown,that.span, swordID, grayData, starID, netData, that.selectedPixel);
											that.onZoomFun(pixels, d);  // for the other side

											/********** check this part **********/
											if (where === "#mosaicDivContainerLeft") {
												sword = sword.reset(that.minTimeShown, that.span);
												star = star.reset();
												if (timeSync && zoomSync) {
													swordRight = swordRight.reset(that.minTimeShown, that.span);
													starRight = starRight.reset();
												} else if (!timeSync && zoomSync) {
													swordRight = swordRight.reset();
													starRight = starRight.reset();
												} // else if (timeSync && !zoomSync) { // no change ... }
											} else if (where === "#mosaicDivContainerRight") {
												swordRight = swordRight.reset(that.minTimeShown, that.span);
												starRight = starRight.reset();
												if (timeSync && zoomSync) {
													sword = sword.reset(that.minTimeShown, that.span);
													star = star.reset();
												} else if (!timeSync && zoomSync) {
													sword = sword.reset();
													star = star.reset();
												}
											}
											/***********************************/
										} else if (that.action=="sword"){
											// color star plot with its most common community color
											console.log(d["r"] * that.cols + d["c"]);

											overallColor[r* this.cols + c] = that.mostCommon(d["r"],d["c"]);
											// that.sword = new swordPlot(SWORD_ID,that.commData,(d["r"]) * that.cols + d["c"],grayData );
											// that.star = new starPlot(starID,netData,(d["r"]) * that.cols + d["c"]);
											if (swordID === "#swordDivContainerLeft") {
												sword = new swordPlot(SWORD_ID, that.commData, (d["r"]) * that.cols + d["c"], grayData, that.minTimeShown, that.span);
												star = new starPlot(starID, netData, (d["r"]) * that.cols + d["c"]);
											} else if (swordID === "#swordDivContainerRight") {
												swordRight = new swordPlot(SWORD_ID, that.commData, (d["r"]) * that.cols + d["c"], grayData, that.minTimeShown, that.span);
												starRight = new starPlot(starID, netData, (d["r"]) * that.cols + d["c"]);
											}
										} else if (that.action == "KNN"){
											that.onKNNFun(that.commData,(d["r"]* that.cols + d["c"] ),that.minTimeShown,that.span);
										}

										// that.initAction = that.action;
										initAction = that.action;

                    // red box to highlight
										svg.selectAll(".selectedLens").remove();
										svg.append("rect").attr("class","selectedLens")
											.attr("x", d.c * cellSize)
										  .attr("y", d.r * cellSize)
										  .attr("width", (that.action=="zoom"? that.lensSize : 1) * cellSize)
										  .attr("height", (that.action=="zoom"? that.lensSize : 1) * cellSize)
											.style("fill", "#000000")
											.style("opacity", 0.6)
											.style("stroke","#FF0000")
											.style("stroke-width", Math.floor(cellSize / 2));
									});


	svg.selectAll(".tile")
	  .on("mouseover",function(d){
			var c = Math.min(d["c"],cols-that.lensSize);
			var r = Math.min(d["r"],rows-that.lensSize);

			that.lensRect.attr("x", c * cellSize)
				.attr("y", r * cellSize)
				.datum({"r":r, "c":c});
		});


	this.onZoom = function(fun){
		this.onZoomFun = fun;
	}


	this.zoomHere = function(pixels, d){
		if (pixels === undefined) {
			pixels = [];
			for (var i=0;i<that.lensSize;i++){
				for (var j=0;j<that.lensSize;j++){
					pixels.push( (d["r"] + i)* that.cols + d["c"] + j );
				}
			}
		}

		this.zoom = new zoomView(that.zoomDiv, that.commData, pixels, that.minTimeShown, that.span, swordID, grayData, starID, netData, that.selectedPixel);

		svg.selectAll(".selectedLens").remove();
		svg.append("rect").attr("class","selectedLens")
			.attr("x", d.c * cellSize)
			.attr("y", d.r * cellSize)
			.attr("width", (that.action=="zoom"? that.lensSize : 1) * cellSize)
			.attr("height", (that.action=="zoom"? that.lensSize : 1) * cellSize)
			.style("fill", "#000000")
			.style("opacity", 0.6)
			.style("stroke","#FF0000")
			.style("stroke-width", Math.floor(cellSize / 2));
	}


	this.updateColor = function(){
		svg.selectAll(".tile")
		  .attr("fill",function(d,i){
				return that.mostCommon(d["r"],d["c"]);
			});
	}


	this.updateZoom = function(min, span) {
		var location;
		if (zoomSync) {
			location = pStartPointShared;
		} else {
			location = that.pStartPoint;
		}

		pixels = [];
		for (var i=0;i<that.lensSize;i++){
			for (var j=0;j<that.lensSize;j++){
				pixels.push( (location["r"] + i) * that.cols + location["c"] + j );
			}
		}

		that.zoom = new zoomView(that.zoomDiv, that.commData, pixels, min, span, swordID, grayData, starID, netData, that.selectedPixel);
		that.onZoomFun(pixels, location);  // for the other side

		svg.selectAll(".selectedLens")
			.attr("x", location.c * cellSize)
			.attr("y", location.r * cellSize);
	}


	this.getPixels = function() {
		return pixels;
	}


	this.getLocation = function() {
		if (that.pStartPoint === undefined) {
			return pStartPointSharedPre;
		}
		return that.pStartPoint;
	}


	this.changeTimeSpan = function(min,span){
		this.minTimeShown = min;
		this.span = span;
		this.updateColor();
	}


	this.changeAction = function(action){
		this.zoomDiv.style("visibility","hidden");
		this.action = action;
		this.lensRect.attr("width", (this.action=="zoom"? this.lensSize : 0) * cellSize)
					 .attr("height", (this.action=="zoom"? this.lensSize : 0) * cellSize);
	}


  // pixel color
	this.mostCommon = function(r,c) {
		colors = {};

		for (var j in colorScale){
			colors[colorScale[j]] = 0;
		}
		for (var i = this.minTimeShown; i< this.minTimeShown + this.span; i++){
			colors[colorScale[this.commData[i][r* this.cols + c][1]]] += 1;  // gcolor: [][][0]; icolor: [][][1]
		}
		colors[colorScale[0]] = 0;

		var max = 0;
		var maxInd = 0;

		for (var j in colorScale){
			if (colors[colorScale[j]]>max){
				max = colors[colorScale[j]];
				maxInd = j;
			}
		}

		overallColor[r* this.cols + c] = colorScale[maxInd];

		if (maxInd === 0) {
			return "transparent";
		} else {
			return colorScale[maxInd];
		}

	}


	this.changeLensSize = function(num) {
		if (num>0){
			this.zoomDiv.style("visibility","hidden");
			this.lensSize = num;
			this.lensRect.attr("width", (this.action=="zoom"? this.lensSize : 1) * cellSize)
						 .attr("height", (this.action=="zoom"? this.lensSize : 1) * cellSize);
		}
	}


	this.changeLensDivSize = function(num){
		this.zoomDiv.style("width",num +"%").style("height",num +"%");
	}


	this.updateColor();

}
