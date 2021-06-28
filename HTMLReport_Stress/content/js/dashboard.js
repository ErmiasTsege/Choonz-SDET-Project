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

    var data = {"OkPercent": 41.342756183745585, "KoPercent": 58.657243816254415};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.384315762139704, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4262295081967213, 500, 1500, "Delete Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album-1"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album-2"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-7"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-6"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-8"], "isController": false}, {"data": [0.9854368932038835, 500, 1500, "Upadate Album-3"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-2"], "isController": false}, {"data": [0.9951456310679612, 500, 1500, "Upadate Album-5"], "isController": false}, {"data": [0.9902912621359223, 500, 1500, "Upadate Album-4"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-1"], "isController": false}, {"data": [0.8533980582524272, 500, 1500, "Upadate Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbum"], "isController": false}, {"data": [0.0, 500, 1500, "Album Transaction Controller"], "isController": true}, {"data": [0.0, 500, 1500, "CreateAlbum-3"], "isController": false}, {"data": [0.9098360655737705, 500, 1500, "Delete Album-3"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbum-2"], "isController": false}, {"data": [0.9672131147540983, 500, 1500, "Delete Album-4"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "CreateAlbum-5"], "isController": false}, {"data": [0.9836065573770492, 500, 1500, "Delete Album-5"], "isController": false}, {"data": [0.9619883040935673, 500, 1500, "CreateAlbum-4"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album-6"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbum-7"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album-7"], "isController": false}, {"data": [0.9941520467836257, 500, 1500, "CreateAlbum-6"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album-8"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbum-9"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbum-8"], "isController": false}, {"data": [0.9678362573099415, 500, 1500, "CreateAlbum-1"], "isController": false}, {"data": [0.7134502923976608, 500, 1500, "CreateAlbum-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7641, 4482, 58.657243816254415, 233.57152205208774, 0, 8015, 3.0, 52.0, 797.6999999999989, 6189.799999999999, 224.96687766818783, 2787.8046564478136, 27.94696746650964], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Album-0", 61, 0, 0.0, 2274.3442622950824, 2, 5181, 3245.0, 4547.8, 4762.099999999999, 5181.0, 3.2414049630692383, 10.7403193747011, 0.41467192398639674], "isController": false}, {"data": ["Delete Album-1", 61, 61, 100.0, 167.31147540983605, 2, 2590, 6.0, 248.0000000000006, 1954.5999999999995, 2590.0, 3.018158428578497, 22.85429731952897, 0.38021722391272084], "isController": false}, {"data": ["Delete Album-2", 61, 61, 100.0, 0.1311475409836066, 0, 1, 0.0, 1.0, 1.0, 1.0, 3.019054689433309, 8.104864591066569, 0.0], "isController": false}, {"data": ["Upadate Album-7", 515, 515, 100.0, 0.24660194174757286, 0, 1, 0.0, 1.0, 1.0, 1.0, 15.764180109584007, 42.18320143905538, 0.0], "isController": false}, {"data": ["Upadate Album-6", 515, 515, 100.0, 0.26407766990291254, 0, 2, 0.0, 1.0, 1.0, 1.0, 15.763215083713384, 42.16522537188944, 0.0], "isController": false}, {"data": ["Upadate Album-8", 515, 515, 100.0, 0.20582524271844665, 0, 4, 0.0, 1.0, 1.0, 1.0, 15.764662666829928, 42.329894937323985, 0.0], "isController": false}, {"data": ["Upadate Album-3", 515, 0, 0.0, 45.92038834951454, 3, 3842, 6.0, 32.80000000000007, 104.19999999999999, 875.0, 15.693085900600298, 589.762719446095, 2.038262133574062], "isController": false}, {"data": ["Upadate Album-2", 515, 515, 100.0, 0.6854368932038841, 0, 70, 0.0, 1.0, 1.0, 19.519999999999925, 15.686871763630826, 42.147908020484316, 0.0], "isController": false}, {"data": ["Upadate Album-5", 515, 0, 0.0, 18.23689320388352, 2, 791, 4.0, 9.0, 19.399999999999977, 554.3199999999963, 15.735761427523833, 19.13185837623747, 1.966970178440479], "isController": false}, {"data": ["Upadate Album-4", 515, 0, 0.0, 26.879611650485423, 2, 1177, 3.0, 11.800000000000068, 54.599999999999966, 758.7999999999988, 15.711278562494279, 47.51741182426248, 1.9639098203117848], "isController": false}, {"data": ["Upadate Album-1", 515, 515, 100.0, 78.46213592233008, 2, 2504, 5.0, 270.80000000000007, 566.3999999999999, 930.2399999999998, 15.294606794963174, 115.87689001618557, 1.9267619888186032], "isController": false}, {"data": ["Upadate Album-0", 515, 0, 0.0, 752.6737864077676, 3, 7458, 9.0, 4780.800000000001, 5976.199999999999, 7028.159999999995, 15.171601119457947, 50.27074472492267, 1.9408981900869053], "isController": false}, {"data": ["Upadate Album", 515, 515, 100.0, 932.0640776699015, 17, 8015, 37.0, 5720.400000000007, 6604.8, 7704.719999999997, 15.162667451788606, 961.8260813061239, 9.609932789268363], "isController": false}, {"data": ["Delete Album", 61, 61, 100.0, 2859.3934426229507, 15, 7162, 3969.0, 6335.2, 6844.0, 7162.0, 2.8418355462380616, 180.5481397769625, 1.8011242866293966], "isController": false}, {"data": ["CreateAlbum", 171, 171, 100.0, 1406.3391812865495, 17, 7361, 30.0, 4933.000000000002, 5950.0, 7263.8, 6.897942718838241, 435.6596977107705, 4.4189945542557485], "isController": false}, {"data": ["Album Transaction Controller", 61, 61, 100.0, 2922.7049180327867, 58, 7215, 4018.0, 6391.4, 6928.2, 7215.0, 3.2848680667743673, 624.5251287358643, 6.268195510231556], "isController": true}, {"data": ["CreateAlbum-3", 171, 171, 100.0, 0.15789473684210534, 0, 1, 0.0, 1.0, 1.0, 1.0, 6.912442396313365, 18.556937644009217, 0.0], "isController": false}, {"data": ["Delete Album-3", 61, 0, 0.0, 218.0327868852459, 4, 3505, 7.0, 712.8000000000011, 1856.3999999999994, 3505.0, 2.9253788605409556, 109.93882293964607, 0.37995643403510454], "isController": false}, {"data": ["CreateAlbum-2", 171, 171, 100.0, 0.29824561403508776, 0, 4, 0.0, 1.0, 1.0, 1.8400000000000034, 6.911883589329022, 18.56905567906225, 0.0], "isController": false}, {"data": ["Delete Album-4", 61, 0, 0.0, 126.47540983606557, 2, 4102, 6.0, 362.6000000000001, 539.5999999999999, 4102.0, 2.84554741801558, 8.91178766560153, 0.3556934272519475], "isController": false}, {"data": ["CreateAlbum-5", 171, 0, 0.0, 42.63157894736841, 2, 2520, 4.0, 23.800000000000068, 170.0000000000003, 1286.640000000002, 6.922236165647897, 8.416195338116829, 0.8652795207059871], "isController": false}, {"data": ["Delete Album-5", 61, 0, 0.0, 69.80327868852459, 2, 1300, 4.0, 170.00000000000023, 458.39999999999986, 1300.0, 2.84607847711473, 3.4603200234451545, 0.35575980963934123], "isController": false}, {"data": ["CreateAlbum-4", 171, 0, 0.0, 94.27485380116964, 3, 2535, 6.0, 42.20000000000016, 467.8000000000007, 2318.28, 6.910766246362755, 259.71388423708777, 0.8975897566076625], "isController": false}, {"data": ["Delete Album-6", 61, 61, 100.0, 0.22950819672131148, 0, 1, 0.0, 1.0, 1.0, 1.0, 2.846609734471977, 7.611345168929955, 0.0], "isController": false}, {"data": ["CreateAlbum-7", 171, 171, 100.0, 0.30409356725146175, 0, 1, 0.0, 1.0, 1.0, 1.0, 6.9244786394006885, 18.537485447458998, 0.0], "isController": false}, {"data": ["Delete Album-7", 61, 61, 100.0, 0.09836065573770494, 0, 1, 0.0, 0.8000000000000043, 1.0, 1.0, 2.846609734471977, 7.614125061248775, 0.0], "isController": false}, {"data": ["CreateAlbum-6", 171, 0, 0.0, 24.450292397660817, 2, 701, 4.0, 15.600000000000023, 135.00000000000006, 690.9200000000001, 6.921955958549223, 32.58862273063067, 0.8990431078975064], "isController": false}, {"data": ["Delete Album-8", 61, 61, 100.0, 0.22950819672131134, 0, 1, 0.0, 1.0, 1.0, 1.0, 2.846742579802128, 7.642280617066455, 0.0], "isController": false}, {"data": ["CreateAlbum-9", 171, 171, 100.0, 0.2163742690058479, 0, 1, 0.0, 1.0, 1.0, 1.0, 6.9244786394006885, 18.58924978487548, 0.0], "isController": false}, {"data": ["CreateAlbum-8", 171, 171, 100.0, 0.19883040935672516, 0, 1, 0.0, 1.0, 1.0, 1.0, 6.9244786394006885, 18.544247633630288, 0.0], "isController": false}, {"data": ["CreateAlbum-1", 171, 0, 0.0, 85.07017543859651, 2, 2423, 4.0, 43.400000000000034, 335.2000000000001, 2391.32, 6.905184945889194, 10.566821103719109, 0.8766348075835891], "isController": false}, {"data": ["CreateAlbum-0", 171, 0, 0.0, 1155.3391812865498, 2, 5266, 5.0, 4427.800000000001, 4746.6, 5223.52, 6.903791029108967, 32.53007003461989, 0.8899418123460778], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (maxcdn.bootstrapcdn.com)", 3, 0.06693440428380187, 0.0392618767177071], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (cdn.jsdelivr.net)", 4, 0.0892458723784025, 0.05234916895694281], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: maxcdn.bootstrapcdn.com", 168, 3.748326639892905, 2.198665096191598], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (code.jquery.com)", 4, 0.0892458723784025, 0.05234916895694281], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (stackpath.bootstrapcdn.com)", 4, 0.0892458723784025, 0.05234916895694281], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: cdn.jsdelivr.net", 743, 16.577420794288265, 9.723858133752127], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 1490, 33.24408746095493, 19.500065436461195], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: code.jquery.com", 743, 16.577420794288265, 9.723858133752127], "isController": false}, {"data": ["Assertion failed", 1323, 29.518072289156628, 17.314487632508833], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7641, 4482, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 1490, "Assertion failed", 1323, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: cdn.jsdelivr.net", 743, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: code.jquery.com", 743, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: maxcdn.bootstrapcdn.com", 168], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Delete Album-1", 61, 61, "Assertion failed", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Delete Album-2", 61, 61, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Upadate Album-7", 515, 515, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: cdn.jsdelivr.net", 513, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (cdn.jsdelivr.net)", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Upadate Album-6", 515, 515, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: code.jquery.com", 513, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (code.jquery.com)", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Upadate Album-8", 515, 515, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 514, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (stackpath.bootstrapcdn.com)", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album-2", 515, 515, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 512, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (stackpath.bootstrapcdn.com)", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album-1", 515, 515, "Assertion failed", 515, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album", 515, 515, "Assertion failed", 515, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Delete Album", 61, 61, "Assertion failed", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum", 171, 171, "Assertion failed", 171, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbum-3", 171, 171, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 171, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbum-2", 171, 171, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: maxcdn.bootstrapcdn.com", 168, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (maxcdn.bootstrapcdn.com)", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Album-6", 61, 61, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: code.jquery.com", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum-7", 171, 171, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: code.jquery.com", 169, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (code.jquery.com)", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Delete Album-7", 61, 61, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: cdn.jsdelivr.net", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Album-8", 61, 61, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum-9", 171, 171, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: stackpath.bootstrapcdn.com", 171, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum-8", 171, 171, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: cdn.jsdelivr.net", 169, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (cdn.jsdelivr.net)", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
