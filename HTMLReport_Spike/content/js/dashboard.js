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

    var data = {"OkPercent": 99.66666666666667, "KoPercent": 0.3333333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4058333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17916666666666667, 500, 1500, "Upadate Album-7"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-6"], "isController": false}, {"data": [0.5479166666666667, 500, 1500, "Upadate Album-8"], "isController": false}, {"data": [0.7270833333333333, 500, 1500, "Upadate Album-3"], "isController": false}, {"data": [0.07291666666666667, 500, 1500, "Upadate Album-2"], "isController": false}, {"data": [0.9395833333333333, 500, 1500, "Upadate Album-5"], "isController": false}, {"data": [0.8604166666666667, 500, 1500, "Upadate Album-4"], "isController": false}, {"data": [0.20625, 500, 1500, "Upadate Album-1"], "isController": false}, {"data": [0.525, 500, 1500, "Upadate Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2400, 8, 0.3333333333333333, 3703.3487500000106, 2, 29348, 1479.5, 13437.900000000001, 19162.44999999999, 24919.019999999935, 79.53603976801989, 5718.005385252693, 22.006783347141674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Upadate Album-7", 240, 0, 0.0, 1744.5333333333344, 195, 2584, 1635.0, 2293.9, 2365.95, 2556.7000000000003, 16.310996330025826, 353.5152931519301, 2.564521883920076], "isController": false}, {"data": ["Upadate Album-6", 240, 4, 1.6666666666666667, 7235.958333333333, 2751, 15009, 5907.0, 12871.400000000001, 14057.55, 14741.67, 13.371218452281465, 936.2551534904451, 1.810468201571118], "isController": false}, {"data": ["Upadate Album-8", 240, 0, 0.0, 825.941666666667, 52, 2224, 733.0, 1357.7, 1551.95, 2116.1400000000003, 18.942383583267564, 1131.5897543409628, 3.0152426992896606], "isController": false}, {"data": ["Upadate Album-3", 240, 0, 0.0, 898.9375000000001, 5, 4686, 337.5, 3051.9, 3452.85, 4444.6, 24.27675500708072, 912.3460575561401, 3.153133218693102], "isController": false}, {"data": ["Upadate Album-2", 240, 0, 0.0, 2356.5291666666676, 511, 5720, 2447.5, 3457.6, 3694.4499999999994, 5169.090000000004, 13.959981386691485, 2200.8997303433284, 2.249411063285249], "isController": false}, {"data": ["Upadate Album-5", 240, 0, 0.0, 176.94583333333335, 2, 1849, 9.0, 1032.1000000000004, 1283.9, 1609.6800000000003, 23.776500891618785, 28.90795274420448, 2.972062611452348], "isController": false}, {"data": ["Upadate Album-4", 240, 0, 0.0, 400.4416666666667, 2, 4146, 25.5, 1408.7, 2536.349999999998, 3311.17, 23.816612086930633, 72.03129651682048, 2.977076510866329], "isController": false}, {"data": ["Upadate Album-1", 240, 0, 0.0, 2055.7124999999987, 199, 6550, 1658.5, 3785.9, 4330.499999999999, 4973.85, 13.277273733126798, 69.51119578446558, 3.4878775724717856], "isController": false}, {"data": ["Upadate Album-0", 240, 0, 0.0, 1991.399999999999, 4, 7624, 473.0, 5157.3, 6170.9, 7362.820000000001, 14.922589069203507, 49.44564913262452, 1.9090421563141207], "isController": false}, {"data": ["Upadate Album", 240, 4, 1.6666666666666667, 19347.087499999998, 9883, 29348, 19139.5, 24892.2, 27696.55, 29216.38, 7.953603976801988, 2859.0026926263463, 11.003391673570837], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, 50.0, 0.16666666666666666], "isController": false}, {"data": ["Assertion failed", 4, 50.0, 0.16666666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2400, 8, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Assertion failed", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Upadate Album-6", 240, 4, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album", 240, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
