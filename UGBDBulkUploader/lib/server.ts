 
import { ElasticRemote } from './../providers/ElasticRemote';
import { FileUploadResult } from './../models/FileUploadResult';

import { UIController } from './../providers/UIController';
import { Filters } from "./../providers/Filters";
import { Risposta } from '../models/Risposta';
import fs = require("fs");
import util = require("util"); 
const clear = require('clear');
 
const myPreset = require('./barPesets');
const cliProgress = require('cli-progress'); 
const bar1 = new cliProgress.SingleBar({
  clearOnComplete: false,
  hideCursor: true
}, myPreset)
clear();


 


UIController.getInstance().init();



const prompt = require('prompt');

prompt.start();

const schema_url = {
  properties: {
    url: {
      description: 'Please insert the serer baseURL and port (es:  http:\\10.0.4.5:3400)',
      message: 'Name must be a valid url',
      required: true,
      conform: (value) => {
        return ElasticRemote.getInstance().setURL(value);
      }
    },
    path: {
      description: 'Please insert path of the RNDT metadata',
      message: 'It is not a valid path or the directory does not exist',
      required: true,
      conform: (value) => {
        return fs.existsSync(value);
      }
    },
  }
};



prompt.get(schema_url, (err, result) => {
  if (err) { return onErr(err); }
  console.log('- Selected url :' + result.url);
  console.log('- Selected path :' + result.path);
  prompt.stop();


  fs.readdir(result.path, (err, files) => {

    UIController.getInstance().total_files = files.length;
    console.log("This path has " + files.length + " files");
    console.log("");
    bar1.start(files.length, 0);

    const increment = util.promisify(bar1.increment);
    let counter : number = 1;
    files.forEach(async (file) => {
      bar1.increment(1, {
        file: file
      });
      
      let risposta : Risposta = await Filters.getInstance().xmlUpload(result.path, file.toString());
      // console.log(risposta);
      if (!risposta.esito) {
        let fur: FileUploadResult = new FileUploadResult(file,JSON.parse(JSON.stringify(risposta.valore)));
        UIController.getInstance().addFailedFile(fur);
      }
      counter++;
      if (counter ==  (files.length+1)) {
        bar1.stop();
      
        UIController.getInstance().printStatus();
      }
      
    });
   


  });
});



function onErr(err) {
  console.log(err);
  return 1;
}


