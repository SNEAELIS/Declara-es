let isGeneratingPDF = false;
let letterheadImage = null; // Changed to let to allow reassignment

let declaracoesCompletas = [
    {
        title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro, sob as penas da lei, que os recursos oriundos do presente convênio, celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [proposta], não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e dos Municípios, conforme disposto no Art. 167, inciso X, da Constituição Federal de 1988 (CF/88) e no Art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal). Ressalto que esta declaração visa assegurar a correta aplicação dos recursos públicos, estando ciente das sanções administrativas, civis e penais aplicáveis em caso de descumprimento.`
    },
    {
        title: "DECLARAÇÃO DE NÃO VÍNCULO",
        content: `Eu, [dirigente], matrícula [matricula], cargo [cargoDirigente], declaro, sob as penas da lei, especialmente o art. 299 do Código Penal Brasileiro, que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [proposta], não possuem em seu quadro societário, cônjuge ou companheiro, bem como vínculo de parentesco, colateral ou por afinidade até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil, com qualquer dirigente, servidor ou empregado da [entidade] ou do Ministério do Esporte. Esta declaração é prestada com base em pesquisa documental e está sujeita a verificação, sendo de minha responsabilidade a veracidade das informações fornecidas.`
    },
    {
        title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro, para os devidos fins de celebração de convênios junto ao Ministério do Esporte - MESP, que a proposta inserida no Sistema Eletrônico Transferegov sob o nº [proposta], juntamente com todas as informações e documentações anexas, foi apresentada para apreciação exclusivamente junto a esse órgão e em nenhum outro ente da administração pública federal, estadual ou municipal. Esta declaração visa evitar duplicidade de financiamentos e está sujeita às sanções civis, administrativas e penais cabíveis, nos termos da Lei nº 8.666/1993 e da Lei nº 14.133/2021 (Nova Lei de Licitações), caso seja comprovada falsidade ideológica ou omissão de informações.`
    },
    {
        title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], DECLARO ao Ministério do Esporte - MESP que a entidade a qual represento não recebe, atualmente ou no período de vigência da Proposta nº [proposta], recursos financeiros de outra entidade pública ou privada para a mesma finalidade das ações apresentadas e especificadas no Plano de Trabalho cadastrado no Sistema Eletrônico Transferegov. Esta afirmação tem como objetivo evitar sobreposição de recursos e garantir a economicidade dos fundos públicos, estando ciente das penalidades previstas em caso de descumprimento, conforme a legislação aplicável.`
    },
    {
        title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal da [entidade], CNPJ № [cnpj], declaro, para os devidos fins de celebração do Termo de Convênio com o Ministério do Esporte - MESP, que a presente Entidade não contratará, com os recursos provenientes desta parceria sob a Proposta nº [proposta], empresas que: (i) integrem o mesmo grupo econômico; (ii) possuam participação societária cruzada; (iii) pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da [entidade]; (iv) compartilhem o mesmo endereço, telefone ou CNPJ; (v) apresentem incompatibilidade entre a classificação de atividades econômicas (CNAE) e o objeto contratado. Além disso, asseguro que as cotações dos itens previstos no Plano de Trabalho foram obtidas de forma transparente, com documentos comprobatórios arquivados, e que me responsabilizo pela veracidade e conformidade das pesquisas de preços junto aos fornecedores, nos termos da Instrução Normativa SEGES/ME nº 65/2021.`
    },
    {
        title: "DECLARAÇÃO DE COMPROMISSO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro o compromisso de disponibilizar e manter atualizados os recursos informatizados necessários ao acesso contínuo ao Sistema Eletrônico Transferegov, incluindo hardware, software e conexão à internet, para alimentar, atualizar e acompanhar de forma permanente o sistema durante todo o período de formalização da parceria, execução do objeto e prestação de contas final. Este compromisso está alinhado às exigências da Portaria Interministerial nº 424/2016 e demais normativas vigentes, sendo de minha responsabilidade garantir o cumprimento dessas obrigações.`
    },
    {
        title: "DECLARAÇÃO DE CUSTOS",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], ATESTO a planilha de custos e as cotações de preços obtidas, elaboradas em conformidade com a Instrução Normativa SEGES/ME nº 65, de 7 de julho de 2021, e inseridas no Sistema Eletrônico Transferegov sob a Proposta nº [proposta]. Declaro que os valores apresentados foram apurados com base em pesquisa de mercado realizada junto a, no mínimo, três fornecedores, refletindo preços praticados no setor e compatíveis com a natureza dos bens e serviços contratados. Ressalto que os documentos comprobatórios, incluindo orçamentos e cotações, estão arquivados e disponíveis para fiscalização, e que me responsabilizo pela veracidade e adequação dos dados apresentados, sob pena de sanções administrativas e legais aplicáveis.`
    },
    {
        title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], DECLARO perante o Ministério do Esporte, para fins de celebração de convênio sob a Proposta nº [proposta], que o(a) [entidade] possui condições orçamentárias e financeiras para arcar com as despesas decorrentes da execução do objeto, incluindo custos de manutenção, operação e eventuais contingências, garantindo a sustentabilidade do projeto ao longo de sua vigência. Esta declaração considera a aquisição de bens de capital e está respaldada por planejamento orçamentário documentado, estando ciente das responsabilidades previstas na Lei nº 4.320/1964 e na Lei Complementar nº 101/2000.`
    }
];

