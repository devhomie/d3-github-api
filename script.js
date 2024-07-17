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
});
