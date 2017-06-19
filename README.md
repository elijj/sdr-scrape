# scrape-linkedin-rainking-duckduckgo

## How to install Node.js binaries on Windows 

Go [here](https://nodejs.org/en/download/) to download the Windows Binary (.zip) for 64-bit

Unzip file and save into a directory where it will not get deleted (for example: `C:\Users\eli\Downloads\node-v6.11.0-win-x64'`)

Click windows start menu and search 'path' in the 'Search program and files input box' 

Select 'Edit enviromental variables for account'

Select 'PATH' and click edit

At the end of the variable value input box add a semi colon and a percent sign, then copy and past the directory location of the unzip file  the follow it wth a percent sign. (for example: `;%C:\Users\eli\Downloads\node-v6.11.0-win-x64%'` )

To test if you have successfully added node to you PATH variable open owershell or your perfered command line and run

`node -v` 

This should return your current version of node.

## How to install dependencies

Using powershell or another command line ui `cd` into the directory you added to your path then `cd node_modules` (for example: `cd \Users\eli\Downloads\node-v6.11.0-win-x64\node_modules` )

Then run each of these commands:

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
`cd` the directory where sdr-scrap is located  (for example: `cd \Users\eli\Downloads\sdr-scrap`)

Then run the command

`node scrape.js`
