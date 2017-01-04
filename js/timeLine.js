function timelineView(where,data){

	var container = d3.select(where);
	var that=this;

	var w = 1000;
	var h = 120;
	this.svgW = w;
	this.svgH = h;

	var padding = 10;

	this.minTime = 20;
	this.span = 10;
	this.onChangeFunc = function(){};

	var svg = this.svg = container.append("svg").attr("class","mosaicSvg")
									// .attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + (w) + " " + (h));


	var maxS = 10000;
	this.numOfTimes = 0;
	for (var i in data){
		this.numOfTimes +=1;
	}

	// Set the ranges and domains
	var x = this.x = d3.scale.linear()
	  .domain([0,this.numOfTimes])
	  .range([0, w]);

	var y = this.y = d3.scale.linear()
		.domain([0, maxS +1])
		.range([h, 0]);

	// Define the line
	var valueline = this.valueline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d,i) { return y(d[1]); });  // gSize:[0]; iSize: [1]

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));


  // label for the max
	this.updateLabel = function(data) {
		//
		var maxY = 0;
		var maxT = 0;
		for (var i=0; i<data.length; i++) {
			if (maxY <= data[i][1]) {
				maxY = data[i][1];
				maxT = i;
			}
		}
		// console.log(maxY);
		// console.log(maxT);

		svg.select("#labels").remove();

		var labels = svg.append("g").attr("id", "labels");

		labels.append("line")
		  .attr("x1", 50)
			.attr("y1", y(maxY))
			.attr("x2", x(maxT))
			.attr("y2", y(maxY))
			.style("stroke", "darkred")
			.style("stroke-width", 1)
			.style("stroke-dasharray", ("10, 5"));

		labels.append("text")
		  .attr("x", 0)
			.attr("y", y(maxY) + 6)
			.style("fill", "black")
			.style("font-size", 20)
			.text(" " + maxY);

		labels.append("line")
		  .attr("x1", x(maxT))
			.attr("y1", y(maxY))
			.attr("x2", x(maxT))
			.attr("y2", h - 20)
			.style("stroke", "darkred")
			.style("stroke-width", 1)
			.style("stroke-dasharray", ("10, 5"));

		labels.append("text")
		  .attr("x", x(maxT))
			.attr("y", h - 1)
			.style("fill", "black")
			.style("font-size", 20)
			.style("text-anchor", "middle")
			.text(" " + maxT);
	}

  this.updateLabel(data);

  /****************************************/
	// time brush
	// brush for selecting areas
  var timeBrush = this.timeBrush = d3.svg.brush()
	  .x(x)
		.extent([this.minTime, this.minTime + this.span])
		// .on("brushstart", brushstart)
    // .on("brush", brushmove)
    .on("brushend", brushend);

	var tBrush = this.tBrush = svg.append("g");

	this.tBrush
     .attr("class", "x brush")
     .attr("width", w)
     .attr("height", h)
     .call(timeBrush)
   .selectAll("rect")
     .attr("height", h);

	// console.log(timeBrush.extent());

	function brushstart() {
		// console.log("brushstart" + this);
    // console.log(d3.event);
	}

	function brushmove() {
		// console.log("brush" + this);
    // console.log(d3.event);
	}

	function brushend() {
		if (!d3.event.sourceEvent) return; // Only transition after input.

    // if (!d3.event.selection) {
		// 	// default location
		// 	// timeBrush.extent([20, 30]);
		// 	return;
		// }

		that.minTime = Math.round(timeBrush.extent()[0]);
		that.span = Math.round(timeBrush.extent()[1]) - Math.round(timeBrush.extent()[0]);

    if (timeSync) {
		  timeStart = Math.round(timeBrush.extent()[0]);
		  timeSpan = Math.round(timeBrush.extent()[1]) - Math.round(timeBrush.extent()[0]);
	  }

		if (where === "#leftTimelineDivContainer") {
			if (timeSync){
				// timeLineRight.changeTime(this.minTime, this.span);
				timeLineRight.update(timeBrush.extent(), that.minTime, that.span);
				mosaicRight.changeTimeSpan(that.minTime, that.span);
				swordRight.changeTime(that.minTime, that.span);
				starRight.changeColor();
			}
			mosaic.changeTimeSpan(that.minTime, that.span);
			if (initAction != null) {
			  mosaic.updateZoom(that.minTime, that.span);
		  }
			sword.changeTime(that.minTime, that.span);
			star.changeColor();
		} else if (where === "#rightTimelineDivContainer") {
			if (timeSync){
				// timeLine.changeTime(this.minTime, this.span);
				timeLine.update(timeBrush.extent(), that.minTime, that.span);
				mosaic.changeTimeSpan(that.minTime, that.span);
				sword.changeTime(that.minTime, that.span);
				star.changeColor();
			}
			mosaicRight.changeTimeSpan(that.minTime, that.span);
			if (initAction != null) {
				mosaicRight.updateZoom(that.minTime, that.span);
			}
			swordRight.changeTime(that.minTime, that.span);
			starRight.changeColor();
		}
		// console.log(that.minTime);
		// console.log(that.span);
	}

	this.update = function(range, min, span){
		this.tBrush.call(timeBrush.extent(range));
		this.minTime = min;
		this.span = span;
	}


  /****************************************/
	// var LEFT=1;
	// var RIGHT = 2;

	// this.timeWindow = svg.append("rect").attr("class","timeWindow");
	// this.leftHandle = svg.append("circle").attr("class", "left timeHandle").datum(LEFT);
	// this.rightHandle = svg.append("circle").attr("class", "right timeHandle").datum(RIGHT);

	// handles behavior
	// var drag = d3.behavior.drag()
  //   .on("drag", function(d,i) {
  //   	  var xPoint = d3.event.x;
	//   	  var xPerc = xPoint / w;
	//   	  var time = Math.floor(xPerc * that.numOfTimes);
	//   	  if (d == RIGHT) {
	//   		  if (time != that.minTime + that.span){
	//   			  that.span = time - that.minTime;
	//   			  that.updateTimeWindow();
	//   		  }
	//   	  } else {
	//   		  if (time != that.minTime ){
	//   			  var dTime = that.minTime - time;
	//   			  that.minTime = time;
	//   			  that.span += dTime;
	//   			  that.updateTimeWindow();
	//   		  }
	//   	  }
  //   })
  //   .on("dragend",function(){
  //     	that.onChangeFunc(that.minTime,that.span);
  //   });

	// this.rightHandle.call(drag);
	// this.leftHandle.call(drag);

	// svg.on("click",function(e){
  // 	// check if the click is not the end of a drag event
  // 	if (d3.event.defaultPrevented) return;
	//
  // 	var xPoint = d3.mouse(this)[0];
  // 	var xPerc = xPoint / w;
	//
  // 	that.minTime = Math.floor(xPerc * that.numOfTimes);
  // 	that.updateTimeWindow();
  // 	that.onChangeFunc(that.minTime,that.span);
  // });


	// no use
	// Define the axes
	// this.xAxis = d3.svg.axis().scale(x)
	//     .orient("bottom").ticks(5);
	// var xAxis = this.xAxis
	//
	// this.yAxis = d3.svg.axis().scale(y)
	//     .orient("left").ticks(5);
	// var yAxis = this.yAxis

	// no use
	// Add the X Axis
	// svg.append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + h + ")")
	//     .call(xAxis);

	// // Add the Y Axis
	// svg.append("g")
	//     .attr("class", "y axis")
	//     .call(yAxis);

  // no use
  // this.onTimeChange = function(fun){
  // 	this.onChangeFunc = fun;
  // }
	//
  // this.changeTime = function(min,span){
  //   this.minTime = min;
  //   this.span = span;
	// 	// timeStart = min;
  //   // timeSpan = span;
  //   this.updateTimeWindow();
  //   //this.onChangeFunc(this.minTime,this.span); // Causes loop
  // }
	//
	//
  // this.updateTimeWindow = function(){
  // 	if (this.minTime + this.span >= this.numOfTimes){
  // 		this.minTime = this.numOfTimes - this.span -1;
  // 	}
	//
  // 	this.timeWindow.attr("x",this.minTime * (this.svgW / this.numOfTimes))
  //   					     .attr("y",0)
  //   					     .attr("height",this.svgH)
  //   				       .attr("width",this.span * (this.svgW / this.numOfTimes));
	//
  // 	this.leftHandle.attr("cx",this.minTime * (this.svgW / this.numOfTimes))
  //    					     .attr("cy",0)
  //   					     .attr("r",8);
	//
  //   this.rightHandle.attr("cx",(this.minTime + this.span) * (this.svgW / this.numOfTimes))
  //   					      .attr("cy",0)
  //   					      .attr("r",8);
  // }

  // load new dataset
  this.changeData = function(data, min, span){
  	this.minTime = min; //0;
  	this.span = span; //10;
  	// this.updateTimeWindow();
  	this.svg.select(".line")
			.attr("d", this.valueline(data));

		this.updateLabel(data);
  }

	timeStart = this.minTime;
	timeSpan = this.span;
  // this.updateTimeWindow();
}
