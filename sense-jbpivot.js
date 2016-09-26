define( [
		'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js',
		'https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js',
		'./src/jbpivot',//'http://www.jbpivot.org/js/vendor/jbpivot.js',
		'qlik', 
		'css!./sense-jbpivot.css'

],
/**
* @owner Deepak Vadithala (AKA: DV), @dvadithala, GitHub: iamdv
*/

function (jqueryui, jquery, jbPivot, qlik, cssContent) {
//function (jqueryui, jquery, qlik, jbPivot, jb2, jb3, jb4, jb5, jb6, jb7, jbpivotcss, cssContent) {

var app = qlik.currApp(this);

var myCustomObj = {
	myObjLockAllOrFewFields: {
		type: "boolean",
		component: "radiobuttons",
		label: "Select One: ",
		ref: "props.myCustomObj.myObjLockAllOrFewFields",
		options: [{value: 1, label: "Lock/Unlock All Fields"}, {value: 2, label: "Lock/Unlock by User Selections"}],
		defaultValue: 2 
	},		
	myObjSwitchIncludeClearField: {
		type: "boolean",
		component: "switch",
		label: "Enable Clear Field Selections",
		ref: "props.myCustomObj.myObjSwitchIncludeClearField",
		options: [{value: true, label: "Enabled"}, {value: false, label: "Not Enabled"}],
		defaultValue: false
	},	
	myObjLabel: {
		ref:"props.myCustomObj.myObjLabel",
		label:"ios Toggle Label",
		type:"string",
	},
	myObjLabelBold:{
		component:"checkbox",
		ref:"props.myCustomObj.myObjLabelBold",
		label:"Bold",
		type:"boolean"
	},
	myObjLabelItalic:{
		component:"checkbox",
		ref:"props.myCustomObj.myObjLabelItalic",
		label:"Italic",
		type:"boolean"
	},
	myObjLockOptionsText: {
		component: "text",
		label:"Specify Field Manager Name only if you have opted - 'Lock/Unlock by User Selections'"
	},	
	myObjLockFieldName: {
		ref:"props.myCustomObj.myObjLockFieldName",
		label:"Data Island Name (Ex: $Field)",
		type:"string",
	}
};

var myAppearenceSection = {
	uses:"settings",
	items: {
		myListItems: {
			label: "Variable Properties",
			items: {
					myObjLockAllOrFewFields: myCustomObj.myObjLockAllOrFewFields,
					myObjSwitchIncludeClearField: myCustomObj.myObjSwitchIncludeClearField,
					myObjLabel: myCustomObj.myObjLabel,
					myObjLabelBold: myCustomObj.myObjLabelBold,
					myObjLabelItalic: myCustomObj.myObjLabelItalic,
					myObjLockOptionsText: myCustomObj.myObjLockOptionsText,
					myObjLockFieldName: myCustomObj.myObjLockFieldName
			}			
		}		
	}
};

	return {
		definition:{
			type: "items",
			component:"accordion",
			items:{
				appearance: myAppearenceSection
			}
		},
		paint: function ($element, layout) {

			/* ==========================================================*/
			/* Creating custom object which holds the configuration
			settings */

			var myObjLockUnlockProps ={
				option: layout.props.myCustomObj.myObjLockAllOrFewFields,
				clearfield: layout.props.myCustomObj.myObjSwitchIncludeClearField,
				label: layout.props.myCustomObj.myObjLabel,
				bold: layout.props.myCustomObj.myObjLabelBold,
				italic: layout.props.myCustomObj.myObjLabelItalic,
				fieldname: layout.props.myCustomObj.myObjLockFieldName
			};

			/* ==========================================================*/			
			
			/* ==========================================================*/
			/* This block of code generate relevant HTML and renders  */

            var myDevMessage = '############# Hi there, this extension was developed by Deepak Vadithala. Follow me @dvadithala #############';
            var myHTML = '<div id="pivot1" style="overflow-y:scroll; height:400px;"></div>';
			
            
            console.log(myDevMessage);
			/* ==========================================================*/            


			
				/* ==========================================================*/
				app.createCube({
					qDimensions : [{
						qDef : {
							qFieldDefs : ["QVApp"]
						}
					}, {
						qDef : {
							qFieldDefs : ["FullName"]
						}
					}, {
						qDef :{
							qFieldDefs: ["ClientPort"]
						}					
					}],
					qMeasures : [{
						qDef : {
							qDef : "SUM(Selections)"
						}
					}],
					qInitialDataFetch : [{
						qTop : 0,
						qLeft : 0,
						qHeight : 100,
						qWidth : 5
					}]
				}, function(reply) {
					var myArrOutputObj = [];
					var str = "";
					var myArrDataMatrix = reply.qHyperCube.qDataPages[0].qMatrix;
					var myArrDataRow = [];
					var myObjOutputBuilder = {};
					var myObjDataRow = {};
					var myArrFieldName = ['QVApp', 'FullName', 'ClientPort', 'TotalSelections'];				

					/* ==========================================================*/
					for (var i = 0; i < myArrDataMatrix.length; i++){
						myArrDataRow = myArrDataMatrix[i];
						myObjOutputBuilder = {};
						
						for (var j = 0; j < myArrDataRow.length; j++){		
							myObjDataRow = myArrDataRow[j];					

							for(var myObjProp in myObjDataRow){
								if (myObjProp === 'qText'){
									myObjOutputBuilder[myArrFieldName[j]] = myObjDataRow[myObjProp];
								}
							}

						}
						myArrOutputObj.push(myObjOutputBuilder);

					}
					/* ==========================================================*/	

					var myOutputTable = app.createTable(["FullName", "QVApp", "ClientPort"], ["SUM(Selections)"],{rows:10});
					var myOutputRows = [];
					myOutputRows = myOutputTable.rows;
					console.log(myOutputTable);
					

					//console.log(Array.from(myArrOutputObj));

					$element.html(myHTML);

				/* ==========================================================*/	
		          $("#pivot1").jbPivot({
		             fields: {
		               FullName : { field: myArrFieldName[1], sort: "asc", showAll:true, agregateType: "sum"},
		               ClientPort : { field: 'ClientPort', sort: "asc", showAll:true, agregateType: "sum"},
		               QVApp : { field: 'QVApp', sort: "asc", age: "QVApp", showAll:true, agregateType: "sum"},
		               TotalSelections: { field: 'TotalSelections', agregateType: "sum", groupType:"none" },
		            },
		            xfields: [ "QVApp"],
		            yfields: [ myArrFieldName[1] ],
		            zfields: [ "TotalSelections"],
		            data: myArrOutputObj
		          });
				/* ==========================================================*/	

				});
				/* ==========================================================*/			

		}
	};

} );




