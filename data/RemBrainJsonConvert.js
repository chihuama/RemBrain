var fs = require('fs');
var path = require('path');

var folders = fs.readdirSync(".").filter((file) => {
	return fs.statSync(path.join(".", file)).isDirectory();
});

folders.forEach((folder) => {
	console.log("Processing:", folder);

	var permPath = "gColorTop10_f100.txt";
	var permSizePath = "gSizeTop10_f100.txt";
	var tempPath = "iColorTop10_f100.txt";
	var tempSizePath = "iSizeTop10_f100.txt";
	var degPath = "nodeDegree_f100.txt";

	var numRows = 130;
	var numCols = 172;
	var numPix = numRows * numCols;

	var timesteps = 101;

	var fData = {
		rows: numRows,
		cols: numCols,
		times: timesteps
	};

	var aData = new Array(timesteps);

	var fileStats = {
		"timesteps": new Array(timesteps)
	};

	// Read text files

	var perm;
	var permSize;
	var temp;
	var tempSize;
	var deg;

	try {
		perm = fs.readFileSync(path.join(folder, permPath));
		permSize = fs.readFileSync(path.join(folder, permSizePath));
		temp = fs.readFileSync(path.join(folder, tempPath));
		tempSize = fs.readFileSync(path.join(folder, tempSizePath));
		deg = fs.readFileSync(path.join(folder, degPath));
	} catch (err) {
		console.log(err);
	}

	console.log("Files Read");

	// convert files to json format

	var permTimesteps = perm.toString().split("\n"); // split into timesteps
	var permValues = permTimesteps.map((el) => el.split("\t")).map((t) => t.map((val) => Number(val))); // split each timestep into array of values

	var permSizeTimesteps = permSize.toString().split("\n");
	var permSizeValues = permSizeTimesteps.map((el) => el.split("\t")).map((t) => t.map((val) => Number(val)));

	var tempTimesteps = temp.toString().split("\n");
	var tempValues = tempTimesteps.map((el) => el.split("\t")).map((t) => t.map((val) => Number(val)));

	var tempSizeTimesteps = tempSize.toString().split("\n");
	var tempSizeValues = tempSizeTimesteps.map((el) => el.split("\t")).map((t) => t.map((val) => Number(val)));

	var degTimesteps = deg.toString().split("\n");
	var degValues = degTimesteps.map((el) => el.split("\t")).map((t) => t.map((val) => Number(val)));

	for (var i = 0; i < timesteps; i++) {
		fData[i.toString()] = {};
		aData[i] = {};
		
		fData[i.toString()].size = [permSizeValues[i][10], tempSizeValues[i][10]];

		fileStats.timesteps[i] = {
			perm: {},
			temp: {},
			deg: {},
			active: 0
		};

		fileStats.timesteps[i].perm = {
			"size": permValues[i].length,
			"extent": [Number.MAX_VALUE, -Number.MAX_VALUE]
		};
		fileStats.timesteps[i].temp = {
			"size": tempValues[i].length,
			"extent": [Number.MAX_VALUE, -Number.MAX_VALUE]
		};
		fileStats.timesteps[i].deg = {
			"size": degValues[i].length,
			"extent": [Number.MAX_VALUE, -Number.MAX_VALUE]
		};

		for(var j = 0; j < numPix; j++) {
			// update extents
			// perm
			if (permValues[i][j] > fileStats.timesteps[i].perm.extent[1]) {
				fileStats.timesteps[i].perm.extent[1] = permValues[i][j];
			}
			if (permValues[i][j] < fileStats.timesteps[i].perm.extent[0]) {
				fileStats.timesteps[i].perm.extent[0] = permValues[i][j];
			}
			// temp
			if (tempValues[i][j] > fileStats.timesteps[i].temp.extent[1]) {
				fileStats.timesteps[i].temp.extent[1] = tempValues[i][j];
			}
			if (tempValues[i][j] < fileStats.timesteps[i].temp.extent[0]) {
				fileStats.timesteps[i].temp.extent[0] = tempValues[i][j];
			}
			// deg
			if (degValues[i][j] > fileStats.timesteps[i].deg.extent[1]) {
				fileStats.timesteps[i].deg.extent[1] = degValues[i][j];
			}
			if (degValues[i][j] < fileStats.timesteps[i].deg.extent[0]) {
				fileStats.timesteps[i].deg.extent[0] = degValues[i][j];
			}

			// check if data has non-zero values
			if (permValues[i][j] || tempValues[i][j] || degValues[i][j]) {
				fData[i.toString()][j.toString()] = [permValues[i][j], tempValues[i][j], degValues[i][j]];
				aData[i][j.toString()] = [permValues[i][j], tempValues[i][j], degValues[i][j]];
				fileStats.timesteps[i].active++;
			}
		}

	}

	// Write json files
	try {
		// fData
		fs.writeFile(path.join(folder, "dataCompressed.json"), JSON.stringify(fData), (err) => {
			if (err) throw err;

			console.log("dataCompressed.json saved.")
		});
		// aData
		// fs.writeFile("Young40_a1/" + "aData.json", JSON.stringify(aData), (err) => {
		// 	if (err) throw err;

		// 	console.log("aData.json saved.")
		// });
		// fileStats
		fs.writeFile(path.join(folder, "fileStats.json"), JSON.stringify(fileStats), (err) => {
			if (err) throw err;

			console.log("fileStats.json saved.")
		});
	} catch (err) {
		console.log(err);
	}
});

