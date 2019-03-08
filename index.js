const express = require('express')
let server = require('http').Server(express)
const path = require('path')
const cy = require('cypress')
const PORT = process.env.PORT || 5000
const { exec } = require('child_process');
let fs = require('fs');
const compare = require("resemblejs").compare;
var pruebaModel = require('./models/testdb');


async function getDiff() {
  const options2 = {
      output: {
          errorColor: {
              red: 255,
              green: 0,
              blue: 255
          },
          errorType: "movement",
          transparency: 0.3,
          largeImageThreshold: 1200,
          useCrossOrigin: false,
          outputDiff: true
      },
      scaleToSameSize: true,
      ignore: "antialiasing"
  };
  var time = new Date().getTime()
  var img_new_1 = time+'_1.png'; 
  var img_new_2 = time+'_2.png';
  var img_new_t = time+'_t.png';
  var img_1 = 'cypress/screenshots/screenshot_spec.js/1.png';
  var img_2 = 'cypress/screenshots/screenshot_spec.js/2.png'
  // The parameters can be Node Buffers
  // data is the same as usual with an additional getBuffer() function
 
  const options = {};
  // The parameters can be Node Buffers
  // data is the same as usual with an additional getBuffer() function
  compare(path.join(__dirname, img_1), path.join(__dirname, img_2), options, function(err, data) {
      if (err) {
          console.log("An error!");
      } else {
          //console.log(data);
          fs.writeFile(path.join(__dirname, 'public/'+img_new_t), data.getBuffer());
          
          fs.rename(path.join(__dirname, img_1), path.join(__dirname, 'public/'+img_new_1), (err) => {
            if (err) throw err;
            console.log('Rename complete! 1');
          });

          fs.rename(path.join(__dirname, img_2), path.join(__dirname, 'public/'+img_new_2), (err) => {
            if (err) throw err;
            console.log('Rename complete! 2');
          });
          
          mprueba = {
            'jsonImg':time,
            'jsonInfo':JSON.stringify(data)
          }
          pruebaModel.insertPrueba(mprueba)
          /*
          {
          misMatchPercentage : 100, // %
          isSameDimensions: true, // or false
          dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
          getImageDataUrl: function(){}
          }
          */
      }
  });
  
}
//(req, res) => res.render('pages/index')
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    pruebaModel.getPruebas(function(error, data)
		{
      //console.log(data); 
      res.render('pages/index', { 
				title: 'Listado de pruebas',
				pruebas : data
			});
		});
  })
  .get('/prueba', function (req, res) {
    
    //res.send(`Procesando Cypress`)
    //cy.run(); 
    
   exec('npx cypress run', (err, stdout, stderr) => {
      if (err) {
        return;
      }
      getDiff();
      res.send(stdout)

    });

  }).get('/db',function(req,res){
    pruebaModel.createTable();
    res.send(`eliminando y creando db`)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



