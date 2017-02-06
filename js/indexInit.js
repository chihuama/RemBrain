var timeLine;
var timeLineRight;
var chooser;
var mosaic;
var mosaicRight;
var sword;
var swordRight;
var star;
var starRight;
var timeSync = true;
var zoomSync = true;
var viewAction = "zoom";
var timeStart = 20;
var timeSpan = 10;
// var knnFun;
var imgLeft;
var imgRight;


function initWithData(data,dataRight,sizeData,sizeDataRight,network,networkRight,grayData,grayData2){

	var r = 130;
	var c = 172;

	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data,20,10,"#swordDivContainerLeft","#starPlotDivContainerLeft",network,grayData, "Young40_a1");
	// var overallLeft = new overallStarPlot("#overallStarPlotDivContainerLeft",network);
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,dataRight,20,10,"#swordDivContainerRight","#starPlotDivContainerRight",networkRight,grayData2, "Old38_a1");
	// var overallRight = new overallStarPlot("#overallStarPlotDivContainerRight",networkRight);

	sword = new swordPlot("#swordDivContainerLeft",data,1,grayData, 20, 10);
	swordRight = new swordPlot("#swordDivContainerRight",dataRight,1,grayData2, 20, 10);

	star = new starPlot("#starPlotDivContainerLeft",network,1);
	starRight = new starPlot("#starPlotDivContainerRight",networkRight,1);

	var legend = new starPlotLegendView("#starPlotLegend");


	mosaic.onZoom(function(pixels,d){
		if (zoomSync){
			mosaicRight.zoomHere(pixels,d);
		} else {
			if (timeSync && mosaicRight.pStartPoint) {
				mosaicRight.zoomHere(mosaicRight.getPixels(), mosaicRight.getLocation());
			}
		}
	})

	mosaicRight.onZoom(function(pixels,d){
		if (zoomSync){
			mosaic.zoomHere(pixels,d);
		} else {
			if (timeSync && mosaic.pStartPoint) {
				mosaic.zoomHere(mosaic.getPixels(), mosaic.getLocation());
			}
		}
	})


	chooser = new groupsChooserView("#chooserDivContainer");

	chooser.onClick(function(){
		mosaic.updateColor();
		mosaicRight.updateColor();
	})


	timeLine = new timelineView("#leftTimelineDivContainer",sizeData);
	timeLineRight = new timelineView("#rightTimelineDivContainer",sizeDataRight);


	d3.select('.zoomSizeDiv').call(d3.slider()
							.min(1)
							.max(10)
							.value(4)
							.on("slide", function(evt, value) {
						      	mosaic.changeLensSize(value);
						      	mosaicRight.changeLensSize(value);
						    })
  );

  d3.select('.lensSizeDiv').call(d3.slider()
						.min(10)
						.max(70)
						.value(50)
						.on("slide", function(evt, value) {
					      	mosaic.changeLensDivSize(value);
					      	mosaicRight.changeLensDivSize(value);
					    })
  );

  d3.select(".loadingDiv").style("visibility","hidden");
}


function init(){
	parseFromFile("data/Young40_a1/dataCompressed.json","data/Old38_a1/dataCompressed.json",
				        "data/Young40_a1/network_metrics.csv","data/Old38_a1/network_metrics.csv",
				        "data/Young40_a1/pixelsGreyValue_f100.txt","data/Old38_a1/pixelsGreyValue_f100.txt",
								initWithData);
}


function changeLeftData(data,sizeData,netData,grayData){

	var r = 130;
	var c = 172;
  var min, span;

	if (timeSync) {
		min = timeStart;
		span = timeSpan;
	} else {
		min = timeLine.minTime;
		span = timeLine.span;
	}

	timeLine.changeData(sizeData, min, span);
	mosaic = new mosaicView("#mosaicDivContainerLeft", r, c, data, min, span,
	                        "#swordDivContainerLeft", "#starPlotDivContainerLeft", netData, grayData, imgLeft);

	// var overall = new overallStarPlot("#overallStarPlotDivContainerLeft",netData);
  sword = new swordPlot("#swordDivContainerLeft", data, 1, grayData, min, span);
	star = new starPlot("#starPlotDivContainerLeft", netData, 1);

	mosaic.onZoom(function(pixels,d){
		if (zoomSync){
			mosaicRight.zoomHere(pixels,d);
		} else {
			if (timeSync && mosaicRight.pStartPoint) {
				mosaicRight.zoomHere(mosaicRight.getPixels(), mosaicRight.getLocation());
			}
		}
	})

	// d3.select("#overallStarPlotDivContainerLeft").style("visibility","hidden");
	// d3.select("#overallStarPlotDivContainerRight").style("visibility","hidden");

	d3.select(".loadingDiv").style("visibility","hidden");
}


