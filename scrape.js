//working rainking and duckduckgo and linkedin
// scrape.js
// written by: Eli Jackson 
// last update: June 16, 2017
// must authorize 'device' for rainking
// upt to 10 pages from linkedin sales navigator results (constrain on DOM can only see max of 10)
// accounts must be exact name on rk (will select first company search result on rk)
// *side note: master db of rainking can be used to query rk metadata and contacts
// @TODO 
// -excel macro for csv after script to create csv to nice clean excel book sheet
// -minimize redudancies

let login = require("./login.js")
let writeCSV = require('write-csv');
let Nightmare = require('nightmare');
let vo = require('vo');
let htmlToText = require('html-to-text');
let nightmare = Nightmare({ show: true ,
    //openDevTools: true,
    waitTimeout: 99900000 // increase the default timeout to test things  
})
var linkedEmail= login.linkedEmail(), 
linkedPassword = login.linkedPassword(),
rkEmail = login.rkEmail(),
rkPassword = login.rkPassword(),
linkQuery = login.linkQuery(),
linkedInScrape = false,
rainkingQuery = login.rainkingQuery(),
rainkingScrape = false,
googleNewsQuery = login.googleNewsQuery(),
newScrape = false,
googleJobsQuery = login.googleJobsQuery(),
jobsScrape = false,
googleReportQuery = login.googleReportQuery(),
reportScrape = false;

if(googleNewsQuery[0].length > 2){
  newScrape = true;
  nAccounts = googleNewsQuery.length
}
if(googleJobsQuery[0].length > 2){
  jobsScrape = true;
  nAccounts = googleJobsQuery.length
}
if(googleReportQuery[0].length > 2){
  reportScrape = true;
  nAccounts = googleReportQuery.length
}
if(linkQuery[0].length > 2 ){
  linkedInScrape = true;
  nAccounts = linkQuery.length
}
if(rainkingQuery[0].length > 2){
  rainkingScrape = true;
  nAccounts = rainkingQuery.length
}

//if(linkQuery.length != rainkingQuery.length && linkQuery.length != googleNewsQuery.length && linkQuery.length != googleJobsQuery.length && linkQuery.length != googleReportQuery) { throw "Arrays in login.js are of different sizes"};

