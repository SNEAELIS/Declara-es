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
async function getBase64ImageFromUrl(imageUrl) {
    try {
        console.log(`Tentando carregar imagem de: ${imageUrl}`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to load image: ${response.status} - ${response.statusText}`);
        const blob = await response.blob();
        console.log('Imagem baixada como blob.');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('Imagem convertida para Base64 com sucesso.');
                resolve(reader.result);
            };
            reader.onerror = (err) => {
                console.error('Erro no FileReader:', err);
                reject(err);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Erro ao carregar imagem de fundo:', error.message);
        return null;
    }
}

// Captura os dados do formulário, incluindo múltiplos espaços físicos
function capturarDadosFormulario() {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const imagens = Array.from(document.getElementById('imagens')?.files || []);
    const descricoes = imagens.map((_, index) => getValue(`descricao${index}`));
    const dataAtual = new Date();
    const diaAtual = String(dataAtual.getDate()).padStart(2, '0');
    const mesAtual = dataAtual.toLocaleString('pt-BR', { month: 'long' });
    const anoAtual = dataAtual.getFullYear();

    // Captura múltiplos espaços físicos dinamicamente
    const espacoFisicoCount = document.querySelectorAll('[id^="nomeEspacoFisico"]').length;
    const espacosFisicos = [];
    for (let i = 0; i < espacoFisicoCount; i++) {
        espacosFisicos.push({
            nome: getValue(`nomeEspacoFisico${i}`) || 'Espaço físico não informado',
            endereco: getValue(`enderecoEspacoFisico${i}`) || 'Endereço do espaço físico não informado'
        });
    }

    return {
        nome: getValue('dirigente') || 'Nome não informado',
        cpf: getValue('cpf') || 'CPF não informado',
        cargoDirigente: getValue('cargoDirigente') || 'Cargo não informado',
        entidade: getValue('entidade') || 'Entidade não informada',
        cep: getValue('cep') || 'CEP não informado',
        cnpj: getValue('cnpj') || 'CNPJ não informado',
        endereco: getValue('endereco') || 'Endereço não informado',
        municipio: getValue('municipio') || 'Município não informado',
        uf: getValue('uf') || 'UF não informada',
        proposta: getValue('proposta') || 'Proposta não informada',
        objeto: getValue('objeto') || 'Objeto não informado',
        valorContrapartida: getValue('valorContrapartida') || 'Valor não informado',
        valorContrapartidaExtenso: getValue('valorContrapartidaExtenso') || 'Valor por extenso não informado',
        leiOrcamentaria: getValue('leiOrcamentaria') || 'Lei não informada',
        diaLei: getValue('diaLei') || 'Dia não informado',
        mesLei: getValue('mesLei') || 'Mês não informado',
        anoLei: getValue('anoLei') || 'Ano não informado',
        orgao: getValue('orgao') || 'Órgão não informado',
        unidade: getValue('unidade') || 'Unidade não informada',
        funcao: getValue('funcao') || 'Função não informada',
        subfuncao: getValue('subfuncao') || 'Subfunção não informada',
        programa: getValue('programa') || 'Programa não informado',
        atividade: getValue('atividade') || 'Atividade não informada',
        naturezaDespesa: getValue('naturezaDespesa') || 'Natureza não informada',
        nomeProjeto: getValue('nomeProjeto') || 'Projeto não informado',
        entidadesParceiras: getValue('entidadesParceiras') || 'Nenhuma entidade parceira',
        periodoVigencia: getValue('periodoVigencia') || 'Período não informado',
        numeroBeneficiados: getValue('numeroBeneficiados') || 'Não informado',
        acoesDesenvolvidas: getValue('acoesDesenvolvidas') || 'Nenhuma ação informada',
        chefeExecutivo: getValue('chefeExecutivo') || 'Chefe do Poder Executivo',
        secretarioFinancas: getValue('secretarioFinancas') || 'Secretário de Finanças',
        imagens,
        descricoes,
        espacosFisicos,
        objetoConvenio: getValue('objeto') || 'Objeto do convênio não informado',
        matricula: getValue('matricula') || 'Matrícula não informada',
        diaAtual,
        mesAtual,
        anoAtual
    };
}

// Substitui placeholders no texto com os dados fornecidos
function substituirPlaceholders(texto, dados) {
    return texto
        .replace(/\[NOME\]/g, dados.nome)
        .replace(/\[CPF\]/g, dados.cpf)
        .replace(/\[UF\]/g, dados.uf)
        .replace(/\[CARGO_DIRIGENTE\]/g, dados.cargoDirigente)
        .replace(/\[ENTIDADE\]/g, dados.entidade)
        .replace(/\[CNPJ\]/g, dados.cnpj)
        .replace(/\[ENDERECO\]/g, dados.endereco)
        .replace(/\[CEP\]/g, dados.cep)
        .replace(/\[MUNICIPIO\]/g, dados.municipio)
        .replace(/\[PROPOSTA\]/g, dados.proposta)
        .replace(/\[OBJETO\]/g, dados.objeto)
        .replace(/\[VALOR_CONTRAPARTIDA\]/g, dados.valorContrapartida)
        .replace(/\[VALOR_CONTRAPARTIDA_EXTENSO\]/g, dados.valorContrapartidaExtenso)
        .replace(/\[LEI_ORCAMENTARIA\]/g, dados.leiOrcamentaria)
        .replace(/\[DIA_LEI\]/g, dados.diaLei)
        .replace(/\[MES_LEI\]/g, dados.mesLei)
        .replace(/\[ANO_LEI\]/g, dados.anoLei)
        .replace(/\[ORGAO\]/g, dados.orgao)
        .replace(/\[UNIDADE\]/g, dados.unidade)
        .replace(/\[FUNCAO\]/g, dados.funcao)
        .replace(/\[SUBFUNCAO\]/g, dados.subfuncao)
        .replace(/\[PROGRAMA\]/g, dados.programa)
        .replace(/\[ATIVIDADE\]/g, dados.atividade)
        .replace(/\[NATUREZA_DESPESA\]/g, dados.naturezaDespesa)
        .replace(/\[NOME_PROJETO\]/g, dados.nomeProjeto)
        .replace(/\[ENTIDADES_PARCEIRAS\]/g, dados.entidadesParceiras)
        .replace(/\[PERIODO_VIGENCIA\]/g, dados.periodoVigencia)
        .replace(/\[NUMERO_BENEFICIADOS\]/g, dados.numeroBeneficiados)
        .replace(/\[ACOES_DESENVOLVIDAS\]/g, dados.acoesDesenvolvidas)
        .replace(/\[CHEFE_EXECUTIVO\]/g, dados.chefeExecutivo)
        .replace(/\[SECRETARIO_FINANCAS\]/g, dados.secretarioFinancas)
        .replace(/\[DIA_ATUAL\]/g, dados.diaAtual)
        .replace(/\[MES_ATUAL\]/g, dados.mesAtual)
        .replace(/\[ANO_ATUAL\]/g, dados.anoAtual)
        .replace(/\[OBJETO_CONVENIO\]/g, dados.objetoConvenio)
        .replace(/\[MATRICULA\]/g, dados.matricula);
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
        const watermarkImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
        if (!watermarkImage) {
            console.warn('Imagem de fundo não carregada. Prosseguindo sem ela.');
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
        const imageContent = imageBase64Array.map((base64, index) => ([
            {
                image: base64,
                width: 200,
                margin: [0, 20, 0, 5],
                alignment: 'center'
            },
            {
                text: dados.descricoes[index] || `Imagem ${index + 1}`,
                fontSize: 12,
                alignment: 'center',
                margin: [0, 5, 0, 20]
            }
        ]));

        // Função para criar conteúdo de uma declaração
        const createDeclarationContent = (declaracao, isLastDeclaration = false) => {
            let content = substituirPlaceholders(declaracao.content, dados);
            let contentArray = [{ text: content, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 40] }];

            // Verifica se é a "DECLARAÇÃO DE TITULARIDADE DO TERRENO" para 00SL_emendas ou 00SL_comissao
            if (['00SL_emendas', '00SL_comissao'].includes(opcao) && declaracao.title === "DECLARAÇÃO DE TITULARIDADE DO TERRENO") {
                const tableData = dados.espacosFisicos.map(espaco => [
                    espaco.nome,
                    espaco.endereco
                ]);
                if (tableData.length > 0) {
                    contentArray = [
                        { 
                            text: content.replace(
                                /Nome do Espaço Físico: \[NOME_ESPACO_FISICO\]; Endereço do Espaço Físico: \[ENDERECO_ESPACO_FISICO\]/,
                                ''
                            ), 
                            alignment: 'justify', 
                            fontSize: 12, 
                            margin: [0, 20, 0, 0] 
                        },
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ text: 'Nome do Espaço Físico', bold: true }, { text: 'Endereço do Espaço Físico', bold: true }],
                                    ...tableData
                                ]
                            },
                            layout: 'lightHorizontalLines',
                            margin: [0, 10, 0, 20]
                        }
                    ];
                }
            }

            return [
                {
                    text: substituirPlaceholders(declaracao.title || '', dados),
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 120, 0, 20]
                },
                ...contentArray,
                {
                    text: `${dados.municipio}/${dados.uf}, ${dados.diaAtual} de ${dados.mesAtual} de ${dados.anoAtual}.`,
                    alignment: 'center',
                    fontSize: 12,
                    margin: [0, 0, 0, 40]
                },
                {
                    text: `__________________________________________\n${dados.nome}\n(${dados.cargoDirigente})`,
                    alignment: 'center',
                    fontSize: 12,
                    margin: [0, 0, 0, 20],
                    pageBreak: isLastDeclaration ? undefined : 'after' // Remove pageBreak da última declaração
                }
            ];
        };

        // Gera o conteúdo comum e específico
        const conteudoComum = declaracoesCompletas.map((declaracao, index) => 
            createDeclarationContent(declaracao, index === declaracoesCompletas.length - 1 && !declaracoesEspecificas[opcao].length && !imageBase64Array.length)
        );
        const conteudoEspecifico = declaracoesEspecificas[opcao].map((declaracao, index) => 
            createDeclarationContent(declaracao, index === declaracoesEspecificas[opcao].length - 1 && !imageBase64Array.length)
        );

        // Consolida todo o conteúdo
        const allContent = [...conteudoComum.flat(), ...conteudoEspecifico.flat(), ...imageContent.flat()];

        // Garante que o último elemento não tenha pageBreak
        if (allContent.length > 0) {
            const lastElement = allContent[allContent.length - 1];
            if (lastElement.pageBreak) {
                delete lastElement.pageBreak;
            }
        }

        // Definição do documento PDF
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [35, 60, 25, 60],
            background: watermarkImage ? [{
                image: watermarkImage,
                width: 595,
                height: 842,
                absolutePosition: { x: 0, y: 0 },
                opacity: 0.9
            }] : [],
            content: allContent,
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    color: '#003087',
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    color: '#003087'
                }
            },
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false
            }
        };

        console.log('Gerando PDF...');
        pdfMake.createPdf(docDefinition).download(`${opcao}_${dados.nome}.pdf`);
        console.log('PDF gerado com sucesso.');
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
}

const declaracoesCompletas = [
    {
        title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que os recursos do presente convênio não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme Art. 167, X, CF/88 e Art. 25, § 1º, III, Lei Complementar nº 101/2000.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO DE NÃO VÍNCULO",
        content: `
        Eu, [NOME], matrícula [MATRICULA], cargo [CARGO_DIRIGENTE], declaro, sob as penas da lei, em especial a do art. 299 do Código Penal Brasileiro,que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [PROPOSTA], não possuem em seu quadro societário, cônjuge ou companheiro, bem como, vínculo de parentesco, colateral ou por afinidade, até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO DE AQUISIÇÃO DE BENS E SERVIÇOS COMUNS\n(Incluindo a contratação de serviços de recursos humanos)",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], no que respeita à aquisição de bens e serviços comuns, declaro o compromisso de:

        1. Realizar Processo Licitatório na modalidade Pregão, em atendimento ao § 2º do Art. 17, da Lei n.º 14.133, de 1º de abril de 2021, Art. 51, da Portaria Conjunta n.º 33, de 30 de agosto de 2023, § 3º do Art. 1º, do Decreto n.º 10.024, de 20 de setembro de 2019 e demais legislações que regem a matéria, inclusive quanto à contratação de recursos humanos, quando for o caso, em conformidade com as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário.

        2. Dar publicidade ao Processo Licitatório, divulgando no Diário Oficial da União, conforme preconiza o Art. 11 do Decreto nº 3.555, de 08 de agosto de 2000 e Art. 20, do Decreto n.º 10.024, de 20 de setembro de 2019.

        3. Consultar e emitir, para posterior inserção no sistema Transferegov, a declaração e certidões citadas no item 3 quando da assinatura do contrato a ser formalizado com as empresas vencedoras do certame ou do registro da nota de empenho quando não ocorrer a celebração do instrumento contratual, a fim de comprovar que no ato de assinatura as empresas estavam idôneas e aptas para contratar com a Administração Pública.

        4. Publicar os editais de licitação para consecução do objeto conveniado somente após a assinatura do respectivo instrumento, conforme Art. 53, da Portaria Conjunta n.º 33, de 30 de agosto de 2023.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro para os devidos fins de celebração de convênios junto ao Ministério do Esporte - MESP, que a proposta inserida no Sistema Transferegov sob o nº [PROPOSTA] e demais informações foram apresentados para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, ficando, portanto, sujeito às sanções civis, administrativas e penais cabíveis no caso de comprovada a falsidade ideológica.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO ao Ministério do Esporte - MESP, que a entidade a qual represento não recebe recursos financeiros de outra entidade para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta Nº [PROPOSTA], cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal da [ENTIDADE], CNPJ Nº [CNPJ], declaro para os devidos fins de celebração do Termo de Convênio, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas - CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO DE COMPROMISSO",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até prestação de contas final.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO DE CUSTOS",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], ATESTO a planilha de custos, bem como as cotações obtidas, conforme Instrução Normativa SEGES/ME n.º 65, de 7 julho de 2021, inseridas no Sistema Eletrônico Transferegov, Proposta n.º [PROPOSTA].

        Ademais, DECLARO que os custos apresentados estão de acordo com os praticados no mercado.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    },
    {
        title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO",
        content: `
        Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO perante o Ministério do Esporte, para fins de celebração de convênio, que o(a) [ENTIDADE], possui condições orçamentárias para arcar com as despesas dela decorrentes e meios que garantam a sustentabilidade do objeto, por se tratar da aquisição de bens de capital.

        Por ser expressão da verdade, firmo a presente declaração.
        `
    }
];

