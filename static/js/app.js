// Fetch the data from the JSON file
function fetchData() {
  return d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
}

// Build the metadata panel
function buildMetadata(sample) {
  fetchData().then((data) => {
    const metadata = data.metadata;
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    const panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Build charts
function buildCharts(sample) {
  fetchData().then((data) => {
    const samples = data.samples;
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build the Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    const bubbleData = [bubbleTrace];
    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Value' },
      hovermode: 'closest'
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Build the Bar Chart
    const barData = [{
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Sample Value' },
      yaxis: { title: 'OTU ID' }
    };

    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Initialize the dashboard
function init() {
  fetchData().then((data) => {
    const names = data.names;
    const dropdown = d3.select("#selDataset");
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });
    const firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Update the dashboard when a new sample is selected
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();