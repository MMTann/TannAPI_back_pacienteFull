import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const Paciente = mongoose.model("pacientefull", {
  idConsulta: { type: String },
  id: String,
  ativo: Boolean,
  nomeSocial: String,
  nome: String,
  dataNascimento: String,
  cpfcnpj: String,
  sexo: String,
  genero: String,
  contato: {
    telefoneCelular: String,
    telefoneComercial: String,
    telefoneResidencial: String,
    telefoneRecados: String,
    ramalTelefoneResidencial: String,
    ramalTelefoneComercial: String,
    ramalTelefoneRecados: String,
    skype: String,
    email: String,
  },
  endereco: {
    cep: String,
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    idCidade: Number,
    latitude: String,
    longitude: String,
    dadosSocioEconomicos: Object,
  },
  estrangeiro: Boolean,
  numeroIdentificacao: String,
  numeroControle: String,
  idNacionalidade: Number,
  idOrigem: Number,
  agendamentosFeitos: Array,
  consultasFeitas: Array,
  pesquisaMarketing: Object,
  anamnese: Object,
  agendamentosFeitos: Object,
  consultasFeitas: Object,
});

export default Paciente;
