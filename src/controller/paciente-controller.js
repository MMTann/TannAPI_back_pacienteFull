import express from "express";
const router = express.Router();
import Paciente from "../model/paciente.js";

// READ/GET
router.get("/", async (req, res) => {
  try {
    let { pagina, limit, sort, asc } = req.query;
    if (!pagina) pagina = 1;
    if (!limit) limit = 50;

    const skip = (pagina - 1) * 50;
    const pacientes = await Paciente.find()
      .sort({ [sort]: asc })
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .send({ pagina: pagina, limit: limit, pacientes: pacientes });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// READ/GET por ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!Paciente) {
    res.status(422).json({ error: "O paciente não foi encontrado!" });
    return;
  }

  try {
    const paciente = await Paciente.findOne({ idConsulta: id });
    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CREATE/POST - Inserir Paciente
router.post("/", async (req, res) => {
  const { nome, id } = req.body;

  if (!nome) {
    res.status(422).json({
      erro: "Paciente não inserido pois os campos obrigatórios não foram preenchidos",
    });
    return;
  }
  const paciente = {
    nome,
    id,
  };

  try {
    await Paciente.create(paciente);
    res.status(201).json({ mensagem: "Paciente inserido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, genero, pesquisaMarketing, anamnese } = req.body;
  const pacientes = {
    nome,
    genero,
    pesquisaMarketing,
    anamnese,
  };

  try {
    const updatePaciente = await Paciente.updateOne(
      { idConsulta: id },
      pacientes
    );

    if (updatePaciente.matchedCount === 0) {
      res.status(422).json({ message: "O paciente não foi encontrado!" });
      return;
    }
    res.status(200).json({
      mensagem: "Paciente atualizado com sucesso!",
      pacienteAtualizado: pacientes,
    });
  } catch (error) {
    res.status(500).json({ error: "Não foi possível atualizar o paciente!" });
  }
});

export default router;
