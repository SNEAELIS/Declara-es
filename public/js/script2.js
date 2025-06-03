document.addEventListener('DOMContentLoaded', () => {
    const imagensInput = document.getElementById('imagens');
    const descricaoContainer = document.getElementById('descricaoImagens');

    if (!imagensInput || !descricaoContainer) {
        console.error("Elemento 'imagens' ou 'descricaoImagens' não encontrado.");
        return;
    }

    imagensInput.addEventListener('change', function () {
        descricaoContainer.innerHTML = ''; // Limpa descrições anteriores

        Array.from(this.files).forEach((file, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="form-row">
                    <label for="descricao${index}">Descrição da Imagem ${index + 1}:</label>
                    <textarea id="descricao${index}" rows="2" style="width: 100%;"></textarea>
                </div>
            `;
            descricaoContainer.appendChild(div);
        });
    });
});

// Função para converter imagem em Base64
async function getBase64Image(url) {
    try {
        console.log(`Carregando imagem de: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('Imagem convertida para Base64.');
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Erro ao converter imagem para Base64:', error);
        return null;
    }
}

// Captura os dados do formulário
function capturarDadosFormulario() {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const imagens = Array.from(document.getElementById('imagens')?.files || []);
    const descricoes = imagens.map((_, index) => getValue(`descricao${index}`));

    return {
        nome: getValue('dirigente'),
        cpf: getValue('cpf'),
        rg: getValue('rg'),
        orgaoEmissor: getValue('orgaoEmissor'),
        cargoDirigente: getValue('cargoDirigente'),
        entidade: getValue('entidade'),
        cep: getValue('cep'),
        cnpj: getValue('cnpj'),
        endereco: getValue('endereco'),
        municipio: getValue('municipio'),
        uf: getValue('uf'),
        proposta: getValue('proposta'),
        objeto: getValue('objeto'),
        valorContrapartida: getValue('valorContrapartida'),
        valorContrapartidaExtenso: getValue('valorContrapartidaExtenso'),
        leiOrcamentaria: getValue('leiOrcamentaria'),
        diaLei: getValue('diaLei'),
        mesLei: getValue('mesLei'),
        anoLei: getValue('anoLei'),
        orgao: getValue('orgao'),
        unidade: getValue('unidade'),
        funcao: getValue('funcao'),
        subfuncao: getValue('subfuncao'),
        programa: getValue('programa'),
        atividade: getValue('atividade'),
        naturezaDespesa: getValue('naturezaDespesa'),
        nomeProjeto: getValue('nomeProjeto'),
        entidadesParceiras: getValue('entidadesParceiras'),
        periodoVigencia: getValue('periodoVigencia'),
        numeroBeneficiados: getValue('numeroBeneficiados'),
        acoesDesenvolvidas: getValue('acoesDesenvolvidas'),
        chefeExecutivo: getValue('chefeExecutivo'),
        secretarioFinancas: getValue('secretarioFinancas'),
        imagens,
        descricoes,
        nomeEspacoFisico: getValue('nomeEspacoFisico'), 
        enderecoEspacoFisico: getValue('enderecoEspacoFisico'),
        objeto: getValue('objeto'), 
    };
}

// Substitui placeholders no texto com os dados fornecidos
function substituirPlaceholders(texto, dados) {
    const dataAtual = new Date();
    const diaAtual = String(dataAtual.getDate()).padStart(2, '0');
    const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });
    const anoAtual = dataAtual.getFullYear();

    return texto
        .replace(/\[NOME\]/g, dados.nome || '')
        .replace(/\[CPF\]/g, dados.cpf || '')
        .replace(/\[RG\]/g, dados.rg || '')
        .replace(/\[ORGAO_EMISSOR\]/g, dados.orgaoEmissor || '')
        .replace(/\[UF\]/g, dados.uf || '')
        .replace(/\[CARGO_DIRIGENTE\]/g, dados.cargoDirigente || '')
        .replace(/\[ENTIDADE\]/g, dados.entidade || '')
        .replace(/\[CNPJ\]/g, dados.cnpj || '')
        .replace(/\[ENDERECO\]/g, dados.endereco || '')
        .replace(/\[CEP\]/g, dados.cep || '')
        .replace(/\[MUNICIPIO\]/g, dados.municipio || '')
        .replace(/\[PROPOSTA\]/g, dados.proposta || '')
        .replace(/\[OBJETO\]/g, dados.objeto || '')
        .replace(/\[VALOR_CONTRAPARTIDA\]/g, dados.valorContrapartida || '')
        .replace(/\[VALOR_CONTRAPARTIDA_EXTENSO\]/g, dados.valorContrapartidaExtenso || '')
        .replace(/\[LEI_ORCAMENTARIA\]/g, dados.leiOrcamentaria || '')
        .replace(/\[DIA_LEI\]/g, dados.diaLei || '')
        .replace(/\[MES_LEI\]/g, dados.mesLei || '')
        .replace(/\[ANO_LEI\]/g, dados.anoLei || '')
        .replace(/\[ORGAO\]/g, dados.orgao || '')
        .replace(/\[UNIDADE\]/g, dados.unidade || '')
        .replace(/\[FUNCAO\]/g, dados.funcao || '')
        .replace(/\[SUBFUNCAO\]/g, dados.subfuncao || '')
        .replace(/\[PROGRAMA\]/g, dados.programa || '')
        .replace(/\[ATIVIDADE\]/g, dados.atividade || '')
        .replace(/\[NATUREZA_DESPESA\]/g, dados.naturezaDespesa || '')
        .replace(/\[NOME_PROJETO\]/g, dados.nomeProjeto || '')
        .replace(/\[ENTIDADES_PARCEIRAS\]/g, dados.entidadesParceiras || '')
        .replace(/\[PERIODO_VIGENCIA\]/g, dados.periodoVigencia || '')
        .replace(/\[NUMERO_BENEFICIADOS\]/g, dados.numeroBeneficiados || '')
        .replace(/\[ACOES_DESENVOLVIDAS\]/g, dados.acoesDesenvolvidas || '')
        .replace(/\[CHEFE_EXECUTIVO\]/g, dados.chefeExecutivo || 'Chefe do Poder Executivo')
        .replace(/\[SECRETARIO_FINANCAS\]/g, dados.secretarioFinancas || 'Secretário de Finanças')
        .replace(/\[DIA_ATUAL\]/g, diaAtual)
        .replace(/\[MES_ATUAL\]/g, mesAtual)
        .replace(/\[ANO_ATUAL\]/g, anoAtual)
        .replace(/\[NOME_ESPACO_FISICO\]/g, dados.nomeEspacoFisico || '') 
        .replace(/\[ENDERECO_ESPACO_FISICO\]/g, dados.enderecoEspacoFisico || '')
        .replace(/\[OBJETO_CONVENIO\]/g, dados.objeto || '');
}

// Evento para o botão de gerar PDF
document.addEventListener('DOMContentLoaded', () => {
    const gerarPDFButton = document.getElementById('gerarPDF');
    if (!gerarPDFButton) {
        console.error("Elemento 'gerarPDF' não encontrado.");
        return;
    }
    gerarPDFButton.addEventListener('click', gerarPDF);
});

async function gerarPDF() {
    try {
        const dados = capturarDadosFormulario();
        const opcao = document.getElementById('opcaoSelecao')?.value;

        if (!opcao || !declaracoesEspecificas[opcao]) {
            alert('Selecione uma opção válida antes de gerar o PDF.');
            return;
        }

        // Carrega a imagem de fundo
        const backgroundImage = await getBase64Image('../images/Declarações _page-0001.jpg');
        if (!backgroundImage) {
            alert('Erro ao carregar a imagem de fundo.');
            return;
        }

        // Converte as imagens enviadas para Base64
        const imageBase64Array = await Promise.all(
            dados.imagens.map(file => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }))
        );

        // Cria o conteúdo das imagens com descrições
        const imageContent = imageBase64Array.map((base64, index) => ({
            stack: [
                { image: base64, width: 200, margin: [0, 10, 0, 10] },
                { text: dados.descricoes[index] || `Imagem ${index + 1}`, alignment: 'center', fontSize: 10 }
            ],
            pageBreak: 'after'
        }));

        // Gera o conteúdo comum com margem superior de 50px (37.5pt)
        const conteudoComum = declaracoesCompletas.map(declaracao => ({
            stack: [
                { 
                    text: declaracao.title || '', 
                    style: 'header', 
                    margin: [0, 37.5, 0, 10] 
                },
                { 
                    text: substituirPlaceholders(declaracao.content, dados), 
                    style: 'normalJustify' // Usando estilo com alinhamento justificado
                }
            ],
            pageBreak: 'after'
        }));

        // Gera o conteúdo específico com margem superior de 50px (37.5pt)
        const conteudoEspecifico = declaracoesEspecificas[opcao].map(declaracao => ({
            stack: [
                        { 
                            text: declaracao.title, 
                            style: 'header', 
                            margin: [0, 37.5, 0, 10] 
                        },
                        { 
                            text: substituirPlaceholders(declaracao.content, dados), 
                            style: 'importance'
                        }
                    ],
                    pageBreak: 'after'
                }));

                // Definição do documento PDF
                const docDefinition = {
            pageSize: 'A4',
            pageMargins: [20, 20, 20, 20], // Reduced margins from [40, 40, 40, 40]
            content: [...conteudoComum, ...conteudoEspecifico, ...imageContent],
            styles: {
                header: { 
                    fontSize: 14, // Reduced from 16
                    bold: true, 
                    alignment: 'center' 
                },
                normal: { 
                    fontSize: 10, // Reduced from 12
                    lineHeight: 1.2 // Reduced from 1.5
                },
                normalJustify: { 
                    fontSize: 10, // Reduced from 12
                    lineHeight: 1.2, // Reduced from 1.5
                    alignment: 'justify'
                },
                importance: {
                    fontSize: 10, // Reduced from 12
                    bold: true,
                    alignment: 'justify'
                }
            },
            background: (currentPage, pageSize) => ({
                image: backgroundImage,
                width: pageSize.width,
                height: pageSize.height,
                absolutePosition: { x: 0, y: 0 },
                opacity: 0.9
            })
        };

        console.log('Gerando PDF...');
        pdfMake.createPdf(docDefinition).download(`${opcao}.pdf`);
        console.log('PDF gerado com sucesso.');
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
}

const declaracoesCompletas = [
    {
        title: "DECLARAÇÃO DE DISPONIBILIDADE DE CONTRAPARTIDA",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, em conformidade com a Lei de Diretrizes Orçamentárias vigente, que a presente Entidade dispõe e se compromete com o montante financeiro de R$ [VALOR_CONTRAPARTIDA] ([VALOR_CONTRAPARTIDA_EXTENSO]), referente a contrapartida financeira destinada ao cumprimento do objeto constante da Proposta n.º [PROPOSTA], do Sistema Transferegov.

        Os recursos estão disponíveis na Lei Orçamentária Municipal/Estadual nº [LEI_ORCAMENTARIA], de [DIA_LEI] de [MES_LEI] de [ANO_LEI], conforme rubrica orçamentária abaixo especificada, e cópia anexa:

        Órgão: [ORGAO]
        Unidade: [UNIDADE]
        Função: [FUNCAO]
        Subfunção: [SUBFUNCAO]
        Programa: [PROGRAMA]
        Atividade: [ATIVIDADE]
        Natureza da despesa: [NATUREZA_DESPESA]

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ___________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    }, 
    {
        title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que os recursos do presente convênio não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme Art. 167, X, CF/88 e Art. 25, § 1º, III, Lei Complementar nº 101/2000.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ______________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE NÃO VÍNCULO",
        content: `
        Eu, [NOME], CPF [CPF], RG [RG], expedido pelo [ORGAO_EMISSOR]/[UF], cargo [CARGO_DIRIGENTE], declaro, sob as penas da lei, em especial a do art. 299 do Código Penal Brasileiro, na qualidade de representante legal do Proponente, que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [PROPOSTA], não possuem em seu quadro societário, cônjuge ou companheiro, bem como, vínculo de parentesco, colateral ou por afinidade, até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ____________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE AQUISIÇÃO DE BENS E SERVIÇOS COMUNS (incluindo a contratação de serviços de recursos humanos)",
    content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], no que respeita à aquisição de bens e serviços comuns, declaro o compromisso de:

        1. Realizar Processo Licitatório na modalidade Pregão, em atendimento ao § 2º do Art. 17, da Lei n.º 14.133, de 1º de abril de 2021, Art. 51, da Portaria Conjunta n.º 33, de 30 de agosto de 2023, § 3º do Art. 1º, do Decreto n.º 10.024, de 20 de setembro de 2019 e demais legislações que regem a matéria, inclusive quanto à contratação de recursos humanos, quando for o caso, em conformidade com as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário.

        2. Dar publicidade ao Processo Licitatório, divulgando no Diário Oficial da União, conforme preconiza o Art. 11 do Decreto nº 3.555, de 08 de agosto de 2000 e Art. 20, do Decreto n.º 10.024, de 20 de setembro de 2019.

        3. Consultar e emitir, para posterior inserção no sistema Transferegov, a declaração e certidões citadas no item 3 quando da assinatura do contrato a ser formalizado com as empresas vencedoras do certame ou do registro da nota de empenho quando não ocorrer a celebração do instrumento contratual, a fim de comprovar que no ato de assinatura as empresas estavam idôneas e aptas para contratar com a Administração Pública.

        4. Publicar os editais de licitação para consecução do objeto conveniado somente após a assinatura do respectivo instrumento, conforme Art. 53, da Portaria Conjunta n.º 33, de 30 de agosto de 2023.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        \n\n__________________________________________________\n\n

        [NOME]\n
        [CARGO_DIRIGENTE]
    `
    },
    {
        title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro para os devidos fins de celebração de convênios e na qualidade de representante legal do proponente junto ao Ministério do Esporte - MESP, que a proposta inserida no Sistema Transferegov sob o nº [PROPOSTA] e demais informações foram apresentados para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, ficando, portanto, sujeito às sanções civis, administrativas e penais cabíveis no caso de comprovada a falsidade ideológica.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ____________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO ao Ministério do Esporte - MESP, que a entidade a qual represento não recebe recursos financeiros de outra entidade para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta Nº [PROPOSTA], cadastrada no Sistema Eletrônico Transferegov, para [OBJETO_CONVENIO], evitando desta forma a sobreposição de recursos.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ___________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
    title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA",
    content: `
    Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal da [ENTIDADE], CNPJ nº [CNPJ], declaro para os devidos fins de celebração do Termo de Convênio, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas - CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.

    Por ser expressão da verdade, firmo a presente declaração.

    [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

    ___________________________________________________

    [NOME]
    [CARGO_DIRIGENTE]
    `
    },
    {
        title: "DECLARAÇÃO DE COMPROMISSO",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até prestação de contas final.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ___________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE CUSTOS",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], ATESTO a planilha de custos, bem como as cotações obtidas, conforme Instrução Normativa SEGES/ME n.º 65, de 7 julho de 2021, inseridas no Sistema Eletrônico Transferegov, Proposta n.º [PROPOSTA].

        Ademais, DECLARO que os custos apresentados estão de acordo com os praticados no mercado.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ________________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE ADIMPLÊNCIA",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade:

        Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS, com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares).

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        _____________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, e dá outras providências ao projeto, nos termos da Lei nº 10.098, de 19 de dezembro de 2000 e demais legislações e normativas aplicáveis.

        DECLARO, outrossim, sob as penas da lei, estar plenamente ciente do teor e da extensão desta declaração e deter plenos poderes e informações para firmá-la.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ___________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO perante o Ministério do Esporte, para fins de celebração de convênio, que o(a) [ENTIDADE], possui condições orçamentárias para arcar com as despesas dela decorrentes e meios que garantem a sustentabilidade do objeto, por se tratar da aquisição de bens de capital.

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        ___________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
    {
        title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
        content: `
        Eu, [NOME], portador da carteira de identidade nº [RG], expedida pelo [ORGAO_EMISSOR]/[UF], CPF [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de:

        Dispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [PROPOSTA].

        Por ser expressão da verdade, firmo a presente declaração.

        [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

        _________________________________________________________

        [NOME]
        [CARGO_DIRIGENTE]
        `
    },
];

// Declarações específicas por opção
const declaracoesEspecificas = {
    '00SL_emendas': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `
                PAPEL TIMBRADO DA ENTIDADE PROPONENTE

                Eu, [NOME], matrícula [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno de domínio público e pertence ao Município [MUNICIPIO], assim como está disponível, apto e compatível para instalação dos equipamentos.

                Nome do Espaço Físico\tEndereço do Espaço Físico
                [NOME_ESPACO_FISICO]\t[ENDERECO_ESPACO_FISICO]

                [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

                _________________________________________________________
                [NOME]
                [CARGO_DIRIGENTE]
            `
        },
    ],
    '20JP_emenda': [

    ],
    '00SL_comissao': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `
                PAPEL TIMBRADO DA ENTIDADE PROPONENTE

                Eu, [NOME], matrícula [CPF], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno de domínio público e pertence ao Município [MUNICIPIO], assim como está disponível, apto e compatível para instalação dos equipamentos.

                Nome do Espaço Físico\tEndereço do Espaço Físico
                [NOME_ESPACO_FISICO]\t[ENDERECO_ESPACO_FISICO]

                [MUNICIPIO], [DIA_ATUAL] de [MES_ATUAL] de [ANO_ATUAL]

                _________________________________________________________
                [NOME]
                [CARGO_DIRIGENTE]
            `
        },

    ],
    '20JP_comissao': [
      
    ]
};