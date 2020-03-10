console.log(`Got ${datastore.length} user entries.`)
let dataset = [];
function datasetBuilder() {
	for (j=0;j<datastore.length;j++) {
		let json = datastore[j];
		luserdata = []
		for (i=json.data.children.length-1;i>=0;i--){
			let curr = json.data.children[i].data;
			luserdata.push(dateParser(curr.created_utc * 1000));
		}
		let currColor = urandomColor(colorset);
		dataset.push({
			label:datastore[j].data.children[0].data.author,
			data:luserdata,
			fill:false,
			pointBorderColor: currColor,
			pointBackgroundColor: currColor,
			//borderColor: currColor, // turn this on to see lines
			backgroundColor: currColor
		})
	}
	chartStuff(dataset)
	console.log(dataset)
}

function getColor() {
	let hex = '0123456789ABCDEF';
	let color = '#';
	for (i=0;i<6;i++) {
		color += hex[Math.floor(Math.random() * 16)];
	}
	return color;
}
let colorset = ["#235ebc", "#ba5121", "#820909","#80961e","#1e996a"]
function urandomColor(colorset) {
	let i = Math.floor(Math.random() * colorset.length)
	console.log("i is " + i)
	let nc = colorset.splice(i, 1);
	console.log("logging nc " + nc)
	console.log("logging colorset " + colorset)
	return nc.toString();
}
// Parses created_utc value into coordinates for the chart
function dateParser(input) {
	var xval, yval;
	xval = moment.utc(input).format();
	yval = moment.utc(input).format('HH');
    console.log(`Have ${yval} hours`)
	return {x:xval, y:yval};
}

// Chart logic and options
function chartStuff(analyse) {
	let ctx = document.getElementById("myChart");
	let myChart = new Chart(ctx, {
		type: 'scatter',
		data: {
			// datasets[] are arrays of objects;
			// each object has a label and a data[] array
			// the data[] array consists of miny {x,y} objects
			datasets: analyse
		},
		options: {
			//plugins: pluginOpts,
			responsive:true,
			elements:{
				point:{
					radius:6,
					borderWidth:3,
					hoverRadius:7,
				},
				line:{
					fill:false,
					borderWidth:0,
					borderColor:'rgba(0,0,0,0)'
				}
			},
			title:{
				display:true,
				text:"(l)user activity"
			},
			scales: {
				xAxes: [{
					scaleLabel:{
						display:true,
						labelString:"Date posted"
					},
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
							day: 'll'
						}
					}
				}],
				yAxes: [{
					scaleLabel:{
						display:true,
						labelString: "Hour posted"
					},
					ticks: {
						stepSize: 1
					}
				}]
			},
			tooltips: {
				callbacks: {
					title: (tooltipItem, data) => {
						// We're gonna access the original reddit json to pull author, date and other info.
						// dsi is the index of the current dataset in the datasets[] array, which coincides with the index of the original datastore[] array
						// subi is the sub-index of the current item in the dataset, but since we iterated over the original array in reverse, we have to figure
						// out which "old" index this new one belongs to, hence orig.length - 1 - subi
						let dsi = tooltipItem[0].datasetIndex, subi = tooltipItem[0].index, orig = datastore[dsi].data.children 
						return data.datasets[dsi].label + ' : ' + moment.utc(orig[orig.length - 1 - subi].data.created_utc * 1000).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')
					},
					label: (tooltipItem, data) => {
						// For some reason tooltipItem is not an array for labels like it is for everything else :-/
						let dsi = tooltipItem.datasetIndex, subi = tooltipItem.index, orig = datastore[dsi].data.children, item = orig[orig.length - 1 - subi].data;
						// Comment and post text is stored at different keys, to avoid errors, check which one it is before processing it
						// label accepts an array of strings and treats them as individual lines, so we slit long comments with .match() 
						if (item.body)
							return item.body.match(/.{1,60}/g)
						else if (item.selftext)
							return item.selftext.match(/.{1,60}/g)
						else
							return;
					},
					footer: (tooltipItem, data) => {
						let dsi = tooltipItem[0].datasetIndex, subi = tooltipItem[0].index, orig = datastore[dsi].data.children 
						return 'thing id: ' + orig[orig.length - 1 - subi].data.id
					},
				}
			},
			plugins: {
				zoom: {
					// Container for pan options
					pan: {
						// Boolean to enable panning
						enabled: true,
						// Panning directions. Remove the appropriate direction to disable 
						// Eg. 'y' would only allow panning in the y direction
						mode: 'xy'
					},
					// Container for zoom options
					zoom: {
						// Boolean to enable zooming
						enabled: true,
						// Zooming directions. Remove the appropriate direction to disable 
						// Eg. 'y' would only allow zooming in the y direction
						mode: 'xy',
					}
				}
			}
		}
	});
}

datasetBuilder();