const request = require("request");
const express = require("express")
const cors = require("cors");

//const graphURL = "http://localhost:7200/repositories/test1"
const graphURL = "http://192.168.99.100:7200/repositories/Repo1"

class GraphDBClient {
    constructor(){
        
    }

    query(url) {
        /*let promise = new Promise(function(resolve, reject) {
            setTimeout(() => resolve(term), 2000);
        })
        return promise;*/
        let options = {
            url: url,
            headers: {
                'User-Agent': 'request',
                'Accept': 'application/sparql-results+json,*/*;q=0.9'
            }
        }

        let promise = new Promise(function(resolve, reject) {
            // Do async job
            request.get(options, function(err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    //console.log(url);
                    setTimeout(() => resolve(body), 2000);
                }
            })
        })
        return promise;
    }

    createURLFromString(term) {
        if(term = ""){
            term = "A";
        }
        let string = graphURL + "?query=PREFIX%20ns%3A%20%3Chttp%3A%2F%2Fexample.com%2Fnamespace%3E%0APREFIX%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0ASELECT%20%3Ffather%20%3Fname%0AWHERE%20%7B%0A%20%20%20%20%3Fx%20a%20%3Chttp%3A%2F%2Fontology.ontotext.com%2Ftaxonomy%2FPerson%3E%20.%0A%20%20%20%20%3Fx%20%3Chttp%3A%2F%2Fontology.ontotext.com%2Ftaxonomy%2Ffather%3E%20%3Ffather%20.%0A%20%20%20%20%3Ffather%20%3Chttp%3A%2F%2Fontology.ontotext.com%2Ftaxonomy%2FhasValue%3E%20%3Fname.%0A%20%20%20%20FILTER%20regex%28%3Fname%2C%20%22" + term + "%22%29%0A%7D"
        console.log(string)
        return string;
    }
}

const app = express();
const graphdb = new GraphDBClient();

//app.use(cors);

// app.get('/', (req, res) => {
//     return res("./index.html")
// })

app.get('/api/search', (req, res) => {
    let term = req.query.q || '';
    //console.log("Term: ", term)
    let graphrequest = graphdb.createURLFromString(term)
    let promise = graphdb.query(graphrequest);
    promise.then((result) => {
        //console.log(result)
        return res.send(result)
    })
});


app.listen(3000, () =>
    console.log("Server listening on Port 3000")
);

