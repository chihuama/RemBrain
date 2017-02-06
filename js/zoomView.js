// mosaic matrix
function zoomView(where, commData, pixels, minTime, span, swordID, grayData, starID, netData, selectedPixel){

	var allContainer = where.style("visibility","visible");
	var that=this;

	allContainer.selectAll("*").remove();

	var title = allContainer.append("div").attr("class","zoomTitleBar");
	var container = allContainer.append("div").attr("class","zoomContentContainer");

  var mosaicTitle = title.append("div")
	  .append("text")
		.attr("class", "titleMosaic")
		.text("Community Dynamics in the Selected Region");

	var l = Math.ceil(Math.sqrt(pixels.length));
	var squareLPct = (100-l) / l;

	for (var i= 0; i<pixels.length;i++){
		// one pixel over time
		var zoomBox = container.append("div")
				.attr("class","zoomSquareDiv")
				.style("top", (Math.floor(i/l) * (squareLPct + 1) ) + "%")
				.style("left", (Math.floor(i % l) * (squareLPct + 1) ) + "%")
				.style("width", (squareLPct) + "%")
				.style("height", (squareLPct) + "%");

		var zoom = new pixelView(zoomBox, commData, pixels[i], minTime, span, swordID, grayData, starID, netData, selectedPixel);
	}


	this.offX = 0;
	this.offY=0;
	this.dragging = false;
	this.lastX = 0;
	this.lastY = 0;

	var drag = d3.behavior.drag()
		.on("dragstart", function(d,i){
			that.lastX = d3.event.sourceEvent.pageX;
			that.lastY = d3.event.sourceEvent.pageY;
			//console.log(d3.event,that.lastX);
		 })
    .on("drag", function(d,i) {
			var dx = d3.event.sourceEvent.pageX - that.lastX;
      var dy = d3.event.sourceEvent.pageY - that.lastY;

      that.lastX = d3.event.sourceEvent.pageX;
			that.lastY = d3.event.sourceEvent.pageY;

      that.offX += dx;
      that.offY += dy;

      allContainer.style("top", function(d,i){
        return that.offY+"px";
      })
			.style("left", function(d,i){
        return that.offX+"px";
      })
    });

	title.call(drag);
}
