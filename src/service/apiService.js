import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

import Paciente from "../model/paciente.js";

const BASE_URL = process.env.BASE_URL;
const URL_CNN = process.env.URL_CNN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const IDENTIFICADOR = process.env.IDENTIFICADOR;
const TOKEN = process.env.TOKEN;

// AXIOS INSTACIA
const api = axios.create({
  baseURL: BASE_URL,
});

const apiCnn = axios.create({
  baseURL: URL_CNN,
  headers: { "clinicaNasNuvens-cid": TOKEN },
  auth: { username: CLIENT_ID, password: CLIENT_SECRET },
});

export default async function apiService() {
  let count = 0;
  function somaPage2() {
    return new Promise((res) => setTimeout(res, 120000));
  }
  do {
    try {
      let repo = null,
        page = 791,
        data = [];
      do {
        for (let i = 0; i <= 1; i++) {
          count++;
          repo = await api.get(`/paciente?pagina=${page++}`);
          data = data.concat(repo.data.pacientes);
          console.debug(page, "/", 1);
        }
        console.log("Esperando...");
        await somaPage();
      } while (page <= 1);

      // Delay 1 minuto
      function somaPage() {
        return new Promise((res) => setTimeout(res, 60000));
      }

      data.map(async (item) => {
        console.log("Agendamentos...");
        const responseAgenda = await apiCnn.get(
          `/agenda/lista?codigoPaciente=${item.id}&dataFinal=2500-12-31&dataInicial=2000-01-01`
        );
        const dataAgenda = responseAgenda.data.lista.reverse();

        await somaPage();
        console.log("Consultas...");
        // CONSULTA/PROCEDIMENTOS PACIENTES
        const responseConsultas = await apiCnn.get(
          `/plano-tratamento/lista?idPaciente=${item.id}`
        );
        const dataConsultas = responseConsultas.data.lista.reverse();

        // const responseGoogle = await axios.get(
        //   `https://maps.googleapis.com/maps/api/geocode/json?address=${item.endereco.cep}&key=AIzaSyCrIRJ4mekBKMgHcMIoqb6cHz9sVjC_cYs`
        // );

        // if (responseGoogle.data.status === "OK") {
        //   const GoogleGeo = responseGoogle.data.results[0].geometry.location;

        //   // const responseEconomapas = await axios.post("https://api.economapas.com.br/v1/pr/dados" );
        //   const token = "ad6fb6f66cd76db8be0b70bb2d8298021e8ebe60";
        //   const responseEconomapas = await axios({
        //     method: "post",
        //     url: "https://api.economapas.com.br/v1/pr/dados",
        //     data: {
        //       latitude: GoogleGeo.lat,
        //       longitude: GoogleGeo.lng,
        //       raio: "500",
        //     },
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //       Accept: "application/json",
        //     },
        //   });
        //   const dataEconomapas = responseEconomapas.data.content; // Dados Socioeconomicos do Economapas
        // }

        const pacienteNovo = new Paciente({
          idConsulta: item.idConsulta,
          id: item.id,
          ativo: item.ativo,
          nome: item.nome === null ? "NAO INFORMADO" : item.nome,
          nomeSocial:
            item.nomeSocial === null ? "NAO INFORMADO" : item.nomeSocial,
          dataNascimento:
            item.dataNascimento === null
              ? "NAO INFORMADO"
              : item.dataNascimento,
          cpfcnpj: item.cpfcnpj === null ? "NAO INFORMADO" : item.cpfcnpj,
          sexo: item.sexo === null ? "NAO INFORMADO" : item.sexo,
          genero: item.genero === null ? "NAO INFORMADO" : item.genero,
          contato: {
            telefoneCelular:
              item.contato.telefoneCelular === null
                ? "NAO INFORMADO"
                : item.contato.telefoneCelular,
            telefoneComercial:
              item.contato.telefoneComercial === null
                ? "NAO INFORMADO"
                : item.contato.telefoneComercial,
            telefoneResidencial:
              item.contato.telefoneResidencial === null
                ? "NAO INFORMADO"
                : item.contato.telefoneResidencial,
            telefoneRecados:
              item.contato.telefoneRecados === null
                ? "NAO INFORMADO"
                : item.contato.telefoneRecados,
            ramalTelefoneResidencial:
              item.contato.ramalTelefoneResidencial === null
                ? "NAO INFORMADO"
                : item.contato.ramalTelefoneResidencial,
            ramalTelefoneComercial:
              item.contato.ramalTelefoneComercial === null
                ? "NAO INFORMADO"
                : item.contato.ramalTelefoneComercial,
            ramalTelefoneRecados:
              item.contato.ramalTelefoneRecados === null
                ? "NAO INFORMADO"
                : item.contato.ramalTelefoneRecados,
            skype:
              item.contato.skype === null
                ? "NAO INFORMADO"
                : item.contato.skype,
            email:
              item.contato.email === null
                ? "NAO INFORMADO"
                : item.contato.email,
          },
          endereco: {
            cep:
              item.endereco.cep == null ? "NAO INFORMADO" : item.endereco.cep,
            rua:
              item.endereco.rua == null ? "NAO INFORMADO" : item.endereco.rua,
            numero:
              item.endereco.numero == null
                ? "NAO INFORMADO"
                : item.endereco.numero,
            complemento:
              item.endereco.complemento == null
                ? "NAO INFORMADO"
                : item.endereco.complemento,
            bairro:
              item.endereco.bairro == null
                ? "NAO INFORMADO"
                : item.endereco.bairro,
            idCidade:
              item.endereco.idCidade == null ? 0 : item.endereco.idCidade,
            latitude: null, // "GoogleGeo.lat"
            longitude: null, // "GoogleGeo.lng"
            dadosSocioEconomicos: null,
          },
          estrangeiro: item.estrangeiro,
          numeroIdentificacao: item.numeroIdentificacao,
          numeroControle: item.numeroIdentificacao,
          idNacionalidade: item.idNacionalidade,
          idOrigem: item.idOrigem,
          agendamentosFeitos: await Promise.all(
            dataAgenda?.map(async (dadoAgendaPaciente) => [
              {
                status: dadoAgendaPaciente.status,
                data: dadoAgendaPaciente.data,
                horaInicio: dadoAgendaPaciente.horaInicio,
                horaFim: dadoAgendaPaciente.horaFim,
                observacoes: dadoAgendaPaciente.observacoes,
                procedimentos: dadoAgendaPaciente?.procedimentos.map(
                  (agendaProcedimentos) => [
                    {
                      nome: agendaProcedimentos.nome,
                      quantidade: agendaProcedimentos.quantidade,
                      idEspecialidade: agendaProcedimentos.idEspecialidade,
                    },
                  ]
                ),
              },
            ])
          ),
          consultasFeitas: !dataConsultas.length
            ? [{ status: "PACIENTE SEM CONSULTAS(S)" }]
            : await Promise.all(
                dataConsultas?.map(async (dadoConsultasPaciente, index) => [
                  {
                    consulta: index,
                    status: dadoConsultasPaciente.status,
                    dataCriacao: dadoConsultasPaciente.dataCriacao,
                    profissionalSolicitante:
                      dadoConsultasPaciente.profissionalSolicitante,
                    procedimentos: dadoConsultasPaciente.procedimentos.map(
                      (consultaProcedimentos) => [
                        {
                          nome: consultaProcedimentos.nome,
                          status: consultaProcedimentos.status,
                          convenio: consultaProcedimentos.convenio,
                          especialidade: consultaProcedimentos.especialidade,
                          quadrantes: consultaProcedimentos.quadrantes,
                          dente: consultaProcedimentos.dente,
                          faces: consultaProcedimentos.faces,
                          raizes: consultaProcedimentos.raizes,
                        },
                      ]
                    ),
                  },
                ])
              ),
          pesquisaMarketing: {
            clinica: "Não informado",
            importanciaAparencia: "Não informado",
            influenciaProfissonal: "Não informado",
            aparenciaPreferida: "Não informado",
            realizouTratamento: "Não informado",
            conhecimentoEstetico: "Não informado",
            importanciaTecnologica: "Não informado",
          },

          anamnese: {
            clinica: "Não informado",
            grauEscolaridade: "Não informado",
            profissao: "Não informado",
            estadoCivil: "Não informado",
            composicaoFamiliar: "Não informado",
            alergiaMedicamentosa: "Não informado",
            alergiaAlimenticia: "Não informado",
            alergiaDermocosmetica: "Não informado",
            alergiaOutras: "Não informado",
            obsAlergias: "Não informado",
            diabates: "Não informado",
            obsDiabetes: "Não informado",
            hipertensao: "Não informado",
            obsHipertensao: "Não informado",
            neoplasia: "Não informado",
            obsNeoplasia: "Não informado",
            doencaCronica: "Não informado",
            obsDoencaCronica: "Não informado",
            usoDeRemedio: "Não informado",
            obsUsoDeRemedio: "Não informado",
            fumante: "Não informado",
            obsFumante: "Não informado",
            usoDeDrogas: "Não informado",
            obsUsoDeDrogas: "Não informado",
            etilismo: "Não informado",
            obsEtilismo: "Não informado",
            atividadeFisica: "Não informado",
            obsAtividadeFisica: "Não informado",
          },
        });
        Paciente.create(pacienteNovo);

        // console.log(pacienteNovo);
      });
    } catch (e) {
      console.log(e);
    }
    await somaPage2();
    console.log(`Página: ${count}`);
  } while (count <= 1963);
}