let declaracoesEspecificas = {
    '00SL_emendas': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro que o terreno destinado à execução do objeto da Proposta nº [proposta] é de domínio público e pertence ao Município de [municipio]/[uf], estando plenamente disponível, apto e compatível para a instalação dos equipamentos previstos. Informo que:\n\n- Nome do Espaço Físico: [nomeEspacoFisico];\n- Endereço do Espaço Físico: [enderecoEspacoFisico];\n- Área total: [areaTotal] m² (se aplicável).\n\nEsta declaração é prestada com base em documentação oficial arquivada, e me comprometo a apresentar os títulos de propriedade ou atos administrativos comprobatórios, caso solicitados, nos termos da Lei nº 8.666/1993.`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], DECLARO que serão garantidos os meios necessários para assegurar a acessibilidade de pessoas com deficiência ou com mobilidade reduzida ao projeto objeto da Proposta nº [proposta], em conformidade com a Lei nº 10.098, de 19 de dezembro de 2000, o Decreto nº 5.296/2004 e a Norma Brasileira de Acessibilidade (NBR 9050). Comprometo-me a implementar rampas, sinalizações táteis, banheiros adaptados e demais adaptações exigidas, estando ciente de que a não conformidade sujeitará a [entidade] às sanções previstas na legislação. Declaro, outrossim, sob as penas da lei, deter plenos poderes e informações para firmar esta declaração.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro o compromisso de dispor de recursos financeiros próprios ou de outras fontes lícitas, não vinculados à Proposta nº [proposta], para custear integralmente a instalação dos equipamentos pactuados, incluindo mão de obra, materiais complementares e eventuais despesas imprevistas. Esta declaração está respaldada por planejamento orçamentário documentado, e me responsabilizo por garantir a execução das obras no prazo estipulado, sob pena de inadimplemento contratual.`
        }
    ],
    '00SL_comissao': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro que o terreno destinado à execução do objeto da Proposta nº [proposta] é de domínio público e pertence ao Município de [municipio]/[uf], estando plenamente disponível, apto e compatível para a instalação dos equipamentos previstos. Informo que:\n\n- Nome do Espaço Físico: [nomeEspacoFisico];\n- Endereço do Espaço Físico: [enderecoEspacoFisico];\n- Área total: [areaTotal] m² (se aplicável).\n\nEsta declaração é prestada com base em documentação oficial arquivada, e me comprometo a apresentar os títulos de propriedade ou atos administrativos comprobatórios, caso solicitados, nos termos da Lei nº 8.666/1993.`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], DECLARO que serão garantidos os meios necessários para assegurar a acessibilidade de pessoas com deficiência ou com mobilidade reduzida ao projeto objeto da Proposta nº [proposta], em conformidade com a Lei nº 10.098, de 19 de dezembro de 2000, o Decreto nº 5.296/2004 e a Norma Brasileira de Acessibilidade (NBR 9050). Comprometo-me a implementar rampas, sinalizações táteis, banheiros adaptados e demais adaptações exigidas, estando ciente de que a não conformidade sujeitará a [entidade] às sanções previstas na legislação. Declaro, outrossim, sob as penas da lei, deter plenos poderes e informações para firmar esta declaração.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], declaro o compromisso de dispor de recursos financeiros próprios ou de outras fontes lícitas, não vinculados à Proposta nº [proposta], para custear integralmente a instalação dos equipamentos pactuados, incluindo mão de obra, materiais complementares e eventuais despesas imprevistas. Esta declaração está respaldada por planejamento orçamentário documentado, e me responsabilizo por garantir a execução das obras no prazo estipulado, sob pena de inadimplemento contratual.`
        }
    ],
    '20JP_emenda': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], no que diz respeito à contratação de recursos humanos para a execução da Proposta nº [proposta], declaro ter ciência de que:\n\n1. A forma de contratação deverá ser analisada e aprovada pela Consultoria Jurídica da Entidade Convenente, observando as orientações contidas no Acórdão nº 2588/2017 – TCU – Plenário, na Portaria Conjunta MGI/MF/AGU nº 33, de 30 de agosto de 2023, e na Lei nº 14.133/2021 (Nova Lei de Licitações).\n\n2. O repasse de recursos financeiros para custeio desta ação, incluindo pagamento de profissionais e encargos sociais/trabalhistas, seguirá os valores e percentuais aprovados no Plano de Trabalho da Proposta nº [proposta]. Caso os encargos sociais ou trabalhistas excedam o limite estipulado, a [entidade] arcará com o diferencial, sem ônus para o convenente.\n\n3. O pagamento será realizado mensalmente, conforme pactuado, observadas as seguintes condições:\n   - Pagamento dos Profissionais: efetuado no mês subsequente à prestação dos serviços, mediante comprovação documental;\n   - Pagamento dos Encargos Sociais e/ou Trabalhistas: acompanhará a periodicidade dos pagamentos aos recursos humanos vinculados, com recolhimento tempestivo aos órgãos competentes.\n\nDeclaro estar ciente de que o descumprimento destas condições poderá acarretar a suspensão do repasse de recursos e a aplicação de sanções administrativas.`
        }
    ],
    '20JP_comissao': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], no que diz respeito à contratação de recursos humanos para a execução da Proposta nº [proposta], declaro ter ciência de que:\n\n1. A forma de contratação deverá ser analisada e aprovada pela Consultoria Jurídica da Entidade Convenente, observando as orientações contidas no Acórdão nº 2588/2017 – TCU – Plenário, na Portaria Conjunta MGI/MF/AGU nº 33, de 30 de agosto de 2023, e na Lei nº 14.133/2021 (Nova Lei de Licitações).\n\n2. O repasse de recursos financeiros para custeio desta ação, incluindo pagamento de profissionais e encargos sociais/trabailistas, seguirá os valores e percentuais aprovados no Plano de Trabalho da Proposta nº [proposta]. Caso os encargos sociais ou trabalhistas excedam o limite estipulado, a [entidade] arcará com o diferencial, sem ônus para o convenente.\n\n3. O pagamento será realizado mensalmente, conforme pactuado, observadas as seguintes condições:\n   - Pagamento dos Profissionais: efetuado no mês subsequente à prestação dos serviços, mediante comprovação documental;\n   - Pagamento dos Encargos Sociais e/ou Trabalhistas: acompanhará a periodicidade dos pagamentos aos recursos humanos vinculados, com recolhimento tempestivo aos órgãos competentes.\n\nDeclaro estar ciente de que o descumprimento destas condições poderá acarretar a suspensão do repasse de recursos e a aplicação de sanções administrativas.`
        },
        {
            title: "DECLARAÇÃO DE ADIMPLÊNCIA",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ № [cnpj], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade não está inadimplente com a União, incluindo, mas não se limitando a, contribuições previstas nos artigos 195 e 239 da Constituição Federal (seguridade social, PIS/PASEP e FGTS), bem como obrigações decorrentes de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições e auxílios previamente celebrados com a Administração Pública Federal. Esta declaração está baseada em certidões negativas atualizadas, arquivadas na [entidade], e me comprometo a apresentá-las quando requisitadas, nos termos da Lei nº 14.133/2021.`
        }
    ]
};

/**
 * Substitui placeholders no texto com os dados fornecidos.
 * @param {string} texto - Texto com placeholders.
 * @param {object} dados - Dados para substituição.
 * @returns {string} Texto com placeholders substituídos.
 */
function substituirPlaceholders(texto, dados) {
    const dataAtual = new Date();
    return texto
        .replace(/\[dirigente]/g, dados.dirigente || 'Nome não informado')
        .replace(/\[matricula]/g, dados.matricula || 'Matrícula não informada')
        .replace(/\[cargoDirigente]/g, dados.cargoDirigente || 'Cargo não informado')
        .replace(/\[entidade]/g, dados.entidade || 'Entidade não informada')
        .replace(/\[cnpj]/g, dados.cnpj || 'CNPJ não informado')
        .replace(/\[endereco]/g, dados.endereco || 'Endereço não informado')
        .replace(/\[uf]/g, dados.uf || 'UF não informada')
        .replace(/\[municipio]/g, dados.municipio || 'Município não informado')
        .replace(/\[cep]/g, dados.cep || 'CEP não informado')
        .replace(/\[proposta]/g, dados.proposta || 'Proposta não informada')
        .replace(/\[diaAtual]/g, String(dataAtual.getDate()).padStart(2, '0'))
        .replace(/\[mesAtual]/g, dataAtual.toLocaleString('pt-BR', { month: 'long' }))
        .replace(/\[anoAtual]/g, dataAtual.getFullYear())
        .replace(/\[nomeEspacoFisico]/g, dados.espacosFisicos[0]?.nome || 'Nome não informado')
        .replace(/\[enderecoEspacoFisico]/g, dados.espacosFisicos[0]?.endereco || 'Endereço não informado')
        .replace(/\[areaTotal]/g, dados.espacosFisicos[0]?.areaTotal || 'Área não informada');
}

/**
 * Converte um número para extenso em português (até 100).
 * @param {number} num - Número a converter.
 * @returns {string} Número em extenso.
 */
function numeroParaExtenso(num) {
    const unidades = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    if (num < 20) return unidades[num];
    if (num < 100) return dezenas[Math.floor(num / 10)] + (num % 10 !== 0 ? ' e ' + unidades[num % 10] : '');
    return num.toString();
}

/**
 * Carrega uma imagem externa ou um arquivo local e retorna como dataURL.
 * @param {string|File} source - URL da imagem ou um objeto File.
 * @returns {Promise<string>} DataURL da imagem.
 */
async function carregarImagemComoDataURL(source) {
    return new Promise((resolve, reject) => {
        if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erro ao carregar o arquivo de imagem.'));
            reader.readAsDataURL(source);
        } else if (typeof source === 'string') {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Crucial for loading images from different origins onto canvas
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg')); // Use jpeg for potentially smaller size
            };
            img.onerror = () => reject(new Error('Falha ao carregar a imagem da URL: ' + source));
            img.src = source;
        } else {
            reject(new Error('Formato de fonte de imagem inválido. Esperado URL ou File.'));
        }
    });
}

/**
 * Gera o PDF com base nos dados do formulário.
 * @param {object} formData - Dados capturados do formulário.
 * @param {boolean} isPreview - Indica se é uma pré-visualização.
 * @param {string|null} letterheadImageBase64 - Imagem de fundo do papel timbrado em Base64 (opcional).
 * @param {object} layoutOptions - Opções de layout (margens em pontos).
 * @returns {object|undefined} DocDefinition para preview ou undefined para download.
 */
async function gerarPDF(formData, isPreview = false, letterheadImageBase64 = null, layoutOptions = {}) {
    if (isGeneratingPDF && !isPreview) return; // Prevent multiple download attempts

    isGeneratingPDF = true;
    // Show loading indicator
    document.getElementById('loadingMessage').style.display = 'flex';

    const dados = {
        ...formData,
        diaAtual: String(new Date().getDate()).padStart(2, '0'),
        mesAtual: new Date().toLocaleString('pt-BR', { month: 'long' }),
        anoAtual: new Date().getFullYear()
    };

    try {
        const erros = validarDadosFormulario(dados);
        if (erros.length > 0) {
            exibirMensagemErro(`Erro: ${erros.join(' ')}`);
            return isPreview ? {} : undefined;
        }

        let finalLetterheadImage = letterheadImageBase64;
        // If no letterhead is selected by user AND no image is provided (e.g., for initial preview), load default.
        if (!dados.usarPapelTimbrado && !finalLetterheadImage) {
            try {
                finalLetterheadImage = await carregarImagemComoDataURL('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
            } catch (error) {
                exibirMensagemErro('Erro ao carregar a imagem padrão: ' + error.message);
                return undefined;
            }
        }
        // If user wants custom letterhead but hasn't uploaded one yet (and it's not a preview using an existing one)
        else if (dados.usarPapelTimbrado && !finalLetterheadImage && !isPreview) {
            exibirMensagemErro('Por favor, selecione um arquivo de papel timbrado.');
            return undefined;
        }

        // Default layout values in POINTS (for pdfmake)
        const defaultLayoutPoints = {
            leftRightMargin: 40,
            topMargin: 60,
            // footerHeight here defines the 'bottom' page margin in PDFMake.
            // A common design is to have the footer content appear, say, 1.5 cm from the physical bottom edge.
            // If the footer content itself takes ~0.5 cm, then the total bottom margin (footerHeight) should be ~2 cm.
            // Let's use the input 'footerMarginBottomCm' to directly set this pageMargins[3] value.
            footerAreaFromBottom: 60 // Roughly 2.12 cm from bottom edge.
        };
        
        // Calculate actual layout options. layoutOptions are expected in points.
        const actualLayout = { ...defaultLayoutPoints, ...layoutOptions };

        // Ensure margins are within allowed ranges (values are already in points from updatePreview)
        actualLayout.topMargin = Math.min(actualLayout.topMargin, 198.425); // Max 7cm in points
        actualLayout.footerAreaFromBottom = Math.max(actualLayout.footerAreaFromBottom, 28.3465); // Min 1cm in points

        let declaracoesParaIncluir = [
            ...declaracoesCompletas.filter(decl => {
                const ehSustentabilidade = decl.title === "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO";
                const condicaoSustentabilidade = dados.opcaoSelecao.startsWith('00SL') || dados.opcaoSelecao.startsWith('20JP');
                return !ehSustentabilidade || condicaoSustentabilidade;
            }),
            ...(declaracoesEspecificas[dados.opcaoSelecao.replace(/_timbrado$/, '')] || [])
        ];

        const createDeclarationContent = (declaracao, isLastDeclaration = false) => {
            let content = substituirPlaceholders(declaracao.content, dados);
            let contentArray = [{ text: content, alignment: 'justify', fontSize: 12, margin: [0, 10, 0, 20] }];

            if (['00SL_emendas', '00SL_comissao'].includes(dados.opcaoSelecao.replace(/_timbrado$/, '')) && declaracao.title === "DECLARAÇÃO DE TITULARIDADE DO TERRENO" && dados.espacosFisicos.length > 0) {
                contentArray = [
                    // Remove the old inline placeholder part before adding the table
                    { text: content.replace(/Informo que:\n\n- Nome do Espaço Físico:.*?(?:- Área total:.*?(?=\n|$))?/s, '').trim(), alignment: 'justify', fontSize: 12, margin: [0, 10, 0, 5] },
                    {
                        table: {
                            widths: ['*', '*', '*'],
                            body: [
                                [{ text: 'Nome do Espaço Físico', bold: true, fontSize: 10 }, { text: 'Endereço do Espaço Físico', bold: true, fontSize: 10 }, { text: 'Área Total (m²)', bold: true, fontSize: 10 }],
                                ...dados.espacosFisicos.map(espaco => [
                                    { text: espaco.nome, fontSize: 10 },
                                    { text: espaco.endereco, fontSize: 10 },
                                    { text: espaco.areaTotal || 'Não informada', fontSize: 10 }
                                ])
                            ]
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
                            vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0.5,
                            hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? '#003087' : '#cccccc',
                            vLineColor: (i, node) => (i === 0 || i === node.table.widths.length) ? '#003087' : '#cccccc',
                            paddingLeft: (i, node) => 5,
                            paddingRight: (i, node) => 5,
                            paddingTop: (i, node) => 5,
                            paddingBottom: (i, node) => 5
                        },
                        margin: [0, 5, 0, 10]
                    }
                ];
            }

            const headerStack = !dados.usarPapelTimbrado ? [
                { text: dados.entidade || 'Entidade não informada', bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
                { text: `${dados.endereco || 'Endereço não informado'} - ${dados.municipio || 'Município não informado'}/${dados.uf || 'UF não informada'} - CEP: ${dados.cep || 'CEP não informado'}`, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 5] },
                { canvas: [{ type: 'line', x1: 70, y1: 0, x2: 445, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 10] }
            ] : [];

            return [
                ...headerStack,
                { text: substituirPlaceholders(declaracao.title, dados), style: 'header', alignment: 'center', margin: [0, actualLayout.topMargin, 0, 10] },
                ...contentArray,
                { text: '', pageBreak: isLastDeclaration ? undefined : 'after' }
            ];
        };

        const allDeclarationsContent = declaracoesParaIncluir.flatMap((decl, index) =>
            createDeclarationContent(decl, index === declaracoesParaIncluir.length - 1)
        );

        const titulosDeclaracoes = declaracoesParaIncluir.map(d => substituirPlaceholders(d.title, dados));
        const totalDeclaracoes = titulosDeclaracoes.length;

        const summaryPage = [
            { text: '', pageBreak: 'before' }, // Ensure summary starts on a new page
            { text: 'Sumário das Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 20, 0, 5] },
            { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'center', margin: [0, 2, 0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 50],
                    body: [
                        [{ text: 'Declaração', style: 'tableHeader', alignment: 'left' }, { text: 'Página', style: 'tableHeader', alignment: 'center' }],
                        ...titulosDeclaracoes.map((titulo, index) => [
                            { text: `${index + 1}. ${titulo}`, linkToPage: index + 1, decoration: 'underline', color: 'blue', fontSize: 10, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: `${index + 1}`, alignment: 'center', fontSize: 10, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                        ])
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#003087',
                    vLineColor: () => '#003087',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [20, 5, 20, 15],
                alignment: 'center'
            },
            { text: `Por ser verdade, firmo o teor das declarações referenciais que compõem este arquivo.`, alignment: 'justify', fontSize: 12, margin: [20, 10, 20, 20] },
            { text: `${dados.municipio}/${dados.uf}, ${dados.diaAtual} de ${dados.mesAtual} de ${dados.anoAtual}.`, alignment: 'center', fontSize: 12, margin: [0, 10, 0, 20] },
            { text: `__________________________________________\n${dados.dirigente}\n(${dados.cargoDirigente})`, alignment: 'center', fontSize: 12 }
        ];

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [
                actualLayout.leftRightMargin,
                actualLayout.topMargin,
                actualLayout.leftRightMargin,
                actualLayout.footerAreaFromBottom // Use the input value directly for the bottom margin
            ],
            background: finalLetterheadImage ? [{ image: finalLetterheadImage, width: 595, height: 842, absolutePosition: { x: 0, y: 0 }, opacity: 0.9 }] : null,
            footer: (currentPage, pageCount) => {
                // The footer content should be positioned within the pageMargins.bottom area.
                // A fixed distance from the bottom edge of the page.
                // A4 height is 842 points. If you want footer content 1.5cm (~42.5 points) from bottom,
                // the `absolutePosition.y` would be 842 - 42.5.
                // However, pdfmake's footer function `margin` is relative to the *top of the footer area*.
                // To position content accurately within the reserved footerAreaFromBottom,
                // we calculate a `marginTop` for the footer stack.
                // Let's assume footer content height is approx 20 points for now.
                const footerContentHeightEstimate = 20; // Estimate height of the footer text lines
                const desiredDistanceFromBottom = parseFloat(document.getElementById('footerMarginBottomCm')?.value || 5.5) * 28.3465; // User's desired distance in points
                const marginTopForFooterContent = actualLayout.footerAreaFromBottom - desiredDistanceFromBottom;


                const footerContent = currentPage === pageCount ? {
                    stack: [
                        { text: `Documento composto por ${totalDeclaracoes} (${numeroParaExtenso(totalDeclaracoes)}) declarações referenciais, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`, alignment: 'center', fontSize: 9 },
                        { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 9, margin: [0, 5, 0, 0] }
                    ],
                    // Margin for footer content relative to the top of the footer area (pageMargins[3])
                    // [left, top, right, bottom]
                    // This moves the footer content *down* within the bottom margin area.
                    margin: [actualLayout.leftRightMargin, marginTopForFooterContent, actualLayout.leftRightMargin, 0]
                } : {
                    stack: [
                        { text: 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as declarações anteriores.', alignment: 'center', fontSize: 9 },
                        { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 9, margin: [0, 5, 0, 0] }
                    ],
                    margin: [actualLayout.leftRightMargin, marginTopForFooterContent, actualLayout.leftRightMargin, 0]
                };
                return footerContent;
            },
            content: [...allDeclarationsContent, ...summaryPage],
            styles: {
                header: { fontSize: 16, bold: true, color: '#003087', alignment: 'center' },
                subheader: { fontSize: 10, italic: true, color: '#333333', alignment: 'center' },
                tableHeader: { fontSize: 11, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'left' }
            },
            defaultStyle: { font: 'Roboto' },
            permissions: {
                printing: 'lowResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false
            }
        };

        if (isPreview) {
            return docDefinition; // Return docDefinition for preview
        }

        const nomeArquivo = `declaracao_${dados.proposta.replace(/\//g, '-')}.pdf`;
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = nomeArquivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            exibirMensagemSucesso('PDF gerado e baixado com sucesso!');
        }, (error) => {
            exibirMensagemErro('Erro ao baixar o PDF: ' + error.message);
        });
    } catch (error) {
        exibirMensagemErro('Erro ao gerar PDF: ' + error.message);
    } finally {
        isGeneratingPDF = false;
        // Always hide loading indicator
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

/**
 * Valida os dados do formulário.
 * @param {object} dados - Dados capturados do formulário.
 * @returns {Array<string>} Lista de erros.
 */
function validarDadosFormulario(dados) {
    const camposObrigatorios = ['dirigente', 'matricula', 'cargoDirigente', 'proposta', 'cnpj', 'entidade', 'endereco', 'uf', 'municipio', 'cep', 'opcaoSelecao'];
    const erros = camposObrigatorios.filter(campo => !dados[campo] || dados[campo].trim() === '').map(campo => `O campo ${campo} é obrigatório.`);

    if (!['00SL_emendas', '00SL_comissao', '20JP_emenda', '20JP_comissao', '00SL_emendas_timbrado', '00SL_comissao_timbrado', '20JP_emenda_timbrado', '20JP_comissao_timbrado'].includes(dados.opcaoSelecao)) {
        erros.push('A opção selecionada é inválida.');
    }

    if (dados.opcaoSelecao.startsWith('00SL') && (!dados.espacosFisicos || dados.espacosFisicos.length === 0)) {
        erros.push('Pelo menos um espaço físico deve ser informado para propostas 00SL.');
    }

    return erros;
}

/**
 * Exibe uma mensagem de erro no elemento toast.
 * @param {string} mensagem - Mensagem a ser exibida.
 */
function exibirMensagemErro(mensagem) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensagem;
        toast.style.backgroundColor = 'var(--error-color)';
        toast.className = 'toast show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    } else {
        console.error('Toast não encontrado:', mensagem);
    }
}

