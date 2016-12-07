function neighborsPlot(where,data,pixel,min,span,num,prox) {

	console.log(min +", "+span+", "+num+","+prox )

	this.container = d3.select(where);
	this.container.selectAll("*").remove();

	var r = 500;

	this.svg = this.container.append("svg")
							.attr("class","mosaicSvg")
							.attr("viewBox", -r + " " + -r + " " + 2*r + " " + 2*r);

	var rows = 130;
	var c = 172;
	var maxDist = rows*rows + c*c;
	
	var pR = Math.floor(pixel / c);
	var pC = Math.floor(pixel % c);

	var x = d3.scale.linear().range([-r,r]).domain([pC-prox,pC+prox+1]);
	var y = d3.scale.linear().range([-r,r]).domain([pR-prox,pR+prox+1]);

	var size = x(pC)-x(pC-1);

	var sortedNeigh = []

	

	

	var center = {r:pR,c:pC};


	this.sim = function(o1,o2) {
		var n1 = o1.r * c + o1.c;
		var n2 = o2.r * c + o2.c;

		var res = 0;

		//Tie breaker with dist
		var dist = (o1.c - o2.c) * (o1.c - o2.c) + (o1.r - o2.r) * (o1.r - o2.r);
		res += 1 / dist ;

		//console.log("here");
		for (var i=0;i<span;i++){
			//console.log(data[i][n1][0]+ " , "+ data[i][n2][0])
			if (data[min+i][n1][0] == data[min+i][n2][0]){
				res+=1;
			}
		}

		return res;

	}

	var sim = this.sim;

	for (var i = pR - prox;i<=pR+prox;i++){
		for (var j = pC - prox;j<=pC+prox;j++){
			if (i != pR && j!=pC && i>=0 && i<rows && j>=0 && j<c){
				var curr = {r:i,c:j};
				
				curr.sim = sim(curr,center);
				if (sortedNeigh.length < num ){
					sortedNeigh = insertSorted(curr,sortedNeigh,false);

				} else if (sortedNeigh[0].sim < curr.sim){

					sortedNeigh = insertSorted(curr,sortedNeigh,true);
				}
			}

		}
	}

	this.svg.append("rect").attr("x",x(pC))
							.attr("y",y(pR))
							.attr("width",size)
							.attr("height",size)
							.style("fill","transparent")
							.style("stroke","red")
							.style("stroke-width","5");
	sortedNeigh.push(center);

	for (var j=0;j<sortedNeigh.length;j++){
		var pixNum = sortedNeigh[j].r * c + sortedNeigh[j].c; 
		var pixR = sortedNeigh[j].r;
		var pixC = sortedNeigh[j].c;

		var startX = x(pixC);
		var startY = y(pixR);

		var l = Math.ceil(Math.sqrt(span));
		var squareL = size/l;

		var pixData = []
		for (var i=0;i<span;i++){
			pixData.push({ "x":startX,"y":startY, "color":data[min+i][pixNum][0]});
		}

		this.svg.selectAll(".knn"+ j)
							.data(pixData)
							.enter()
							.append("rect")
							.attr("class",".knn"+ j)
							.attr("x",function(d,i){
									return d.x + (i % l * squareL);
							})
							.attr("y",function(d,i){
								return d.y + Math.floor(i / l)*squareL;
							})
							.attr("width",squareL)
							.attr("height",squareL)
							.style("fill",function(d){
								return colorScale[d.color];
							});




	}

	
								
}




function insertSorted(el,arr,elimFirst){
	var tmp = arr;
	arr = [];

	var j=elimFirst ? 1: 0;
	var used = false;
	while (j < tmp.length){
		if (tmp[j].sim < el.sim || used){
			arr.push(tmp[j]);
			j +=1;
		} else{
			arr.push(el);
			used = true;
		}
	}

	if (!used){
		arr.push(el);
	}

	return arr;
}