const express = require("express");
const app = express();
const Pergunta = require("./database/pergunta"); // Apenas por ser importado, ele executa.
const Resposta = require("./database/resposta");

//Tratando a Conexão
const connection = require("./database/database");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com banco de dados !");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

//Express usar EJS como "Views Engine"//
app.set("view engine", "ejs");

//Sem ele não consigo modificar o CSS
app.use(express.static("public"));

//Body-Parser//
const bodyParser = require("body-parser");
const pergunta = require("./database/pergunta");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rotas//
app.get("/", (req, res) => {
  pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((Perguntas) => {
    res.render("Principal.ejs", {
      perguntas: Perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar.ejs", {});
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/perguntar/:id",(req ,res) => {
  var id = req.params.id;
  Pergunta.findOne({
      where: {id: id}
  }).then(pergunta => {
      if(pergunta != undefined){ // Pergunta encontrada

          Resposta.findAll({
              where: {perguntaid: pergunta.id},
              order:[ 
                  ['id','DESC'] 
              ]
          }).then(respostas => {
              res.render("pergunta",{
                  pergunta: pergunta,
                  respostas: respostas
              });
          });

      }else{ // Não encontrada
          res.redirect("/");
      }
  });
})

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaid = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaid: perguntaid
    }).then(() => {
        res.redirect("/perguntar/"+perguntaid);
    });
});

//App rodando na porta 4000//
app.listen(3000, (req, res) => {
  console.log("Aplcação Rodando");
  console.log("listening on http://localhost:3000");
});
