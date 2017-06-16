# scrape-linkedin-rainking-duckduckgo

## How to install Node.js without admin rights
http://abdelraoof.com/blog/2014/11/11/install-nodejs-without-admin-rights
https://stackoverflow.com/questions/37029089/how-to-install-nodejs-lts-on-windows-as-a-local-user-without-admin-rights
https://docs.npmjs.com/getting-started/installing-node

## How to install dependencies
`cd ~\node_modules`

`npm install vo`

`npm install nightmare`

`npm write-csv`

`npm html-to-text`


## Where to build your queries
```javascript
//login.js
exports.linkedEmail = function(){
	return '{linkedin email}';
}
exports.linkedPassword = function(){
	return '{linkedin password}';
}
exports.rkEmail = function(){
	return '{rainking email}';
}
exports.rkPassword = function(){
	return '{rainking password}';
}
//note: make sure list below are all the same size
exports.linkQuery = function(){
	return ['{linkedin people search query}','{repeat n times}'];
}
exports.rainkingQuery = function(){
	return ['{rainking name of account}','{repeat n times}'];
}
exports.googleNewsQuery = function(){
	return ['{duck duck go query for news}','{ repeat n times}'];
}
exports.googleJobsQuery = function(){
	return ['{duck duck go query for jobs}','{ repeat n times}'];
}
exports.googleReportQuery = function(){
	return ['{duck duck go query for reports}','{repeat n times}'];
}
```

## How to run
`cd ~\scrape-linkedin-rainking-duckduckgo`

`node scrape.js`