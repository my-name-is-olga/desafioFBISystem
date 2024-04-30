const agentes = require("./data/agentes");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const port = 3000;

//middlewares
app.use(express.static("public"));

//html
app.get("/", (req, res) => {
  try {
    res.sendFile(__dirname + "index.html");
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.get("/dashboard", async (req, res) => {
  try {
    res.sendFile("./public/dashboard.html");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//llave secreta
const secretKey = "key";
const tokenOptions = { expiresIn: "120s" };

app.get("/signIn", async (req, res) => {
  try {
    const { email, password } = req.query;
    const selectedAgent = { email, password };

    //verificar que el usuario exista
    const loggedAgent = agentes.results.find(
      (agente) => agente.password === password && agente.email === email
    );

    //firma del token solamente si el usuario existe
    if (loggedAgent) {
      const token = jwt.sign(selectedAgent, secretKey, tokenOptions);
      res.send(`
        <a href="/Dashboard?token=${token}"><p> Accede a los datos de tu cuenta</p> </a>
        ¡Bienvenido, ${email}!               
`);
    } else {
      res.status(200).json({
        message: "Usuario y/o contraseña incorrectas. Vuelve a intentarlo",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.get("/peticion", async (req, res) => {
  try {
    const { token } = req.query;
    return jwt.verify(token, secretKey, (err, data) => {
      err
        ? res.status(404).json({
            status: "Error",
            message: "Usuario no encontrado",
            error: err,
          })
        : res
            .status(200)
            .json({ status: "Ok", message: "Gracias por la petición" });
    });
  } catch (error) {
    res.json(error);
  }
});

app.listen(3000, () =>
  console.log(`SERVIDOR LEVANTADO CORRECTAMENTE: ${port}`)
);