/**
 * Exibe uma mensagem de sucesso no elemento toast.
 * @param {string} mensagem - Mensagem a ser exibida.
 */
function exibirMensagemSucesso(mensagem) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensagem;
        toast.style.backgroundColor = 'var(--success-color)';
        toast.className = 'toast show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    } else {
        console.log('Toast não encontrado:', mensagem);
    }
}

/**
 * Fecha o modal de pré-visualização.
 */
function fecharModal() {
    const modal = document.getElementById('layoutEditorModal');
    if (modal) {
        modal.style.display = 'none';
        const iframe = document.getElementById('previewIframe');
        if (iframe) iframe.src = 'about:blank';
    }
}

/**
 * Atualiza a pré-visualização do PDF no iframe.
 */
async function updatePreview() {
    const dados = await capturarDadosFormulario();
    // Default values if inputs are empty or not found.
    // Ensure these align with your desired initial UI state or common usage.
    const marginTopCm = parseFloat(document.getElementById('marginTopCm')?.value || 3.5);
    const footerMarginBottomCm = parseFloat(document.getElementById('footerMarginBottomCm')?.value || 5.5);

    const cmToPoints = cm => cm * 28.3465;

    // Apply validation/clamping directly to the values used for layout options
    const validatedTopMarginCm = Math.min(Math.max(marginTopCm, 0), 7); // Clamped between 0 and 7 cm
    const validatedFooterMarginBottomCm = Math.min(Math.max(footerMarginBottomCm, 0), 6.5); // Clamped between 0 and 6.5 cm

    const layoutOptions = {
        topMargin: cmToPoints(validatedTopMarginCm),
        // This is the actual pageMargins[3] value. It defines the space reserved from the bottom.
        footerHeight: cmToPoints(validatedFooterMarginBottomCm)
    };

    const docDefinition = await gerarPDF(dados, true, letterheadImage, layoutOptions);
    if (docDefinition) {
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getDataUrl((dataUrl) => {
            const iframe = document.getElementById('previewIframe');
            if (iframe) {
                iframe.src = dataUrl;
            }
        });
    }
}

