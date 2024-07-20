const width = 600;
const height = 400;

let svg = d3
  .select("body")
  .insert("svg", "#sidebar")
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
  .attr("transform", `translate(${margin.left}, 0)`);

function update(items) {
  let xScale = d3
    .scaleBand()
    .domain(items.map((d) => d.full_name))
    .range([margin.left, width - margin.right])
    .padding(0.4);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(items, (d) => d.stargazers_count)])
    .range([height - margin.bottom, margin.top])
    .nice();

  let leftAxis = d3.axisLeft(yScale).tickFormat(d3.format("~s"));
  let bottomAxis = d3.axisBottom(xScale).tickValues([]);

  bottomContainer.call(bottomAxis);
  leftContainer.call(leftAxis);

  svg
    .selectAll("rect")
    .data(items, (d) => d.full_name)
    .join("rect")
    .attr("x", (d) => xScale(d.full_name))
    .attr("y", (d) => yScale(d.stargazers_count))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(0) - yScale(d.stargazers_count));
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
