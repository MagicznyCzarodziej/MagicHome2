/*
var data = [

];

 var name = "";
 function getMin() {
   var min = 999;
   for(i in data){
     if(data[i][1] < min) min = data[i][1];
   }
   return min;
 }
 function getMax() {
   var max = -999;
   for(i in data){
     if(data[i][1] > max) max = data[i][1];
   }
   return max;
 }
 var options = {
   series:{
     curvedLines:{
       apply: true,
       active: true,
       monotonicFit: true,
     }
   },
   lines:{
       fill: 0.6,
       steps: false
   },
   xaxis:{
     mode: "time",
     timezone: "browser",
     timeformat: "%H:%M",
     tickSize: [2, "hour"],
     tickColor: '#32383E',
     font: {color: '#aab5bd', size: 20}
   },
   yaxis:{
     tickSize: 0.5,
     tickDecimals: 1,
     tickColor: '#32383E',
     font: {color: '#aab5bd', size: 20}
   },
   selection: {
     mode: "x"
   },
   crosshair: {
    mode: "x"
  },
   grid:{
     backgroundColor: "#272b30",
     hoverable: true,
     labelMargin: 10
   },
   colors: ["#1977c3"]//2ecc71
 };
 var TOTAL_POINTS = 1440,
     UPDATE_TIME = 60000;

 function updateChart() {
   minimum = getMin()-0.3;
   options.yaxis.min = minimum;
   plot = $.plot($("#chart"), [data], options);
 }
 $(function() {

   updateChart();
   //Zooming
   $("#chart").bind("plotselected", function (event, ranges) {
     $.each(plot.getXAxes(), function(_, axis) {
       var opts = axis.options;
       opts.min = ranges.xaxis.from;
       opts.max = ranges.xaxis.to;
     });
     plot.setupGrid();
     plot.draw();
     plot.clearSelection();
   });
   //Hovering
   $("#chart").bind("plothover", function (event, pos, item) {
     if(item){
       var y = item.datapoint[1].toFixed(1);
       $("#hovered-temp").html(y + "&#176;C").css({top: item.pageY-10});
     }else{
       $("#hovered-temp").html("");
     }
   });
 });
*/
