const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

const slugify = require("slugify");

///////////////File system//////////

//Blocking, synchronous way
// const textIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut=`This is what we know abnout the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log("File Writeen!")

//Non-Blocking / asynchronous way

// fs.readFile('./txt/start.txt','utf-8', (err,data1)=>{
//     if(err) return console.log("Error 👹")
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2)=>{
//         console.log(data2);

//         fs.readFile(`./txt/append.txt`,'utf-8', (err,data3)=>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}` ,'utf-8',(err)=>{
//                console.log('Your File has been written 😊');
//             })
//           })
//       })
// })

// console.log("will read file")

/////////////////////Server

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// const slugs=dataObj.map(el => slugify(el.productName, {lower:true}))
// console.log(slugs)

console.log(slugify("Fresh Avacados", { lower: true }));

console.log("delta");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //Api
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
