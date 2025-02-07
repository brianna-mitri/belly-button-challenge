// data url source
const dataURL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

/***************************************
 * DOM References
 **************************************/
// dropdown
const nameDropdown = document.getElementById('nameDropdown');

// for visualizations
const topTenBarChart  = document.getElementById('topTenBarChart');



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
// function: bar chart of top 10 OTU's
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
    
    console.log(top10);
}

/***************************************
 * Setup dashboard
 **************************************/
// update dashboard data
function refreshDashboard(selectedId, data) {
    // filter data by id
    let sampleData = data.samples.find((sample) => sample.id === selectedId);
    //let metaData = data.metadata.find((metadata) = metadata.id === selectedId);

    // build visualizations
    buildBarChart(sampleData);
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
