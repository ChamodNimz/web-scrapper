// https://nibm-api.herokuapp.com/results/cohdse181f-008 - get  REST data link

const express = require('express')
var bodyParser = require('body-parser');
const cheerio = require('cheerio');


const port =  process.env.PORT || 3000;


const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var request = require('request');

app.get('/',function(req,res){
	res.send({message: 'API works ...'});
});

app.get('/results/:id',function(req, res){
	
	var array = [];
	var isTrue = true;
	var result = {

		subjects: [],
		results:[]
	};
	var results = {
		subject:'',
		result: ''
	};

	var array =[];
	request('https://www.nibm.lk/students/exams/results?q='+req.params.id,function(err,resp,body){
		if(!err){

			const $ = cheerio.load(body);

			$('tbody tr td ').each(function(i, el){
				var item = $(el).text();
				if(i%2==1){

					isTrue=!isTrue;
					if(!isTrue){
						results.subject = item;
					}else{
						results.result =  item;
						array.push(results);
						results= {};
						
					}

				}

			});

		}else{

			throw err;
		}
		res.send(array);
	});
	
});



app.listen(port, () => console.log(`app listening on port ${port}!`));

process.on('uncaughtException',function(error){
	console.log(error);
});