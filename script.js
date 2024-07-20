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

let chartHeight = height - margin.bottom - margin.top;
let midPoint = margin.top + chartHeight / 2;

svg
  .append("text")
  .text("Stars")
  .style("font-size", "14px")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(12, ${midPoint}) rotate(270)`);

function getLicense(d) {
  let license = d.license?.name;

  if (!license) {
    return "No License";
  } else {
    return license;
  }
}

function update(items) {
  let licenses = new Set(items.map((d) => getLicense(d)));

  let colorScale = d3
    .scaleOrdinal()
    .domain(licenses)
    .range(d3.schemeCategory10);

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
    .attr("fill", (d) => colorScale(getLicense(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(0) - yScale(d.stargazers_count))
    .on("mouseover", (e, d) => {
      let info = d3.select("#info");
      info.select(".repo .value a").text(d.full_name).attr("href", d.html_url);
      info.select(".license .value").text(getLicense(d));
      info.select(".stars .value").text(d.stargazers_count);
    });

  d3.select("#key")
    .selectAll("p")
    .data(licenses)
    .join((enter) => {
      let p = enter.append("p");

      p.append("input").attr("type", "checkbox").attr("checked", true).attr("title", "Include in chart");

      p.append("div")
        .attr("class", "color")
        .style("background-color", (d) => colorScale(d));

      p.append("span").text((d) => d);

      return p;
    });
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
