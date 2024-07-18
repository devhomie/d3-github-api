const width = 600;
const height = 400;

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let margin = { top: 20, right: 10, bottom: 20, left: 50 };

// Bottom axis container
let bottomContainer = svg
  .append("g")
  .attr("id", "bottom")
  .attr("transform", `translate(0, ${height - margin.bottom})`);

// Left axis container
let leftContainer = svg
  .append("g")
  .attr("id", "left")
  .attr("transform", `transale(${margin.left}, 0)`);

function update(items) {
  let xScale = d3
    .scaleBand()
    .domain(items.map((d) => d.full_name))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(items, (d) => d.stargazers_count)])
    .range([height - margin.bottom, margin.top])
    .nice();

  let bottomAxis = d3.axisBottom(xScale);
  let leftAxis = d3.axisLeft(yScale);

  bottomContainer.call(bottomAxis);
  leftContainer.call(leftAxis);
}

function getUrl() {
  let baseURL = "https://api.github.com/search/repositories";

  let params = {
    q: "language:javascript stars:>10000",
    per_page: 20,
    sort: "stars",
  };

  let queryString = Object.entries(params)
    .map((pair) => {
      return `${pair[0]}=${encodeURIComponent(pair[1])}`;
    })
    .join("&");

  return `${baseURL}?${queryString}`;
}

let url = getUrl();

console.log(url);

d3.json(url).then((data) => {
  console.log(data);
  update(data.items);
});