function changeRightData(data,sizeData,netData,grayData){

	var r = 130;
	var c = 172;
	var min, span;

	if (timeSync) {
		min = timeStart;
		span = timeSpan;
	} else {
		min = timeLineRight.minTime;
		span = timeLineRight.span;
	}

	timeLineRight.changeData(sizeData, min, span);
	mosaicRight = new mosaicView("#mosaicDivContainerRight", r, c, data, min, span,
	                             "#swordDivContainerRight", "#starPlotDivContainerRight", netData, grayData, imgRight);

	// var overall = new overallStarPlot("#overallStarPlotDivContainerRight",netData);
	swordRight = new swordPlot("#swordDivContainerRight",data,1,grayData, min, span);
	starRight = new starPlot("#starPlotDivContainerRight",netData,1);

  mosaicRight.onZoom(function(pixels,d){
		if (zoomSync){
			mosaic.zoomHere(pixels,d);
		} else {
			if (timeSync && mosaic.pStartPoint) {
				mosaic.zoomHere(mosaic.getPixels(), mosaic.getLocation());
			}
		}
	})

	// d3.select("#overallStarPlotDivContainerRight").style("visibility","hidden");
	// d3.select("#overallStarPlotDivContainerLeft").style("visibility","hidden");

	d3.select(".loadingDiv").style("visibility","hidden");
}


function changeLeftMosaicData(){
	var x = document.getElementById("dataOptionListLeft");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	var pixUrl = "data/" + value + "/pixelsGreyValue_f100.txt";

	imgLeft = value;

	d3.select(".loadingDiv").style("visibility","visible");

	parseFromSingleFile(url,netUrl,pixUrl,changeLeftData);
}


function changeRightMosaicData(){
	var x = document.getElementById("dataOptionListRight");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	var pixUrl = "data/" + value + "/pixelsGreyValue_f100.txt";

	imgRight = value;

	d3.select(".loadingDiv").style("visibility","visible");

	parseFromSingleFile(url,netUrl,pixUrl,changeRightData);
}


function changeAction(act) {
	mosaic.changeAction(act);
	mosaicRight.changeAction(act);

	viewAction = act;
	d3.select("#mosaicDivContainerLeft").select(".selectedLens").remove();
	d3.select("#mosaicDivContainerRight").select(".selectedLens").remove();

	if (act === "sword") {
	  initAction = null;
    mosaic.pStartPoint = null;
	  mosaicRight.pStartPoint = null;
	}
}


function drawMosaic(val){
	if (val) {
		viewAction = "zoom";
	} else {
		viewAction = null;
		initAction = null;
		d3.select("#mosaicDivContainerLeft").select(".selectedLens").remove();
		d3.select("#mosaicDivContainerRight").select(".selectedLens").remove();
	}

	mosaic.changeAction(viewAction);
	mosaicRight.changeAction(viewAction);
}


function changeTimeChain(val){
	timeSync = val;
}


function changeZoomChain(val){
	zoomSync = val;

	if (!zoomSync) {
		pStartPointSharedPre = pStartPointShared;
	}
}


function starPlotLegendView(where){
	var container = d3.select(where);
	var that=this;

	var w =200;
	var h=200;

	var svg = container.append("svg")
	  .attr("class","mosaicSvg")
	  .attr("viewBox","0 0 " + w + " " + h);

	svg.append("text")
		   .attr("transform", "translate(" + 4 + "," + 10 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("Node Attributes:");

    svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 30 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("0 - Observed");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 48 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("1 - Time span");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 66 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("2 - Switching");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 84 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("3 - Absence");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 102 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("4 - Visiting");
    svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 120 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("5 - Homing");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 138 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("6 - Avg group size");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 156 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("7 - Avg community size");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 174 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("8 - Avg community stay");
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 192 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 14)
		   .style("fill", "black")
		   .text("9 - Max community stay");
}
