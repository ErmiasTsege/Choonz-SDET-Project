/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.2500422721531, "KoPercent": 0.7499577278469052};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5265308876401246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Delete Album-0"], "isController": false}, {"data": [0.5723643169058016, 500, 1500, "Delete Album-1"], "isController": false}, {"data": [0.16547099189020587, 500, 1500, "Delete Album-2"], "isController": false}, {"data": [0.05038051750380518, 500, 1500, "Upadate Album-7"], "isController": false}, {"data": [0.007762557077625571, 500, 1500, "Upadate Album-6"], "isController": false}, {"data": [0.3872146118721461, 500, 1500, "Upadate Album-8"], "isController": false}, {"data": [0.9698630136986301, 500, 1500, "Upadate Album-3"], "isController": false}, {"data": [0.0060882800608828, 500, 1500, "Upadate Album-2"], "isController": false}, {"data": [0.9878234398782344, 500, 1500, "Upadate Album-5"], "isController": false}, {"data": [0.9863013698630136, 500, 1500, "Upadate Album-4"], "isController": false}, {"data": [0.06468797564687975, 500, 1500, "Upadate Album-1"], "isController": false}, {"data": [0.9828006088280061, 500, 1500, "Upadate Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album"], "isController": false}, {"data": [4.678727386150967E-4, 500, 1500, "Delete Album"], "isController": false}, {"data": [0.001234949058351343, 500, 1500, "CreateAlbum"], "isController": false}, {"data": [0.0, 500, 1500, "Album Transaction Controller"], "isController": true}, {"data": [0.14649583204692807, 500, 1500, "CreateAlbum-3"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-3"], "isController": false}, {"data": [0.04445816610064835, 500, 1500, "CreateAlbum-2"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-4"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-5"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-5"], "isController": false}, {"data": [0.9992281568385304, 500, 1500, "CreateAlbum-4"], "isController": false}, {"data": [0.4775421085464754, 500, 1500, "Delete Album-6"], "isController": false}, {"data": [0.3050324174127817, 500, 1500, "CreateAlbum-7"], "isController": false}, {"data": [0.4631940112289457, 500, 1500, "Delete Album-7"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-6"], "isController": false}, {"data": [0.38661883967560823, 500, 1500, "Delete Album-8"], "isController": false}, {"data": [0.39857980858289593, 500, 1500, "CreateAlbum-9"], "isController": false}, {"data": [0.4612534732942266, 500, 1500, "CreateAlbum-8"], "isController": false}, {"data": [0.9996912627354122, 500, 1500, "CreateAlbum-1"], "isController": false}, {"data": [0.9992281568385304, 500, 1500, "CreateAlbum-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100539, 754, 0.7499577278469052, 1926.9081848834696, 0, 51080, 705.5, 5549.800000000003, 10158.650000000005, 16374.980000000003, 98.30146211924182, 7005.9100764034065, 26.481638995680324], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Album-0", 3206, 0, 0.0, 5.338116032439166, 2, 493, 4.0, 6.0, 9.0, 29.929999999999836, 3.293508521413969, 10.912963294099217, 0.42133751592307617], "isController": false}, {"data": ["Delete Album-1", 3206, 0, 0.0, 778.7910168434187, 123, 10442, 649.5, 1068.0, 1867.199999999997, 3308.0299999999884, 3.2901454704056237, 17.22506822934038, 0.8643057925186649], "isController": false}, {"data": ["Delete Album-2", 3206, 0, 0.0, 2166.2301933874023, 158, 10490, 1881.5, 3571.9000000000005, 4344.299999999999, 6230.009999999991, 3.2788092379376432, 516.9214650849259, 0.5283237541598742], "isController": false}, {"data": ["Upadate Album-7", 3285, 0, 0.0, 2490.027092846273, 203, 17666, 2083.0, 4169.200000000001, 5070.799999999996, 7486.819999999992, 3.293242987196954, 71.37590878249509, 0.5177852743542086], "isController": false}, {"data": ["Upadate Album-6", 3285, 4, 0.121765601217656, 3610.8133942161335, 1033, 24324, 3081.0, 5435.4, 7008.199999999993, 12429.439999999995, 3.2856144098946505, 233.48971531113818, 0.4518628186595893], "isController": false}, {"data": ["Upadate Album-8", 3285, 0, 0.0, 1282.0824961948242, 170, 11006, 953.0, 2294.4000000000005, 2886.7999999999993, 5059.939999999984, 3.306465574509717, 197.51821894143026, 0.5263221568799648], "isController": false}, {"data": ["Upadate Album-3", 3285, 0, 0.0, 201.72298325722954, 2, 7565, 6.0, 19.0, 50.099999999999454, 6655.28, 3.2757558170841885, 123.10635850473713, 0.42546437858612995], "isController": false}, {"data": ["Upadate Album-2", 3285, 0, 0.0, 4151.878538812804, 542, 20933, 3815.0, 5863.4, 7162.299999999998, 10087.079999999998, 3.2632634024761065, 514.4704570124029, 0.5258188099692945], "isController": false}, {"data": ["Upadate Album-5", 3285, 0, 0.0, 25.317808219178122, 1, 2029, 3.0, 7.0, 15.0, 850.1599999999944, 3.2991036681814756, 4.011117252818298, 0.41238795852268445], "isController": false}, {"data": ["Upadate Album-4", 3285, 0, 0.0, 33.97321156773226, 1, 6044, 3.0, 8.0, 18.0, 1044.1399999999999, 3.279274386920437, 9.917883570598235, 0.40990929836505463], "isController": false}, {"data": ["Upadate Album-1", 3285, 1, 0.030441400304414, 2247.6550989345446, 558, 21100, 1957.0, 3266.8, 4254.7, 7310.079999999997, 3.240613319364662, 16.968563037389377, 0.8511590572059501], "isController": false}, {"data": ["Upadate Album-0", 3285, 0, 0.0, 45.80608828006084, 3, 3568, 4.0, 8.0, 16.699999999999818, 1770.3199999999888, 3.2549406233434235, 10.785169467777575, 0.4164035367753794], "isController": false}, {"data": ["Upadate Album", 3285, 5, 0.15220700152207, 14116.741856925424, 8260, 38780, 13148.0, 18652.0, 22086.899999999994, 29404.89999999999, 3.211890938458801, 1157.8893912085607, 4.4501805756740085], "isController": false}, {"data": ["Delete Album", 3206, 90, 2.8072364316905802, 6621.837492202116, 1043, 51080, 5943.0, 9812.100000000006, 11665.949999999999, 17461.339999999993, 3.2627456727402993, 1170.627152912199, 4.508852533576462], "isController": false}, {"data": ["CreateAlbum", 3239, 282, 8.706390861376969, 9055.85581969745, 832, 36193, 8002.0, 13755.0, 15764.0, 19387.399999999998, 3.2889626313325735, 1267.4299542157414, 4.630640941542979], "isController": false}, {"data": ["Album Transaction Controller", 3208, 374, 11.658354114713218, 29733.915211970056, 17602, 76666, 28254.5, 39166.799999999996, 43329.69999999999, 51428.149999999994, 3.1530486678172807, 3482.17454004577, 13.162233592942203], "isController": true}, {"data": ["CreateAlbum-3", 3239, 0, 0.0, 2191.931769064526, 157, 9961, 1943.0, 3508.0, 4189.0, 6119.799999999997, 3.301325728426973, 520.4715507662918, 0.5319518996000493], "isController": false}, {"data": ["Delete Album-3", 3206, 0, 0.0, 7.709606986899582, 2, 209, 5.0, 13.0, 21.0, 53.929999999999836, 3.2797551334408173, 123.25665703144821, 0.4259838210426061], "isController": false}, {"data": ["CreateAlbum-2", 3239, 0, 0.0, 2564.740969435009, 195, 22464, 2174.0, 4164.0, 5168.0, 7692.1999999999925, 3.307018761894649, 103.74493320809918, 0.5425577656233409], "isController": false}, {"data": ["Delete Album-4", 3206, 0, 0.0, 4.351840299438559, 1, 260, 3.0, 6.0, 11.0, 30.929999999999836, 3.2798255943021473, 10.271875664967759, 0.4099781992877684], "isController": false}, {"data": ["CreateAlbum-5", 3239, 0, 0.0, 4.436245754862618, 1, 278, 3.0, 6.0, 10.0, 36.59999999999991, 3.301978638573513, 4.014612700218772, 0.41274732982168905], "isController": false}, {"data": ["Delete Album-5", 3206, 0, 0.0, 3.865876481596998, 1, 241, 3.0, 6.0, 9.0, 27.929999999999836, 3.2798021070119834, 3.987650022685468, 0.4099752633764979], "isController": false}, {"data": ["CreateAlbum-4", 3239, 0, 0.0, 10.12411238036432, 2, 852, 5.0, 15.0, 26.0, 94.19999999999936, 3.3019113163096474, 124.08930975150798, 0.42886152838787417], "isController": false}, {"data": ["Delete Album-6", 3206, 90, 2.8072364316905802, 1321.024953212725, 0, 42679, 757.0, 2835.000000000002, 3911.5499999999975, 9536.719999999983, 3.2724938015537712, 226.5963718355771, 0.4380980023727111], "isController": false}, {"data": ["CreateAlbum-7", 3239, 282, 8.706390861376969, 1925.1509725223843, 2, 21688, 1042.0, 4095.0, 5655.0, 10166.0, 3.2927106968876307, 214.60136258269898, 0.4139168507316344], "isController": false}, {"data": ["Delete Album-7", 3206, 0, 0.0, 1045.311291328758, 154, 9561, 799.0, 1854.0, 2599.249999999998, 4706.019999999998, 3.2713985279727025, 70.90246588296638, 0.5143507451207081], "isController": false}, {"data": ["CreateAlbum-6", 3239, 0, 0.0, 4.013893176906448, 1, 151, 3.0, 6.0, 9.0, 28.59999999999991, 3.30197527239512, 15.54572537911804, 0.42886983518413174], "isController": false}, {"data": ["Delete Album-8", 3206, 0, 0.0, 1283.3711790393036, 246, 21277, 984.0, 2289.9000000000005, 2863.249999999998, 4693.429999999991, 3.2676574280091035, 195.19992066235295, 0.5201446882475429], "isController": false}, {"data": ["CreateAlbum-9", 3239, 0, 0.0, 1268.679839456621, 77, 19114, 920.0, 2334.0, 3115.0, 5410.199999999997, 3.2916633214803643, 196.63387108473466, 0.5239659388684564], "isController": false}, {"data": ["CreateAlbum-8", 3239, 0, 0.0, 1065.8984254399497, 61, 11952, 796.0, 1852.0, 2695.0, 4941.5999999999985, 3.2922153692282046, 71.35363853356911, 0.5176237055134189], "isController": false}, {"data": ["CreateAlbum-1", 3239, 0, 0.0, 3.8039518369867245, 1, 647, 3.0, 4.0, 6.0, 20.0, 3.3265070956583895, 5.090465448141305, 0.4223104711285065], "isController": false}, {"data": ["CreateAlbum-0", 3239, 0, 0.0, 7.297622723062664, 2, 1086, 4.0, 7.0, 11.0, 45.0, 3.3264695159211466, 15.674038490546417, 0.4288027110367103], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 51,080 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1, 0.13262599469496023, 9.946388963486806E-4], "isController": false}, {"data": ["The operation lasted too long: It took 42,679 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1, 0.13262599469496023, 9.946388963486806E-4], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 364, 48.275862068965516, 0.36204855827091975], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, 0.13262599469496023, 9.946388963486806E-4], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, 1.3262599469496021, 0.009946388963486806], "isController": false}, {"data": ["Assertion failed", 377, 50.0, 0.3749788639234526], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100539, 754, "Assertion failed", 377, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 364, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, "The operation lasted too long: It took 51,080 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1, "The operation lasted too long: It took 42,679 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album-6", 3285, 4, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album-1", 3285, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album", 3285, 5, "Assertion failed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Delete Album", 3206, 90, "Assertion failed", 89, "The operation lasted too long: It took 51,080 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum", 3239, 282, "Assertion failed", 282, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Album-6", 3206, 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 86, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "The operation lasted too long: It took 42,679 milliseconds, but should not have lasted longer than 40,000 milliseconds.", 1, null, null, null, null], "isController": false}, {"data": ["CreateAlbum-7", 3239, 282, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 278, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
