import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RotateCw, Copy, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";

const generalSurgeryProcedures = [
  "Apendicectomia",
  "Colecistectomia",
  "Herniorrafia Inguinal (Estrangulada/Encarcerada)",
  "Laparotomia Exploradora (Trauma/Abdome Agudo)",
  "Correção de Úlcera Perfurada (Rafia de Úlcera)",
  "Ressecção Intestinal (Obstrução/Isquemia)",
  "Drenagem de Abscesso Intra-abdominal",
  "Gastrostomia de Urgência",
  "Colostomia/Ileostomia de Descompressão",
  "Esplenectomia por Trauma",
  "Hemostasia de Sangramento Gastrointestinal (Via Endoscópica/Cirúrgica)",
  "Tireoidectomia de Urgência (Ex: Hematoma de loja)",
  "Acesso Venoso Central de Urgência",
].sort();

const incisionTemplates = {
  "Apendicectomia": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão oblíqua em quadrante inferior direito (McBurney / Rocky-Davis).
--- OU ---
- Portais Videolaparoscópicos: Umbilical (10mm) e dois acessórios (5mm e 5mm) em fossa ilíaca direita e suprapúbica.`,
  "Colecistectomia": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Portais Videolaparoscópicos: Umbilical (10mm), Subxifóide (10mm), Hipocôndrio D (5mm), Flanco D (5mm).
--- OU ---
- Incisão subcostal direita (Kocher).`,
  "Herniorrafia Inguinal (Estrangulada/Encarcerada)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão oblíqua na prega inguinal (Esquerda/Direita), sobre a proeminência da hérnia.`,
  "Laparotomia Exploradora (Trauma/Abdome Agudo)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão mediana xifopúbica.`,
  "Correção de Úlcera Perfurada (Rafia de Úlcera)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão mediana supra-umbilical.
--- OU ---
- Portais Videolaparoscópicos (se abordagem minimamente invasiva).`,
  "Ressecção Intestinal (Obstrução/Isquemia)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão mediana xifopúbica.`,
  "Drenagem de Abscesso Intra-abdominal": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão sobre o ponto de maior flutuação (ou Guiada por Imagem - Descreva o local exato).`,
  "Gastrostomia de Urgência": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão paramediana esquerda alta ou Incisão em quadrante superior esquerdo para acesso gástrico.`,
  "Colostomia/Ileostomia de Descompressão": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão transversa ou oblíqua em Fossa Ilíaca Esquerda (Colostomia) ou Fossa Ilíaca Direita (Ileostomia).`,
  "Esplenectomia por Trauma": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão mediana xifopúbica (acesso rápido).`,
  "Hemostasia de Sangramento Gastrointestinal (Via Endoscópica/Cirúrgica)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Se cirúrgica: Incisão mediana xifopúbica. Se endoscópica: Não se aplica.`,
  "Tireoidectomia de Urgência (Ex: Hematoma de loja)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Incisão cervical transversa (tipo Kocher) pré-existente ou nova.`,
  "Acesso Venoso Central de Urgência": "Não se aplica (Incisão mínima de 1cm na fossa supraclavicular direita / Femoral).",
  "Padrão": "Descreva o tipo e local da incisão (Ex: mediana infraumbilical, transversa, portais).",
};