const declaracoesEspecificas = {
    '00SL_emendas': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno de domínio público e pertence ao Município [MUNICIPIO], assim como está disponível, apto e compatível para instalação dos equipamentos.

            Nome do Espaço Físico: [NOME_ESPACO_FISICO]; Endereço do Espaço Físico: [ENDERECO_ESPACO_FISICO]

            Por ser expressão da verdade, firmo a presente declaração.
            `
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, e dá outras providências ao projeto, nos termos da Lei nº 10.098, de 19 de dezembro de 2000 e demais legislações e normativas aplicáveis.
    
            DECLARO, outrossim, sob as penas da lei, estar plenamente ciente do teor e da extensão desta declaração e deter plenos poderes e informações para firmá-la.
    
            Por ser expressão da verdade, firmo a presente declaração.
            `
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de:

            Dispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [PROPOSTA].

            Por ser expressão da verdade, firmo a presente declaração.
            `
        }
    ],
    '20JP_emenda': [],
    '00SL_comissao': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno de domínio público e pertence ao Município [MUNICIPIO], assim como está disponível, apto e compatível para instalação dos equipamentos.

            Nome do Espaço Físico: [NOME_ESPACO_FISICO]; Endereço do Espaço Físico: [ENDERECO_ESPACO_FISICO]

            Por ser expressão da verdade, firmo a presente declaração.
            `
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, e dá outras providências ao projeto, nos termos da Lei nº 10.098, de 19 de dezembro de 2000 e demais legislações e normativas aplicáveis.
    
            DECLARO, outrossim, sob as penas da lei, estar plenamente ciente do teor e da extensão desta declaração e deter plenos poderes e informações para firmá-la.
    
            Por ser expressão da verdade, firmo a presente declaração.
            `
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de:

            Dispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [PROPOSTA].

            Por ser expressão da verdade, firmo a presente declaração.
            `
        }
    ],
    '20JP_comissao': [
        {
            title: "DECLARAÇÃO DE ADIMPLÊNCIA",
            content: `
            Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade:
    
            Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS, com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares).
    
            Por ser expressão da verdade, firmo a presente declaração.
            `
        }
    ]
};