var activeColorScale = [	"#cccccc",
						"#1f78b4",
						"#ff7f00",
						"#33a02c",
						"#e31a1c",
						"#6a3d9a",
						"#a6cee3",
						"#fdbf6f",
						"#b2df8a",
						"#fb9a99",
						"#cab2d6"];

var colorScale = [	"#cccccc",
						"#1f78b4",
						"#ff7f00",
						"#33a02c",
						"#e31a1c",
						"#6a3d9a",
						"#a6cee3",
						"#fdbf6f",
						"#b2df8a",
						"#fb9a99",
						"#cab2d6"];


function groupsChooserView(where){
	var container = d3.select(where);
	var that=this;

	var w =100;
	var h=1000;
	this.svgW = w;
	this.svgH = h;

	var padding = 10;
	var len = activeColorScale.length;

	var svg = container.append("svg")
	  .attr("class","mosaicSvg")
		.attr("viewBox","0 0 " + (w + padding * 2)+ " " + (h + padding * (2 + len)));

	this.onClickFun = function(){};

	// Show the color circles
	this.update = function(){
		svg.selectAll(".colorChooser")
		  .style("fill",function(d){
			  return colorScale[d];
			});
		this.onClickFun();
	}

	for (var i = 1; i<len;i++){
		svg.append("circle")
		  .attr("class","colorChooser")
			.datum(i)
			.style("fill",function(d){
				return colorScale[d];
			})
			.style("stroke",function(d){
				return activeColorScale[d];
			})
			/*.attr("cx", function(d){
				return d * w / len + padding * d;
			})
			.attr("cy", h/2)
  		.attr("r", Math.min(h/2, w / len/2))*/
			.attr("cx", w/2 + padding)
			.attr("cy", function(d) {
				return d * h / len + padding * d;
			})
			.attr("r", Math.min(h/ len/2, w /2))
			.on("mouseup",function(j){
				if (colorScale[j]==activeColorScale[j]) {
					colorScale[j] = colorScale[0];
				} else {
					colorScale[j]=activeColorScale[j];
				}
				that.update();
			});
	}

	this.onClick = function(fun){
		this.onClickFun = fun;
	}

}