const possibleFindingsTemplates = {
  "Apendicectomia": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Apêndice cecal edemaciado e hiperemiado (Fase inflamatória inicial). Líquido seroso livre.
--- OU ---
- Apêndice cecal perfurado em base com peritonite localizada em quadrante inferior direito. Secreção purulenta e fibrina.`,
  "Colecistectomia": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Colecistite Crônica: Vesícula biliar com paredes espessadas e escleroatróficas. Múltiplos cálculos de colesterol.
--- OU ---
- Colecistite Aguda: Vesícula distendida com edema de parede. Achado de perivesiculite e aderências omentais.`,
  "Herniorrafia Inguinal (Estrangulada/Encarcerada)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Hérnia inguinal indireta (Esquerda/Direita) com alças de intestino delgado encarceradas (viáveis, sem sinais de isquemia).
--- OU ---
- Hérnia inguinal direta (Esquerda/Direita). Conteúdo: Omento não redutível, mas sem sinais de sofrimento vascular.`,
  "Laparotomia Exploradora (Trauma/Abdome Agudo)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Hemoperitônio (aproximadamente [Volume] mL). Laceração em [Órgão/Região].
- Contaminação: Extravasamento de conteúdo entérico em cavidade.`,
  "Correção de Úlcera Perfurada (Rafia de Úlcera)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Úlcera péptica perfurada (Tamanho em mm) em parede anterior do duodeno. Peritonite química por bile/conteúdo gástrico.`,
  "Ressecção Intestinal (Obstrução/Isquemia)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Obstrução intestinal por brida em [Local]. Segmento de alça ileal (cerca de X cm) com necrose e inviabilidade.`,
  "Drenagem de Abscesso Intra-abdominal": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Abscesso em [Localização, ex: Fundo de Saco de Douglas/Sub-hepático]. Drenagem de pus fétido (Volume estimado).
- Achado de alças intestinais aderidas.`,
  "Gastrostomia de Urgência": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Estômago distendido e aderido à parede abdominal. Condição que impede a alimentação enteral/necessidade de descompressão.`,
  "Colostomia/Ileostomia de Descompressão": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Obstrução intestinal distal (Câncer/Diverticulite). Alça de cólon (sigmoide/transverso/íleo) distendida e edemaciada.`,
  "Esplenectomia por Trauma": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Hemoperitônio maciço. Baço com laceração grau [Grau I-V] ou lesão hilar.`,
  "Hemostasia de Sangramento Gastrointestinal (Via Endoscópica/Cirúrgica)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Endoscopia: Lesão de Mallory-Weiss/Úlcera sangrante (Forrest Ia/Ib).
- Cirurgia: Úlcera gástrica sangrante em face posterior, aderida ao pâncreas.`,
  "Tireoidectomia de Urgência (Ex: Hematoma de loja)": `SUGESTÕES POSSÍVEIS (Apagar e Editar Conforme o Caso):

- Hematoma volumoso sob a musculatura cervical, comprimindo a traqueia. Sangramento ativo.`,
  "Acesso Venoso Central de Urgência": "Não se aplica (Acesso venoso não gera \"Achados Patológicos\" intra-abdominais).",
  "Padrão": "Descreva aqui os achados patológicos macroscópicos. Ex: Inflamação, perfuração, necrose, cálculo, corpo estranho.",
};

const procedureTemplates = {
  "Herniorrafia Inguinal (Estrangulada/Encarcerada)": `1. Paciente posicionado em decúbito dorsal sob anestesia geral.
2. Assepsia e antissepsia da região inguinal (Esquerda/Direita) com clorexidina alcoólica.
3. Colocação de campos estéreis, isolando a área cirúrgica.
4. Incisão oblíqua na região inguinal.
5. Dissecção por planos, identificando e abrindo a fáscia do músculo oblíquo externo.
6. Identificação e isolamento do cordão espermático.
7. Dissecção cuidadosa do saco herniário e redução do conteúdo (Omento/Intestino) para a cavidade abdominal.
8. Ligadura alta e ressecção do saco herniário.
9. Reforço da parede posterior do canal inguinal (Ex: Técnica de Lichtenstein com tela de polipropileno fixada com pontos não absorvíveis).
10. Reposicionamento do cordão espermático e fechamento da fáscia do oblíquo externo.
11. Fechamento por planos (subcutâneo e pele).`,
  "Apendicectomia": `1. Paciente em decúbito dorsal sob anestesia geral.
2. Assepsia e antissepsia do abdome com clorexidina.
3. Incisão (Pfannenstiel/McBurney/Para-retal - Descrever o tipo). Abertura por planos até o peritônio.
4. Identificação do apêndice cecal (Grau de inflamação/Sinais de perfuração/Líquido livre - Achados).
5. Ligadura da artéria apendicular com fio inabsorvível.
6. Ligadura da base apendicular e ressecção do apêndice.
7. Realização de invaginação do coto (se aplicável, com sutura em bolsa).
8. Revisão da cavidade e hemostasia rigorosa.
9. Lavagem da cavidade (se houver contaminação, descrever o volume e tipo de solução).
10. Fechamento da cavidade por planos.`,
  "Colecistectomia": `1. Paciente em decúbito dorsal sob anestesia geral.
2. Assepsia e antissepsia do abdome.
3. Incisão (Subcostal/Videolaparoscópica - descrever portais).
4. Identificação da vesícula biliar (Grau de inflamação/Sinais de cálculo/Lama).
5. Dissecção cuidadosa do Trígono de Calot.
6. Identificação, clipagem e secção do Ducto Cístico e Artéria Cística.
7. Descolamento da vesícula do leito hepático.
8. Revisão da hemostasia do leito.
9. Drenagem da loja (se necessário).
10. Fechamento da parede por planos/Portais.`,
  "Ressecção Intestinal (Obstrução/Isquemia)": `1. Laparotomia exploradora através de incisão mediana xifopúbica.
2. Identificação da alça intestinal isquêmica/necrótica (aproximadamente [X] cm de íleo/jejuno).
3. Ligadura e secção dos vasos mesentéricos do segmento doente.
4. Ressecção do segmento intestinal.
5. Realização de anastomose primária (Término-terminal/Latero-lateral) com grampeador/fios absorvíveis em dois planos.
6. Revisão da hemostasia e da anastomose.
7. Fechamento da cavidade por planos.`,
  "Gastrostomia de Urgência": `1. Incisão abdominal (geralmente paramediana alta).
2. Localização da parede anterior do estômago e ancoragem à parede abdominal.
3. Incisão na parede gástrica e inserção da sonda de Gastrostomia (Ex: Foley/Pezzer).
4. Realização da sutura em bolsa ao redor da sonda e fixação na parede (ponto de fixação).
5. Revisão de hemostasia.
6. Fechamento da parede por planos.`,
  "Esplenectomia por Trauma": `1. Laparotomia exploradora mediana xifopúbica.
2. Controle inicial do sangramento (compressão/clampeamento).
3. Liberação dos ligamentos esplênicos (gastrocólico, esplenocólico, esplenorrenal).
4. Dissecção cuidadosa do hilo esplênico.
5. Ligadura e secção dos vasos hilares (Artéria e Veia Esplênica).
6. Remoção do baço.
7. Revisão da hemostasia rigorosa do leito esplênico e cavidade.
8. Lavagem da cavidade.
9. Fechamento da parede por planos.`,
  "Tireoidectomia de Urgência (Ex: Hematoma de loja)": `1. Revisão cervical sob anestesia.
2. Reabertura imediata da incisão cervical transversa para alívio da compressão.
3. Evacuação do hematoma (volume estimado) e identificação do ponto de sangramento ativo.
4. Hemostasia cuidadosa do vaso/leito sangrante com eletrocautério/ligadura.
5. Inserção de dreno (se necessário).
6. Fechamento por planos.`,
  "Acesso Venoso Central de Urgência": `1. Posicionamento adequado do paciente (Trendelenburg/Cabeça rodada).
2. Assepsia e antissepsia da região (Ex: subclávia/jugular/femoral).
3. Punção venosa com agulha guia e confirmação do fluxo.
4. Introdução do fio guia na veia.
5. Incisão cutânea e dilatação do trajeto.
6. Passagem do cateter (Ex: Duplo Lúmen 7FR) sobre o fio guia.
7. Confirmação do posicionamento (Teste de aspiração/raio-x de controle posterior).
8. Fixação do cateter à pele.`,
  "Padrão": `1. Paciente posicionado em decúbito dorsal sob anestesia geral.
2. Assepsia e antissepsia da região cirúrgica com clorexidina alcoólica.
3. Colocação de campos estéreis, isolando a área cirúrgica.
4. [Detalhar a incisão].
5. [Detalhar o achado e o tratamento específico].
6. [Detalhar o fechamento].`,
};

export default function SurgicalReport() {
  const [notification, setNotification] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [showDynamicFields, setShowDynamicFields] = useState(false);
  
  // Form fields
  const [abordagem, setAbordagem] = useState("Aberta");
  const [anestesia, setAnestesia] = useState("Geral");
  const [patologias, setPatologias] = useState("");
  const [incisao, setIncisao] = useState("");
  const [complicacoes, setComplicacoes] = useState("Nenhuma");
  const [detalheProcedimento, setDetalheProcedimento] = useState("");
  
  // Checkboxes
  const [materialEspecial, setMaterialEspecial] = useState(false);
  const [drenos, setDrenos] = useState(false);
  const [anapatSolicitado, setAnapatSolicitado] = useState(true);
  const [fiosEspeciais, setFiosEspeciais] = useState(false);
  
  // Details
  const [descMaterial, setDescMaterial] = useState("");
  const [descDrenos, setDescDrenos] = useState("");
  const [descFios, setDescFios] = useState("");
  
  // Report output
  const [reportOutput, setReportOutput] = useState("O relatório gerado pela IA aparecerá aqui.");
  const [isGenerating, setIsGenerating] = useState(false);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleProcedureChange = (value) => {
    setSelectedProcedure(value);
    setShowDynamicFields(true);
    
    // Fill templates
    setDetalheProcedimento(procedureTemplates[value] || procedureTemplates["Padrão"]);
    
    if (!patologias.trim()) {
      setPatologias(possibleFindingsTemplates[value] || possibleFindingsTemplates["Padrão"]);
    }
    
    if (!incisao.trim()) {
      setIncisao(incisionTemplates[value] || incisionTemplates["Padrão"]);
    }
    
    // Set defaults
    setAbordagem("Aberta");
    setAnestesia("Geral");
    setComplicacoes("Nenhuma");
  };

  const handleRefreshDetails = () => {
    if (selectedProcedure) {
      setPatologias("");
      setIncisao("");
      
      setDetalheProcedimento(procedureTemplates[selectedProcedure] || procedureTemplates["Padrão"]);
      setPatologias(possibleFindingsTemplates[selectedProcedure] || possibleFindingsTemplates["Padrão"]);
      setIncisao(incisionTemplates[selectedProcedure] || incisionTemplates["Padrão"]);
      
      showNotification(`Template de "${selectedProcedure}", Achados e Incisão recarregados!`);
    } else {
      showNotification("Selecione um procedimento (item 1) primeiro.", "error");
    }
  };

  const handleClearForm = () => {
    setSelectedProcedure("");
    setShowDynamicFields(false);
    setAbordagem("Aberta");
    setAnestesia("Geral");
    setPatologias("");
    setIncisao("");
    setComplicacoes("Nenhuma");
    setDetalheProcedimento("");
    setMaterialEspecial(false);
    setDrenos(false);
    setAnapatSolicitado(true);
    setFiosEspeciais(false);
    setDescMaterial("");
    setDescDrenos("");
    setDescFios("");
    setReportOutput("O relatório gerado pela IA aparecerá aqui.");
    
    showNotification("📝 Formulário Limpo! Pronto para o próximo relatório.");
  };

  const createGeminiPrompt = (data) => {
    return `Você é um assistente de inteligência artificial de um cirurgião geral experiente. Sua tarefa é criar um Relatório Cirúrgico formal, conciso e profissional em Português (Brasil), formatado para ser copiado diretamente para um Prontuário Eletrônico do Paciente (PEP).

O relatório deve seguir a seguinte estrutura e ser escrito em terceira pessoa (Ex: "Foi realizada..."). Use terminologia médica precisa.

## DADOS DA CIRURGIA
- **Procedimento:** ${data.procedimento}
- **Abordagem:** ${data.abordagem}
- **Anestesia:** ${data.anestesia}
- **Incisão:** ${data.incisao}
- **Duração:** [Deixe esta linha em branco para o cirurgião preencher a duração]

## ACHADOS E PATOLOGIAS
- ${data.patologias}

## DESCRIÇÃO DETALHADA DO PROCEDIMENTO
- ${data.detalhe_procedimento}
- Inclua a descrição do fechamento da parede/cavidade, detalhando as camadas (ex: Peritônio com Vicryl, Aponeurose com Poligalactina 0, Pele com Mononylon 4-0 ou Grampeador).
- Utilize uma linguagem profissional de descrição cirúrgica.

## MATERIAIS ESPECIAIS E SUTURAS
- **Uso de Material Especial/Prótese:** ${data.material_especial}
- **Fios Especiais/Grampeadores:** ${data.fios_especiais}
- **Drenos:** ${data.drenos}

## COMPLICAÇÕES INTRAOPERATÓRIAS
- ${data.complicacoes}

## ENVIOS
- **Anatomopatológico Solicitado:** ${data.anapat_solicitado}
- **Peça Cirúrgica:** [Nome da peça removida, ex: Apêndice Cecal, Vesícula Biliar, Segmento Intestinal]

Gere a saída completa do relatório, sem introduções ou explicações adicionais, e em um único bloco de texto coeso.`;
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    if (!selectedProcedure) {
      showNotification("Selecione um procedimento primeiro.", "error");
      return;
    }
    
    setIsGenerating(true);
    setReportOutput("Aguardando a resposta da IA... (Pode levar alguns segundos)");
    
    const data = {
      procedimento: selectedProcedure,
      abordagem,
      anestesia,
      patologias,
      incisao,
      complicacoes,
      detalhe_procedimento: detalheProcedimento,
      material_especial: materialEspecial ? (descMaterial || "Não especificado") : "Não utilizado",
      drenos: drenos ? (descDrenos || "Não especificado") : "Não utilizado",
      anapat_solicitado: anapatSolicitado ? "Sim" : "Não",
      fios_especiais: fiosEspeciais ? (descFios || "Não especificado") : "Não utilizado",
    };
    
    const userPrompt = createGeminiPrompt(data);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: userPrompt,
      });

      const generatedText = result || 'Erro: A IA não retornou um relatório válido. Verifique os dados fornecidos.';
      
      setReportOutput(generatedText);
      showNotification("✅ Relatório Gerado com Sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      setReportOutput(`❌ Falha na Geração: Não foi possível obter o relatório. Erro: ${error.message}`);
      showNotification("❌ Falha na Geração. Por favor, tente novamente.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = () => {
    if (reportOutput.includes("O relatório gerado pela IA")) {
      showNotification("Gere um relatório primeiro para poder copiar!", "error");
      return;
    }
    
    navigator.clipboard.writeText(reportOutput).then(() => {
      showNotification("📋 Relatório copiado para a área de transferência!");
    }).catch(() => {
      showNotification("Erro ao copiar. Por favor, selecione e copie manualmente.", "error");
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: '#f7f9fb', fontFamily: 'Inter, sans-serif' }}>
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
          <Alert className={notification.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
            <AlertDescription className={notification.type === "error" ? "text-red-800" : "text-green-800"}>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-10">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-blue-800">
            Assistente de Relatório Cirúrgico (GEMINI-AI)
          </h1>
          <p className="mt-2 text-gray-600">
            Preencha os detalhes para gerar um relatório profissional para o prontuário eletrônico.
          </p>
        </header>

        <form onSubmit={handleGenerateReport} className="space-y-6">
          {/* 1. Procedimento Principal */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Label htmlFor="procedimento" className="text-blue-700 font-semibold">
              1. Selecione o Procedimento de Urgência
            </Label>
            <Select value={selectedProcedure} onValueChange={handleProcedureChange}>
              <SelectTrigger className="w-full mt-1 border-blue-300 focus:ring-blue-500">
                <SelectValue placeholder="-- Escolha um procedimento --" />
              </SelectTrigger>
              <SelectContent>
                {generalSurgeryProcedures.map((proc) => (
                  <SelectItem key={proc} value={proc}>
                    {proc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showDynamicFields && (
            <div className="space-y-6">
              {/* 2. Tipo de Abordagem / Anestesia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="abordagem" className="font-semibold">
                    2. Tipo de Abordagem
                  </Label>
                  <Select value={abordagem} onValueChange={setAbordagem}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Videolaparoscópica">Videolaparoscópica</SelectItem>
                      <SelectItem value="Aberta">Aberta (Convencional)</SelectItem>
                      <SelectItem value="Convertida">Convertida (de Video para Aberta)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="anestesia" className="font-semibold">
                    3. Tipo de Anestesia
                  </Label>
                  <Input
                    id="anestesia"
                    value={anestesia}
                    onChange={(e) => setAnestesia(e.target.value)}
                    placeholder="Ex: Geral, Raquianestesia, Local"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* 4. Achados e Patologias */}
              <div>
                <Label htmlFor="patologias" className="font-semibold">
                  4. Patologias e Achados Encontrados (Sugestões são preenchidas automaticamente)
                </Label>
                <Textarea
                  id="patologias"
                  value={patologias}
                  onChange={(e) => setPatologias(e.target.value)}
                  rows={3}
                  placeholder="Ex: Apêndice cecal edemaciado e perfurado com peritonite localizada."
                  className="mt-1"
                />
              </div>

              {/* 5. Incisão e 6. Complicações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="incisao" className="font-semibold">
                    5. Tipo e Local da Incisão (Sugestão Preenchida)
                  </Label>
                  <Textarea
                    id="incisao"
                    value={incisao}
                    onChange={(e) => setIncisao(e.target.value)}
                    rows={2}
                    placeholder="Ex: Mediana xifopúbica, Portais, McBurney"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="complicacoes" className="font-semibold">
                    6. Complicações Intraoperatórias (se houver)
                  </Label>
                  <Input
                    id="complicacoes"
                    value={complicacoes}
                    onChange={(e) => setComplicacoes(e.target.value)}
                    placeholder="Ex: Sangramento de leito hepático"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* 7. Materiais Especiais / Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="material_especial"
                    checked={materialEspecial}
                    onCheckedChange={setMaterialEspecial}
                  />
                  <Label htmlFor="material_especial" className="text-sm font-medium cursor-pointer">
                    Material Especial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="drenos" checked={drenos} onCheckedChange={setDrenos} />
                  <Label htmlFor="drenos" className="text-sm font-medium cursor-pointer">
                    Uso de Drenos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anapat_solicitado"
                    checked={anapatSolicitado}
                    onCheckedChange={setAnapatSolicitado}
                  />
                  <Label htmlFor="anapat_solicitado" className="text-sm font-medium cursor-pointer">
                    Anatomopatológico Solicitado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fios_especiais"
                    checked={fiosEspeciais}
                    onCheckedChange={setFiosEspeciais}
                  />
                  <Label htmlFor="fios_especiais" className="text-sm font-medium cursor-pointer">
                    Fios Especiais/Grampeador
                  </Label>
                </div>
              </div>

              {/* Campos de detalhe */}
              {materialEspecial && (
                <div>
                  <Label htmlFor="desc_material" className="font-semibold">
                    Detalhe do Material Especial
                  </Label>
                  <Input
                    id="desc_material"
                    value={descMaterial}
                    onChange={(e) => setDescMaterial(e.target.value)}
                    placeholder="Ex: Tela de polipropileno de 10x15cm"
                    className="mt-1"
                  />
                </div>
              )}

              {drenos && (
                <div>
                  <Label htmlFor="desc_drenos" className="font-semibold">
                    Detalhe dos Drenos
                  </Label>
                  <Input
                    id="desc_drenos"
                    value={descDrenos}
                    onChange={(e) => setDescDrenos(e.target.value)}
                    placeholder="Ex: Dreno de Blake 15FR em fundo de saco de Douglas"
                    className="mt-1"
                  />
                </div>
              )}

              {fiosEspeciais && (
                <div>
                  <Label htmlFor="desc_fios" className="font-semibold">
                    Detalhe de Fios/Grampeadores
                  </Label>
                  <Input
                    id="desc_fios"
                    value={descFios}
                    onChange={(e) => setDescFios(e.target.value)}
                    placeholder="Ex: Grampeador linear de 60mm com carga azul"
                    className="mt-1"
                  />
                </div>
              )}

              {/* 9. Detalhe do Procedimento */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="detalhe_procedimento" className="font-semibold">
                    9. Detalhe da Execução da Cirurgia (Passos Chave)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshDetails}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    title="Atualizar Detalhes do Procedimento"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  id="detalhe_procedimento"
                  value={detalheProcedimento}
                  onChange={(e) => setDetalheProcedimento(e.target.value)}
                  rows={5}
                  placeholder="Descreva os passos essenciais e as manobras realizadas"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando... Aguarde
                </>
              ) : (
                "Gerar Relatório Cirúrgico Profissional"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClearForm}
              variant="secondary"
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl text-lg shadow-lg"
            >
              Limpar Formulário
            </Button>
          </div>
        </form>

        {/* Área de Saída do Relatório */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Relatório Gerado (Pronto para Cópia)
          </h2>
          <div className="whitespace-pre-wrap min-h-[150px] bg-white border border-gray-300 rounded-lg p-4 shadow-md text-gray-800 text-base">
            {reportOutput}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              onClick={handleCopyReport}
              disabled={reportOutput.includes("O relatório gerado pela IA")}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar para Prontuário
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}