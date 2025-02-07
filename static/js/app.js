// data url source
const dataURL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

/***************************************
 * DOM References
 **************************************/
// base
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

    // set up values
    let yValues = data.out_ids;
    let xValues = data.sample_values;

    // set up trace
    trace = [{
        x: xValues,
        y: yValues,
        type: 'bar'
    }]

    // plot chart
    Plotly.newPlot(topTenBarChart, trace, {responsive: true});

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
