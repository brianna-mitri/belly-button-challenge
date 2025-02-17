// data url source
const dataURL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

/***************************************
 * DOM References
 **************************************/
// dropdown
const nameDropdown = document.getElementById('nameDropdown');

// for visualizations
const demoInfoCard = document.getElementById('demoInfoCard');
const topTenBarChart  = document.getElementById('topTenBarChart');
const bubbleChart = document.getElementById('bubbleChart');

/***************************************
 * Function: populate dropdown
 **************************************/
function populateDropdown(selectElement, item, placeholder) {
    // clear existing options
    selectElement.innerHTML = '';

    // add placeholder option
    let placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    selectElement.appendChild(placeholderOption);

    // add dropdown options
    item.forEach((item) => {
        let option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

/***************************************
 * Functions: Build Charts
 **************************************/
// demographic info card
function buildInfoCard(data) {
    // convert metadata into html friendly format
    demoInfoCard.innerHTML = Object.entries(data)
        .map(([key, value]) => `<p><strong>${key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</p>`)
        .join('');
}

// bar chart of top 10 OTU's
function buildBarChart(data) {
    // combine OTU data with sample values and labels
    let combinedData = data.otu_ids.map((id, index) => ({
        otu_id: id,
        sample_value: data.sample_values[index],
        otu_label: data.otu_labels[index]
    }));

    // sort the data by sample value (descending order)
    combinedData.sort((a, b) => b.sample_value - a.sample_value);
    
    // find top 10 otu values
    let top10 = combinedData.slice(0, 10).reverse();

    // extract arrays for plotting
    let otu_ids = top10.map(item => `OTU ${item.otu_id}`);
    let sample_values = top10.map(item => item.sample_value);
    let otu_labels = top10.map(item => item.otu_label);
    

    // set up trace
    trace = [{
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        hoverinfo: 'skip',
        hovertemplate: 
            "<b>OTU Label: </b> %{text}<br>" +
            "<b>Sample Value:</b> %{x}<extra></extra>",
        type: 'bar',
        orientation: 'h'
    }];

    // set up layout
    layout = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: {title: 'Number of Bacteria'}
    };

    // plot chart
    Plotly.newPlot(topTenBarChart, trace, layout, {responsive: true});
}

// bubble chart of bacteria cultures per sample
function buildBubbleChart (data) {
    // set up trace
    trace = [{
        x: data.otu_ids,
        y: data.sample_values,
        mode: 'markers',
        marker: {
            size: data.sample_values,
            color: data.otu_ids,
            colorscale: 'Earth'
        },
        text: data.otu_labels,
        hoverinfo: 'skip',
        hovertemplate: 
            "<b>OTU Label: </b> %{text}<br>" +
            "<b>Sample Value:</b> %{x}<extra></extra>"+
            "<b>OTU ID:</b> %{y}<extra></extra>"
    }];

    // set up layout
    let layout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Number of Bacteria'},
        hovermode: 'closest'
    };
    // plot chart
    Plotly.newPlot(bubbleChart, trace, layout, {responsive: true});
}

/***************************************
 * Setup dashboard
 **************************************/
// update dashboard data
function refreshDashboard(selectedId, data) {
    // filter data by id
    let sampleData = data.samples.find((sample) => sample.id === selectedId);
    let metaData = data.metadata.find((metadata) => metadata.id == selectedId);

    // build visualizations
    buildInfoCard(metaData);
    buildBarChart(sampleData);
    buildBubbleChart(sampleData);
}

// on page load: fetch data & initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    // fetch data
    d3.json(dataURL).then((data) => {
        // inspect the data
        console.log(data);

        // populate dropdown
        populateDropdown(nameDropdown, data.names, 'Select...');

        // default selection: first name
        let defaultId = data.names[0];
        nameDropdown.value = defaultId;
        refreshDashboard(defaultId, data);

        // add event listener for new dropdown selection
        nameDropdown.addEventListener('change', function () {
            refreshDashboard(this.value, data);
        });

    }).catch((error) => console.error('Error fetching data:', error));
});
