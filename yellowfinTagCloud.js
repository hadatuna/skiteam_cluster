// Javascript Panel
// generateChart is a required function which will be called to generate your JS chart
generateChart = function (options) {
    // Use require to load the javascript libraries you need
    require(['js/chartingLibraries/d3_3.5.17/d3_3.5.17.min', 'js/chartingLibraries/cloud'], function (d3, cloud) {
        debugger; // This will trigger a breakpoint in your browser debugger so you can debug your javascript

        var $chartDrawDiv = $(options.divSelector);
        $chartDrawDiv.html(
            '<svg1></svg1>'
        );

        var data = options.dataset.data;

        //change data.xxxname to properly column name
        var nameColumn = data.tour;
        //change data.xxxcount to properly column name
        var countColumn = data.invoice;

        var countMax = d3.max(countColumn, function (d) { return parseInt(d.raw_data) });
        var sizeScale = d3.scale.linear().domain([0, countMax]).range([10, 100])
        var fill = d3.scale.category20();
        var neodata = { name_Column: [], count_Column: [] };
        var data_names = [];
        var data_counts = [];

        //for excepting formatted data
        var nC = nameColumn;
        nC.forEach(function (key) {
            data_names.push(key.raw_data);
        });

        var cC = countColumn;
        cC.forEach(function (key) {
            data_counts.push(parseInt(key.raw_data));
        });
        neodata.name_Column = data_names;


        var words = neodata.name_Column.map(function (d) {
            return {
                text: d
            };
        });

        for (var i = 0; i < data_counts.length; i++) {
            words[i].size = sizeScale(data_counts[i]);
        }
        var random = d3.random.irwinHall(2)
        var layout = cloud()
            .size([600, 600])
            .words(words)
            .padding(1)
            //    .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .rotate(function () { return Math.round(1 - random()) * 60; })// set the angle
            .font("Impact")
            .fontSize(function (d) { return d.size; })
            .on("end", draw);

        layout.start();

        function draw(words) {
            d3.select("svg1").append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("fill", function (d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }
    });
};