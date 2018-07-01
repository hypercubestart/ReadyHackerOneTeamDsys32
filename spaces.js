'use strict';

const keyID = process.env.SPACES_KEY;
const secret = process.env.SPACES_SECRET;
const aws = require('aws-sdk');
const hat = require('hat');

aws.config.update({
  accessKeyId: keyID,
  secretAccessKey: secret
});

var s3 = new aws.S3({
  "region" : "nyc3",
  "endpoint": "https://nyc3.digitaloceanspaces.com"
});

exports.uploadFile = async function (path, name){
  // Most of this code is copied from my GradeBook repo @ github.com/nathan-yan/gradebook
  try{
      var fileContent = await fs.readFile(path);

      var url = await sendToSpace(name, fileContent);
      return url;
      
  } catch (error) {
      console.log(error);
  }
}

async function sendToSpace(name, content, callback){
  var key = hat();
  
  keyName = "Bonnie Storage" + "/" + key;
  keyUrl = ("https://dsys32.nyc3.digitaloceanspaces.com/" + keyName).replace(/ /g, '%20'); // Make url web-friendly

  // We don't really have to await for the file upload
  var data = s3.putObject({
      Body : content,
      Bucket: "dsys32",
      Key: keyName,
      ACL: 'public-read',
      ContentDisposition: 'attachment; filename=' + name
  }, (error, data) => {
      console.log(error);
      console.log(data);
  })

  return keyUrl;
}
