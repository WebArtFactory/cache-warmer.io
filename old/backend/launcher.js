const crawler = require('./server/strategies/crawler.js');
// const MongoHandler = require('./mongo/handler.js');

// MongoHandler.connect(function (dbHandler) {

console.log('Start crawler')
console.log(process.argv)
// crawler.init(dbHandler);

let config = [];
/**
 * @todo : envoyer l'url à visiter via un paramètre node comme par exemple
 *
 * nodemon launcher.js sitemap=https://www.visseriefixations.fr/media/sitemap/fr/pages.xml
 *
 * @type {null}
 */
var sitemapURL;
process.argv.forEach(element => {
    // console.log(element);
    var myOption = element.split('=');
    console.log(myOption);

    if (myOption[0] == "--test") {
        console.log('test est bien égale a ' + myOption[1])
    }

    if (myOption[0] == "--url") {
        console.log('url est bien égale a ' + myOption[1])
        config['sitemap_url'] = myOption[1];
    }
    //
    // if (element[3] = "http") {
    //     console.log('L adresse commence bien par http ' + element[3])
    // } else if (element[3] = "https") {
    //     console.log('L adresse commence bien par https ' + element[3])
    // } else {
    //     console.log('Il y a une erreur sur le test ou l adresse');
    // }

});


var endCrawl = () => {
    // console.log('Crawler complete');
    // return process.exit(0);
};

crawler.run(config, endCrawl);


// });