var run = function * (){ 
  var accounts = []; 
  //if rainking  log in
  if(rainkingScrape){
    nightmare.goto('https://my.rainkingonline.com/login/auth')
    .type('#username', rkEmail)
    .type('#password',rkPassword)
    .click('#rkFormLogin > div.pull-right > button')
    .wait('#backToDashboard')
}

  if(linkedInScrape){
    nightmare.goto('https://www.linkedin.com/') // linkedin login
    .type('input#login-email', linkedEmail)
    .type('input#login-password',linkedPassword)
    .click('input#login-submit')
    .wait(3000) //@TODO change to promise after login 
}     
  for (acc=0;acc<nAccounts;acc++){ 
    var metadata = {} //@TODO replace metadata so it takes care of results job and remove declaration below
    var results = {reports: [],news : [], jobs : [],contacts: []};
    if(rainkingScrape){
          nightmare.goto('https://my.rainkingonline.com/search/companySearch') //@TODO swtich metadata  
          .wait('#subNavItems > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)')
          .click('#subNavItems > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)')
          .wait('ul.criteriaSelectorList:nth-child(4) > li:nth-child(3) > a:nth-child(1)')
          .click('ul.criteriaSelectorList:nth-child(4) > li:nth-child(3) > a:nth-child(1)')
          .wait('#level3')
          .click('#level3')
          .click('#level2')
          .click('#level1')
          .click('#department1')
          .click('ul.criteriaSelectorList:nth-child(6) > li:nth-child(1) > a:nth-child(1)')//name 
          .wait('div.js-active:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)')
          .type('div.js-active:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)',rainkingQuery[acc])
          .click('div.js-active:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)')
          .click('#peopleRunSearch')//click search button
          .wait(5500)//arbitrary needed for wait
          var isRainKingAccount = yield nightmare.evaluate(function(){
              if(document.querySelectorAll('table.table:nth-child(7) > tbody:nth-child(3)').length > 0){
                  return true;
              }
              return false;
          });
        if (isRainKingAccount){
            nightmare.click('th.sortable:nth-child(3) > a:nth-child(1)') //@TODO fix descending ('th.sortable:nth-child(3) > a:nth-child(1)') == asc or desc
            .wait('table.table:nth-child(7) > tbody:nth-child(3)')  
            var rkContacts= yield nightmare.evaluate(function(){//get number of results
               var rkContacts = [];
               for(n=1;n<=$('table.table:nth-child(7) > tbody:nth-child(3)').children().length;n++){
                 var rkContact = {}
                 rkContact.firstName = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(4) > a:nth-child(1)').text();
                 rkContact.lastName = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(4) > a:nth-child(1)').text();
                 rkContact.link = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(4) > a:nth-child(1)').attr('data-linkedin');
                 rkContact.title = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(4) > span:nth-child(3)').text();
                 rkContact.email = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(7) > a:nth-child(1)').text();
                 rkContact.phone = $('table.table:nth-child(7) > tbody:nth-child(3) > tr:nth-child('+n+') > td:nth-child(8) > div:nth-child(1)').text();
                 rkContacts.push(rkContact);  
              }
               return rkContacts;
            });
            rkContacts.forEach(function(contact){ //@TODO synchronize contact data fields 
              results.contacts.push(contact)
            });

          //nightmare.goto('https://my.rainkingonline.com/search/companySearch') //@TODO swtich metadata fisrt 
          nightmare.wait('#keyword')
          .type('#keyword',rainkingQuery[acc])//company search
            .wait(2000)
            .click('#keyword').type('#keyword', ' ').wait(100)
            .wait('#ui-id-3 > div > span')
            .click('#ui-id-3 > div > span')
            .wait('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.profileLayout-left > div:nth-child(1) > p')//grab meta data 
            metadata = yield nightmare.evaluate(function(){//get number of results
                 var metadata = {};
                 metadata.account = $('header.profileHeader-column > h1:nth-child(1) > a:nth-child(1)').text();
                 metadata.address = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.profileLayout-left > div:nth-child(1) > p').text()
                 metadata.phone = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.profileLayout-left > div:nth-child(1) > dl > dd:nth-child(2)').text()
                 metadata.site = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.profileLayout-left > div:nth-child(1) > a').attr('href')
                 metadata.employees = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.specsBar > div:nth-child(2) > div.spec-content > div:nth-child(2) > p').text()
                 metadata.itEmployees = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.specsBar > div:nth-child(2) > div.spec-content > div:nth-child(3) > p').text()
                 metadata.industry = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.specsBar > div:nth-child(1) > div.spec-content > p').text()
                 metadata.revenue = $('#appBody > div.rkBodyContainer > section:nth-child(5) > article > div.specsBar > div:nth-child(3) > div.spec-content > p').text()  
                 metadata.bigdata = $('.techResponsibilities > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.cloudSystem = $('tr.odd:nth-child(9) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.IaaS = $('tr.odd:nth-child(14) > td:nth-child(3)').text()
                 metadata.InfacstructureManagement = $('tr.odd:nth-child(15) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.MainframeServers = $('tr.odd:nth-child(16) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.Middleware = $('tr.odd:nth-child(17) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.CRM = $('tr.odd:nth-child(27) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.ERP = $('tr.odd:nth-child(28) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.ITSM = $('.techResponsibilities > tbody:nth-child(2) > tr:nth-child(77) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.ApplicationDev = $('tr.odd:nth-child(81) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.LifecycleManagement = $('tr.odd:nth-child(82) > td:nth-child(3) > p:nth-child(1)').text()
                 metadata.decription = $('article.profileSection-content:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(4)').text()
             // moar meta data 
             //@TODO if technology exist grab
                 return metadata;
           });    
        } else {
          metadata.account = rainkingQuery[acc] + "-";
        }  
    }

    if(newScrape){
      //if google news
      nightmare.goto('https://duckduckgo.com/?q='+googleNewsQuery[acc])
      .wait('#links')
      var newsArray = yield nightmare.evaluate(function(){//get news (@TODO redundant)
           var newsArray = [];
           for (d=0;d < 28; d++){
             var newsObject = {};
             var txt = '#r1-'+d+' div > h2 > a.result__a';
             newsObject.title = $(txt).text();
             newsObject.link = $(txt).attr('href');
             txt = '#r1-'+d+' > div > div.result__snippet';
             newsObject.newsDesc = $(txt).text();
             newsArray.push(newsObject);
           }
           return newsArray;
      }); //end @TODO redundant
      results.news.push(newsArray);//end google news 
    }
  
    if(jobsScrape){
      //if google jobs
      nightmare.goto('https://duckduckgo.com/?q='+googleJobsQuery[acc])
      .wait('#links')
      var jobsArray = yield nightmare.evaluate(function(){//get jobs (@TODO redundant)
           var jobsArray = [];
           for (d=0;d < 28; d++){
             var jobObject = {};
             var txt = '#r1-'+d+' div > h2 > a.result__a';
             jobObject.title = $(txt).text();
             jobObject.link = $(txt).attr('href');
             txt = '#r1-'+d+' > div > div.result__snippet';
             jobObject.jobDesc = $(txt).text();
             jobsArray.push(jobObject);
           }
           return jobsArray;
      }); //end @TODO redundant
      results.jobs.push(jobsArray); // end jobs
    }

    if(reportScrape){
      //if google annual reports
      nightmare.goto('https://duckduckgo.com/?q='+googleReportQuery[acc])
      .wait('#links')
      var reportArray = yield nightmare.evaluate(function(){//get jobs (@TODO redundant)
           var reportArray = [];
           for (d=0;d < 28; d++){
             var reportObject = {};
             var txt = '#r1-'+d+' div > h2 > a.result__a';
             reportObject.title = $(txt).text();
             reportObject.link = $(txt).attr('href');
             txt = '#r1-'+d+' > div > div.result__snippet';
             reportObject.reportDesc = $(txt).text();
             reportArray.push(reportObject);
           }
           return reportArray;
      }); //end @TODO redundant
      results.reports.push(reportArray); //end annual reports 
    }
  
    if(linkedInScrape){
      //if og linkedin
      yield nightmare.goto('https://www.linkedin.com/search/results/people/') //@TODO Ch3eck all degree conections
      .wait('body > div > div > div > div > div div > div > div div > div > input')
      .type('body > div > div > div > div > div div > div > div div > div > input',linkQuery[acc])
      .check('#sf-facetNetwork-S')
      .check('#sf-facetNetwork-O')
      .click('body > div > div > div > div > div > button') //click search button
      .wait(2000)
      var hasResults = yield nightmare.evaluate(function(){
          if(document.querySelectorAll('.page-list > ol > li').length > 0){
            return true;
          }
          return false;
          
      });
      nightmare.wait(3000)

      if(hasResults){
        //.wait('.page-list')
        var numberOfPages = yield nightmare.evaluate(function(){
            return document.querySelectorAll('.page-list > ol > li').length;
        });
        if (numberOfPages < 1){
          numberOfPages = 1;
        }
        for(pg=1;pg<=numberOfPages;pg++){
            if(pg>1){
              yield nightmare.click('.next').wait(1500);
            }
            var selector = '.results-list > li'; //result li item
            yield nightmare.wait(selector)
            var numberOfContactsOnThePage = yield nightmare.evaluate(function(){
                return document.querySelectorAll('.results-list > li').length;
            });
            for(c=1;c<=numberOfContactsOnThePage;c++){
               currentSelector = selector + ':nth-child('+c+')' + ' > div > div > div:nth-child(2) > a';           
                yield nightmare.wait(currentSelector).click(currentSelector)//select contact
                var closeConnection = yield nightmare.evaluate(function(){
                    if (document.querySelectorAll('.shared-modal-dialog > div > button').length > 0){ //check if "linkein member "
                      return false; 
                    }
                    return true;
                });
                if(closeConnection){ //if not "linkedn member" for name
                   var previousHeight, currentHeight=0;
                    while(previousHeight !== currentHeight) {
                      previousHeight = currentHeight;
                      var currentHeight = yield nightmare.evaluate(function() {
                        return document.body.scrollHeight;
                      });
                      yield nightmare.scrollTo(currentHeight/2, 0)
                        .wait(1500);
                    }//redundant1
                  yield nightmare.wait('.profile-detail > div:nth-child(4) > span >section')
                  var contact = yield nightmare.evaluate(function(){
                        var contact = {};
                        var name = $('.pv-top-card-section__body > div > h1').text()
                        var names = name.split(" ");
                        var notes = '';
                        notes = $('.truncate-multiline--truncation-target  >span').text(); 
                        notes = notes + ' ' + $('.truncate-multiline--last-line').text();
                        notes = notes + ' ' + $('.profile-detail > div:nth-child(4) > span >section > section').html(); //correct selector may take more ms to load all data. 
                        contact.name = name;
                        contact.firstname = names[0];
                        contact.lastname = names[1];
                        contact.title = $('.pv-top-card-section__body > div > h2').text();
                        contact.company = $('.pv-top-card-section__body > div > div ').text();// doesnt work
                        contact.link = window.location.href;
                        //notes.email = '',
                        //notes.phone =  '', 
                        contact.notes = notes;            
                        return contact;
                  });
                  results.contacts.push(contact);
                  yield nightmare.back()//before and after back + wait
                } else {
                  yield nightmare.click('.shared-modal-dialog > div > button');// get rid of modal from "linkedin member"
                }              
                previousHeight, currentHeight=0;
                  while(previousHeight !== currentHeight) {
                    previousHeight = currentHeight;
                    var currentHeight = yield nightmare.evaluate(function() {
                      return document.body.scrollHeight;
                    });
                    yield nightmare.scrollTo(currentHeight, 0)
                      .wait(1500).wait(currentSelector);
                  }//redundant1
            }
             previousHeight, currentHeight=0;
                  while(previousHeight !== currentHeight) {
                    previousHeight = currentHeight;
                    var currentHeight = yield nightmare.evaluate(function() {
                      return document.body.scrollHeight;
                    });
                    yield nightmare.scrollTo(currentHeight, 0)
                      .wait(1500);
                  } //redundant2


                 var hasNext = yield nightmare.evaluate(function(){
                    if (document.querySelectorAll('.next').length > 0){ //check if "linkein member "
                      return false; 
                    }
                    return true;
                });

        } //<end> if of linkedin
      }
    }        

    metadata.contacts = results.contacts //@TODO set metadata as main data object (this is just as a result of changing model half way through)
    metadata.news = results.news
    metadata.jobs = results.jobs
    metadata.reports = results.reports
    accounts.push(metadata)
  }
  yield nightmare.end(); //end of session
  return accounts;//should return accounts 
};

vo(run) //use `vo` to execute the generator function
  .then(function(result) {
    console.dir(result);    
    result.forEach(function(result){ //@TODO synchronize contact data fields 
     result.contacts.forEach(function(contact){
        contact.notes = htmlToText.fromString(contact.notes,{
          wordwrap: 130
        });
      });
      writeCSV( result.account+'reports.csv', result.reports);
      writeCSV( result.account+'contacts.csv', result.contacts);
      writeCSV( result.account+'news.csv', result.news);
      writeCSV( result.account+'jobs.csv', result.jobs);      
      writeCSV('results.csv', result); //@todo write only to result.csv for copy and pasting into macro 
    });

  }, function(err) {
    console.log(err);
});