// Integração com o HTML
document.addEventListener('DOMContentLoaded', () => {
    const gerarPDFBtn = document.getElementById('gerarPDF');
    const confirmAndGenerateBtn = document.getElementById('confirmAndGenerate');
    const usarPapelTimbradoCheckbox = document.getElementById('usarPapelTimbrado');
    const letterheadFileInput = document.getElementById('letterheadFile');
    const marginTopInput = document.getElementById('marginTopCm');
    const footerMarginInput = document.getElementById('footerMarginBottomCm');
    const cancelLayoutBtn = document.getElementById('cancelLayout');

    // --- Set initial input values on load ---
    if (marginTopInput) {
        // You can set your preferred default here, e.g., 3.5cm
        marginTopInput.value = 3.5;
    }
    if (footerMarginInput) {
        // You can set your preferred default here, e.g., 5.5cm
        footerMarginInput.value = 5.5;
    }

    // --- Helper function to initiate PDF generation ---
    async function initiatePDFGeneration(closeModalAfter = false) {
        // isGeneratingPDF check is now inside gerarPDF to manage loading state globally
        // and prevent multiple parallel generations.
        
        const dados = await capturarDadosFormulario();
        
        // Specific check for letterhead requirement before proceeding
        if (dados.usarPapelTimbrado && !letterheadImage) {
            exibirMensagemErro('Por favor, selecione um arquivo de papel timbrado.');
            return; // Stop if letterhead is required but not provided
        }

        const marginTopCm = parseFloat(marginTopInput?.value || 3.5);
        const footerMarginBottomCm = parseFloat(footerMarginInput?.value || 5.5);
        const cmToPoints = cm => cm * 28.3465;

        // Pass validated and converted values to gerarPDF
        const layoutOptions = {
            topMargin: cmToPoints(Math.min(Math.max(marginTopCm, 0), 7)),
            footerHeight: cmToPoints(Math.min(Math.max(footerMarginBottomCm, 0), 6.5))
        };

        await gerarPDF(dados, false, letterheadImage, layoutOptions);

        if (closeModalAfter) {
            fecharModal();
        }
    }

    // --- Event Listeners ---
    if (usarPapelTimbradoCheckbox) {
        usarPapelTimbradoCheckbox.addEventListener('change', () => {
            const uploadContainer = document.getElementById('letterheadUploadContainer');
            if (uploadContainer) {
                uploadContainer.style.display = usarPapelTimbradoCheckbox.checked ? 'block' : 'none';
                if (!usarPapelTimbradoCheckbox.checked) {
                    letterheadFileInput.value = ''; // Clear selected file input
                    letterheadImage = null; // Clear loaded image data
                }
            }
            updatePreview(); // Update preview when letterhead usage changes
        });
    }

    if (letterheadFileInput) {
        letterheadFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    letterheadImage = await carregarImagemComoDataURL(file);
                    exibirMensagemSucesso('Arquivo de papel timbrado carregado com sucesso.');
                    updatePreview();
                } catch (error) {
                    exibirMensagemErro(error.message);
                    letterheadFileInput.value = ''; // Clear input on error
                    letterheadImage = null; // Clear loaded image data on error
                }
            }
        });
    }

    if (gerarPDFBtn) {
        gerarPDFBtn.addEventListener('click', () => initiatePDFGeneration(false));
    }

    if (confirmAndGenerateBtn) {
        confirmAndGenerateBtn.addEventListener('click', () => initiatePDFGeneration(true));
    }

    if (cancelLayoutBtn) {
        cancelLayoutBtn.addEventListener('click', fecharModal);
    }

    if (marginTopInput) {
        marginTopInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            // Clamp value to ensure it stays within bounds
            if (value < 0 || value > 7) {
                e.target.value = Math.min(Math.max(value, 0), 7);
                exibirMensagemErro('A margem superior deve estar entre 0 e 7 cm.');
            }
            updatePreview(); // Update preview on input change
        });
    }

    if (footerMarginInput) {
        footerMarginInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            // Clamp value to ensure it stays within bounds
            if (value < 0 || value > 6.5) {
                e.target.value = Math.min(Math.max(value, 0), 6.5);
                exibirMensagemErro('A margem inferior do rodapé deve estar entre 0 e 6,5 cm.');
            }
            updatePreview(); // Update preview on input change
        });
    }

    async function capturarDadosFormulario() {
        const getValue = (id) => document.getElementById(id)?.value || '';
        const dados = {
            dirigente: getValue('dirigente'),
            matricula: getValue('matricula'),
            cargoDirigente: getValue('cargoDirigente'),
            proposta: getValue('proposta'),
            cnpj: getValue('cnpj'),
            entidade: getValue('entidade'),
            endereco: getValue('endereco'),
            uf: getValue('uf'),
            municipio: getValue('municipio'),
            cep: getValue('cep'),
            opcaoSelecao: getValue('opcaoSelecao'),
            usarPapelTimbrado: !!usarPapelTimbradoCheckbox && usarPapelTimbradoCheckbox.checked,
            espacosFisicos: []
        };

        document.querySelectorAll('#espacoFisicoFields .form-row').forEach(row => {
            const nome = row.querySelector('input[id^="nomeEspacoFisico"]')?.value;
            const endereco = row.querySelector('input[id^="enderecoEspacoFisico"]')?.value;
            const areaTotal = row.querySelector('input[id^="areaTotal"]')?.value;
            if (nome && endereco) {
                dados.espacosFisicos.push({ nome, endereco, areaTotal });
            }
        });

        return dados;
    }
});