// data url source
const dataURL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// get data
d3.json(dataURL).then((data) => {

    // inspect the data
    console.log(data);

}).catch((error => {
    
    // error message
    console.error('Error fetching data:', error);
}));