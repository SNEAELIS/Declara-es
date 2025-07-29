let isGeneratingPDF = false;

// Declarações completas
const declaracoesCompletas = [
    {
        title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro, sob as penas da lei, que os recursos oriundos do presente convênio, celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [proposta], não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e dos Municípios, conforme disposto no Art. 167, inciso X, da Constituição Federal de 1988 (CF/88) e no Art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal). Ressalto que esta declaração visa assegurar a correta aplicação dos recursos públicos, estando ciente das sanções administrativas, civis e penais aplicáveis em caso de descumprimento.`
    },
    {
        title: "DECLARAÇÃO DE NÃO VÍNCULO",
        content: `Eu, [dirigente], matrícula [matricula], cargo [cargoDirigente], declaro, sob as penas da lei, especialmente o art. 299 do Código Penal Brasileiro, que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [proposta], não possuem em seu quadro societário, cônjuge ou companheiro, bem como vínculo de parentesco, colateral ou por afinidade até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil, com qualquer dirigente, servidor ou empregado da [entidade] ou do Ministério do Esporte. Esta declaração é prestada com base em pesquisa documental e está sujeita a verificação, sendo de minha responsabilidade a veracidade das informações fornecidas.`
    },
    {
        title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro, para os devidos fins de celebração de convênios junto ao Ministério do Esporte - MESP, que a proposta inserida no Sistema Eletrônico Transferegov sob o nº [proposta], juntamente com todas as informações e documentações anexas, foi apresentada para apreciação exclusivamente junto a esse órgão e em nenhum outro ente da administração pública federal, estadual ou municipal. Esta declaração visa evitar duplicidade de financiamentos e está sujeita às sanções civis, administrativas e penais cabíveis, nos termos da Lei nº 8.666/1993 e da Lei nº 14.133/2021 (Nova Lei de Licitações), caso seja comprovada falsidade ideológica ou omissão de informações.`
    },
    {
        title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO ao Ministério do Esporte - MESP que a entidade a qual represento não recebe, atualmente ou no período de vigência da Proposta nº [proposta], recursos financeiros de outra entidade pública ou privada para a mesma finalidade das ações apresentadas e especificadas no Plano de Trabalho cadastrado no Sistema Eletrônico Transferegov. Esta afirmação tem como objetivo evitar sobreposição de recursos e garantir a economicidade dos fundos públicos, estando ciente das penalidades previstas em caso de descumprimento, conforme a legislação aplicável.`
    },
    {
        title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal da [entidade], CNPJ nº [cnpj], declaro, para os devidos fins de celebração do Termo de Convênio com o Ministério do Esporte - MESP, que a presente Entidade não contratará, com os recursos provenientes desta parceria sob a Proposta nº [proposta], empresas que: (i) integrem o mesmo grupo econômico; (ii) possuam participação societária cruzada; (iii) pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da [entidade]; (iv) compartilhem o mesmo endereço, telefone ou CNPJ; (v) apresentem incompatibilidade entre a classificação de atividades econômicas (CNAE) e o objeto contratado. Além disso, asseguro que as cotações dos itens previstos no Plano de Trabalho foram obtidas de forma transparente, com documentos comprobatórios arquivados, e que me responsabilizo pela veracidade e conformidade das pesquisas de preços junto aos fornecedores, nos termos da Instrução Normativa SEGES/ME nº 65/2021.`
    },
    {
        title: "DECLARAÇÃO DE COMPROMISSO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro o compromisso de dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até prestação de contas final;`
    },
    {
        title: "DECLARAÇÃO DE CUSTOS",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], ATESTO a planilha de custos e as cotações de preços obtidas, elaboradas em conformidade com a Instrução Normativa SEGES/ME nº 65, de 7 de julho de 2021, e inseridas no Sistema Eletrônico Transferegov sob a Proposta nº [proposta]. Declaro que os valores apresentados foram apurados com base em pesquisa de mercado realizada junto a, no mínimo, três fornecedores, refletindo preços praticados no setor e compatíveis com a natureza dos bens e serviços contratados. Ressalto que os documentos comprobatórios, incluindo orçamentos e cotações, estão arquivados e disponíveis para fiscalização, e que me responsabilizo pela veracidade e adequação dos dados apresentados, sob pena de sanções administrativas e legais aplicáveis.`
    },
    {
        title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO",
        content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO perante o Ministério do Esporte, para fins de celebração de convênio sob a Proposta nº [proposta], que o(a) [entidade] possui condições orçamentárias e financeiras para arcar com as despesas decorrentes da execução do objeto, incluindo custos de manutenção, operação e eventuais contingências, garantindo a sustentabilidade do projeto ao longo de sua vigência. Esta declaração considera a aquisição de bens de capital e está respaldada por planejamento orçamentário documentado, estando ciente das responsabilidades previstas na Lei nº 4.320/1964 e na Lei Complementar nº 101/2000.`
    }
];

// Declarações específicas
const declaracoesEspecificas = {
    '00SL_emendas': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro que o terreno destinado à execução do objeto da Proposta nº [proposta] é de domínio público e pertence ao Município de [municipio]/[uf], estando plenamente disponível, apto e compatível para a instalação dos equipamentos previstos. Informo que:\n\n- Nome do Espaço Físico: [nomeEspacoFisico];\n- Endereço do Espaço Físico: [enderecoEspacoFisico].\n\nEsta declaração é prestada com base em documentação oficial arquivada, e me comprometo a apresentar os títulos de propriedade ou atos administrativos comprobatórios, caso solicitados, nos termos da Lei nº 8.666/1993.`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO que serão garantidos os meios necessários para assegurar a acessibilidade de pessoas com deficiência ou com mobilidade reduzida ao projeto objeto da Proposta nº [proposta], em conformidade com a Lei nº 10.098, de 19 de dezembro de 2000, o Decreto nº 5.296/2004 e a Norma Brasileira de Acessibilidade (NBR 9050). Comprometo-me a implementar rampas, sinalizações táteis, banheiros adaptados e demais adaptações exigidas, estando ciente de que a não conformidade sujeitará a [entidade] às sanções previstas na legislação. Declaro, outrossim, sob as penas da lei, deter plenos poderes e informações para firmar esta declaração.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro o compromisso de dispor de recursos financeiros próprios ou de outras fontes lícitas, não vinculados à Proposta nº [proposta], para custear integralmente a instalação dos equipamentos pactuados, incluindo mão de obra, materiais complementares e eventuais despesas imprevistas. Esta declaração está respaldada por planejamento orçamentário documentado, e me responsabilizo por garantir a execução das obras no prazo estipulado, sob pena de inadimplemento contratual.`
        }
    ],
    '00SL_comissao': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro que o terreno destinado à execução do objeto da Proposta nº [proposta] é de domínio público e pertence ao Município de [municipio]/[uf], estando plenamente disponível, apto e compatível para a instalação dos equipamentos previstos. Informo que:\n\n- Nome do Espaço Físico: [nomeEspacoFisico];\n- Endereço do Espaço Físico: [enderecoEspacoFisico].\n\nEsta declaração é prestada com base em documentação oficial arquivada, e me comprometo a apresentar os títulos de propriedade ou atos administrativos comprobatórios, caso solicitados, nos termos da Lei nº 8.666/1993.`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO que serão garantidos os meios necessários para assegurar a acessibilidade de pessoas com deficiência ou com mobilidade reduzida ao projeto objeto da Proposta nº [proposta], em conformidade com a Lei nº 10.098, de 19 de dezembro de 2000, o Decreto nº 5.296/2004 e a Norma Brasileira de Acessibilidade (NBR 9050). Comprometo-me a implementar rampas, sinalizações táteis, banheiros adaptados e demais adaptações exigidas, estando ciente de que a não conformidade sujeitará a [entidade] às sanções previstas na legislação. Declaro, outrossim, sob as penas da lei, deter plenos poderes e informações para firmar esta declaração.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], declaro o compromisso de dispor de recursos financeiros próprios ou de outras fontes lícitas, não vinculados à Proposta nº [proposta], para custear integralmente a instalação dos equipamentos pactuados, incluindo mão de obra, materiais complementares e eventuais despesas imprevistas. Esta declaração está respaldada por planejamento orçamentário documentado, e me responsabilizo por garantir a execução das obras no prazo estipulado, sob pena de inadimplemento contratual.`
        }
    ],
    '20JP_emenda': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], no que diz respeito à contratação de recursos humanos para a execução da Proposta nº [proposta], declaro ter ciência de que:\n\n1. A forma de contratação deverá ser analisada e aprovada pela Consultoria Jurídica da Entidade Convenente, observando as orientações contidas no Acórdão nº 2588/2017 – TCU – Plenário, na Portaria Conjunta MGI/MF/AGU nº 33, de 30 de agosto de 2023, e na Lei nº 14.133/2021 (Nova Lei de Licitações).\n\n2. O repasse de recursos financeiros para custeio desta ação, incluindo pagamento de profissionais e encargos sociais/trabalhistas, seguirá os valores e percentuais aprovados no Plano de Trabalho da Proposta nº [proposta]. Caso os encargos sociais ou trabalhistas excedam o limite estipulado, a [entidade] arcará com o diferencial, sem ônus para o convenente.\n\n3. O pagamento será realizado mensalmente, conforme pactuado, observadas as seguintes condições:\n   - Pagamento dos Profissionais: efetuado no mês subsequente à prestação dos serviços, mediante comprovação documental;\n   - Pagamento dos Encargos Sociais e/ou Trabalhistas: acompanhará a periodicidade dos pagamentos aos recursos humanos vinculados, com recolhimento tempestivo aos órgãos competentes.\n\nDeclaro estar ciente de que o descumprimento destas condições poderá acarretar a suspensão do repasse de recursos e a aplicação de sanções administrativas.`
        }
    ],
    '20JP_comissao': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], no que diz respeito à contratação de recursos humanos para a execução da Proposta nº [proposta], declaro ter ciência de que:\n\n1. A forma de contratação deverá ser analisada e aprovada pela Consultoria Jurídica da Entidade Convenente, observando as orientações contidas no Acórdão nº 2588/2017 – TCU – Plenário, na Portaria Conjunta MGI/MF/AGU nº 33, de 30 de agosto de 2023, e na Lei nº 14.133/2021 (Nova Lei de Licitações).\n\n2. O repasse de recursos financeiros para custeio desta ação, incluindo pagamento de profissionais e encargos sociais/trabalhistas, seguirá os valores e percentuais aprovados no Plano de Trabalho da Proposta nº [proposta]. Caso os encargos sociais ou trabalhistas excedam o limite estipulado, a [entidade] arcará com o diferencial, sem ônus para o convenente.\n\n3. O pagamento será realizado mensalmente, conforme pactuado, observadas as seguintes condições:\n   - Pagamento dos Profissionais: efetuado no mês subsequente à prestação dos serviços, mediante comprovação documental;\n   - Pagamento dos Encargos Sociais e/ou Trabalhistas: acompanhará a periodicidade dos pagamentos aos recursos humanos vinculados, com recolhimento tempestivo aos órgãos competentes.\n\nDeclaro estar ciente de que o descumprimento destas condições poderá acarretar a suspensão do repasse de recursos e a aplicação de sanções administrativas.`
        }
    ]
};

// Funções auxiliares
async function getBase64ImageFromUrl(imageUrl) {
    if (!imageUrl) return null;
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to load image: ${response.statusText}`);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error in getBase64ImageFromUrl:", error);
        return null;
    }
}

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
        .replace(/\[enderecoEspacoFisico]/g, dados.espacosFisicos[0]?.endereco || 'Endereço não informado');
}

function numeroParaExtenso(num) {
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    if (num < 20) return units[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' e ' + units[num % 10] : '');
    return String(num);
}

// Função para atualizar a opção selecionada
function atualizarOpcao() {
    const tipoProposta = document.querySelector('input[name="tipo_proposta"]:checked')?.value || '';
    const origem00SL = document.querySelector('input[name="origem_00SL"]:checked')?.value || '';
    const origem20JP = document.querySelector('input[name="origem_20JP"]:checked')?.value || '';
    const municipioMais65mil00SL = document.getElementById('municipioMais65mil')?.checked || false;
    const municipioMais65mil20JP = document.getElementById('municipioMais65mil20JP')?.checked || false;

    let opcaoSelecao = '';

    if (tipoProposta === '20JP') {
        opcaoSelecao = origem20JP ? `20JP_${origem20JP}` : '20JP';
        if (municipioMais65mil20JP && origem20JP === 'comissao') {
            opcaoSelecao += '_mais65mil';
        }
    } else if (tipoProposta === '00SL' && !document.querySelector('#radio_20JP').checked) {
        opcaoSelecao = origem00SL ? `00SL_${origem00SL}` : '00SL';
        if (municipioMais65mil00SL && origem00SL === 'comissao') {
            opcaoSelecao += '_mais65mil';
        }
    }

    document.getElementById('opcaoSelecao').value = opcaoSelecao;

    // Mostrar/esconder os campos de checkbox
    const municipioMais65milContainer00SL = document.getElementById('municipioMais65milContainer');
    const municipioMais65milContainer20JP = document.getElementById('municipioMais65milContainer20JP');
    if (municipioMais65milContainer00SL) {
        municipioMais65milContainer00SL.style.display = (tipoProposta === '00SL' && origem00SL === 'comissao' && !document.querySelector('#radio_20JP').checked) ? 'block' : 'none';
    }
    if (municipioMais65milContainer20JP) {
        municipioMais65milContainer20JP.style.display = (tipoProposta === '20JP' && origem20JP === 'comissao') ? 'block' : 'none';
    }
}

// Função principal de geração de PDF
async function gerarPDF(formData) {
    if (!window.pdfMake || isGeneratingPDF) {
        console.warn('PDF generation not possible or already in progress. isGeneratingPDF:', isGeneratingPDF, 'pdfMake:', !!window.pdfMake);
        return;
    }

    isGeneratingPDF = true;
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) loadingMessage.style.display = 'flex';

    const dados = {
        ...formData,
        diaAtual: String(new Date().getDate()).padStart(2, '0'),
        mesAtual: new Date().toLocaleString('pt-BR', { month: 'long' }),
        anoAtual: new Date().getFullYear()
    };

    try {
        const erros = validarDadosFormulario(dados);
        if (erros.length > 0) {
            console.error('Validation errors:', erros);
            exibirMensagemErro(erros.join(' '));
            return;
        }

        const letterheadImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
        if (!letterheadImage) throw new Error('Failed to load default letterhead.');

        const defaults = { leftRightMargin: 40, topMargin: 130, bottomMargin: 100, footerPosY: 770 };
        const layoutOptions = { topMargin: defaults.topMargin, footerPosition: defaults.footerPosY };
        const bottomMargin = Math.max(100, 841.89 - layoutOptions.footerPosition - 40);

        // Consolidar declarações sem duplicatas
        const todasDeclaracoes = new Map();
        declaracoesCompletas.forEach(decl => {
            const ehSustentabilidade = decl.title === "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO";
            const condicaoSustentabilidade = dados.opcaoSelecao.startsWith('00SL') || dados.opcaoSelecao.startsWith('20JP');
            if (!ehSustentabilidade || condicaoSustentabilidade) {
                todasDeclaracoes.set(decl.title, decl);
            }
        });

        const opcaoBase = dados.opcaoSelecao.replace(/_mais65mil/g, '');
        const declaracoesEspecificasArray = declaracoesEspecificas[opcaoBase] || [];
        declaracoesEspecificasArray.forEach(decl => {
            todasDeclaracoes.set(decl.title, decl);
        });

        // Incluir Declaração de Adimplência para 00SL_comissao ou 20JP_comissao com município > 65 mil
        if ((dados.municipioMais65mil00SL && dados.opcaoSelecao.includes('00SL_comissao')) || (dados.municipioMais65mil20JP && dados.opcaoSelecao.includes('20JP_comissao'))) {
            const adimplencia = {
                title: "DECLARAÇÃO DE ADIMPLÊNCIA",
                content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade não está inadimplente com a União, incluindo, mas não se limitando a, contribuições previstas nos artigos 195 e 239 da Constituição Federal (seguridade social, PIS/PASEP e FGTS), bem como obrigações decorrentes de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições e auxílios previamente celebrados com a Administração Pública Federal. Esta declaração está baseada em certidões negativas atualizadas, arquivadas na [entidade], e me comprometo a apresentá-las quando requisitadas, nos termos da Lei nº 14.133/2021.`
            };
            todasDeclaracoes.set(adimplencia.title, adimplencia);
        }

        const declaracoesParaIncluir = Array.from(todasDeclaracoes.values());

        const allPagesContent = declaracoesParaIncluir.map((decl, index) => {
            let content = substituirPlaceholders(decl.content, dados);
            let contentArray = [{ text: content, alignment: 'justify', fontSize: 12, lineHeight: 1.15, margin: [0, 0, 0, 30] }];

            if (['00SL_emendas', '00SL_comissao'].includes(opcaoBase) && decl.title === "DECLARAÇÃO DE TITULARIDADE DO TERRENO" && dados.espacosFisicos.length > 0) {
                contentArray = [
                    { text: content.replace(/Informo que:\n\n- Nome do Espaço Físico:.*?(?=\n|$)/s, '').trim(), alignment: 'justify', fontSize: 12, lineHeight: 1.15, margin: [0, 0, 0, 5] },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Nome do Espaço Físico', bold: true, fontSize: 10 }, { text: 'Endereço do Espaço Físico', bold: true, fontSize: 10 }],
                                ...dados.espacosFisicos.map(espaco => [
                                    { text: espaco.nome, fontSize: 10 },
                                    { text: espaco.endereco, fontSize: 10 }
                                ])
                            ]
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
                            vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0.5,
                            hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? '#003087' : '#cccccc',
                            vLineColor: (i, node) => (i === 0 || i === node.table.widths.length) ? '#003087' : '#cccccc',
                            paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 5, paddingBottom: () => 5
                        },
                        margin: [0, 5, 0, 30]
                    }
                ];
            }

            const headerStack = [
                { text: (dados.entidade || 'Entidade não informada').toUpperCase(), bold: true, alignment: 'center', fontSize: 14, margin: [0, 0, 0, 2] },
                { text: `${(dados.endereco || 'Endereço não informado').toUpperCase()} - ${(dados.municipio || 'Município não informado').toUpperCase()}/${(dados.uf || 'UF não informada').toUpperCase()} - CEP: ${dados.cep || 'CEP não informado'}`, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 5] },
                { canvas: [{ type: 'line', x1: 70, y1: 15, x2: 445, y2: 15, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 25] }
            ];

            return {
                pageBreak: index < declaracoesParaIncluir.length - 1 ? 'after' : undefined,
                margin: [defaults.leftRightMargin, layoutOptions.topMargin, defaults.leftRightMargin, bottomMargin],
                stack: [
                    ...headerStack,
                    { text: `\n${substituirPlaceholders(decl.title, dados)}`, style: 'header', alignment: 'center', margin: [0, 0, 0, 30] },
                    ...contentArray
                ]
            };
        }).concat({
            pageBreak: 'before',
            margin: [40, 100.249, 40, 100],
            stack: [
                { text: (dados.entidade || 'Entidade não informada').toUpperCase(), bold: true, alignment: 'center', fontSize: 14, margin: [0, 0, 0, 2] },
                { text: `${(dados.endereco || 'Endereço não informado').toUpperCase()} - ${(dados.municipio || 'Município não informado').toUpperCase()}/${(dados.uf || 'UF não informada').toUpperCase()} - CEP: ${dados.cep || 'CEP não informado'}`, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 5] },
                { canvas: [{ type: 'line', x1: 70, y1: 15, x2: 445, y2: 15, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 25] },
                { text: 'DECLARAÇÕES REFERENCIAIS', style: 'header', alignment: 'center', margin: [0, 40, 0, 15] },
                { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'justify', margin: [0, 5, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: [40, '*'],
                        body: [
                            [{ text: 'Página', style: 'tableHeader' }, { text: '', style: 'tableHeader' }],
                            ...declaracoesParaIncluir.map((decl, idx) => [
                                { text: `${idx + 1}`, alignment: 'center', fontSize: 9, fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                                { text: ` ${substituirPlaceholders(decl.title, dados)}`, linkToPage: idx + 1, decoration: 'underline', color: '#003087', fontSize: 9, alignment: 'left', fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                            ])
                        ]
                    },
                    layout: {
                        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                        vLineWidth: () => 1,
                        hLineColor: () => '#003087',
                        vLineColor: () => '#003087',
                        paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 2, paddingBottom: () => 2
                    },
                    margin: [0, 5, 0, 5],
                    alignment: 'center'
                },
                { text: `Por ser verdade, firmo o teor das ${declaracoesParaIncluir.length} (${numeroParaExtenso(declaracoesParaIncluir.length)}) declarações que compõem este arquivo:`, alignment: 'justify', fontSize: 11, margin: [0, 20, 0, 20] },
                { text: `${(dados.municipio || 'Município não informado').toUpperCase()}/${(dados.uf || 'UF não informada').toUpperCase()}, ${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}.`, alignment: 'center', fontSize: 11, margin: [0, 20, 0, 20] },
                { text: '__________________________________________', alignment: 'center', fontSize: 11, margin: [0, 20, 0, 10] },
                { text: dados.dirigente || 'Nome não informado', alignment: 'center', bold: true, fontSize: 11, margin: [0, 0, 0, 10] },
                { text: dados.cargoDirigente || 'Cargo não informado', alignment: 'center', italic: true, fontSize: 11, margin: [0, 0, 0, 10] }
            ]
        });

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [defaults.leftRightMargin, 0, defaults.leftRightMargin, bottomMargin],
            background: letterheadImage ? { image: letterheadImage, width: 595.28, height: 841.89, absolutePosition: { x: 0, y: 0 }, opacity: 1.0 } : null,
            footer: (currentPage, pageCount) => ({
                margin: [40, 0, 40, 0],
                stack: [
                    {
                        columns: [
                            { 
                                text: currentPage < pageCount 
                                    ? 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as páginas anteriores.' 
                                    : `Documento composto por ${declaracoesParaIncluir.length} (${numeroParaExtenso(declaracoesParaIncluir.length)}) declarações, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`, 
                                fontSize: 8.5, color: '#555555', alignment: 'left' 
                            },
                            { text: `Página ${currentPage} de ${pageCount}`, fontSize: 8.5, color: '#555555', alignment: 'right' }
                        ]
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1, lineColor: '#003087' }] }
                ]
            }),
            content: allPagesContent,
            styles: {
                header: { fontSize: 14, bold: true, color: '#003087', alignment: 'center' },
                subheader: { fontSize: 10, italic: true, color: '#333333', alignment: 'justify' },
                tableHeader: { fontSize: 10, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'center' }
            },
            defaultStyle: { font: 'Roboto', alignment: 'justify' },
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

        const nomeArquivo = `declaracao_${dados.proposta.replace(/\//g, '-')}.pdf`;
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.download(nomeArquivo, () => {
            console.log('PDF download completed:', nomeArquivo);
            exibirMensagemSucesso('PDF gerado com sucesso!');
            isGeneratingPDF = false;
        }, (error) => {
            console.error('Error downloading PDF:', error);
            exibirMensagemErro('Erro ao gerar PDF: ' + error.message);
            isGeneratingPDF = false;
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        exibirMensagemErro('Erro ao gerar PDF: ' + error.message);
        isGeneratingPDF = false;
    } finally {
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

// Função de validação do formulário
function validarDadosFormulario(dados) {
    const camposObrigatorios = ['dirigente', 'matricula', 'cargoDirigente', 'proposta', 'cnpj', 'entidade', 'endereco', 'uf', 'municipio', 'cep', 'opcaoSelecao'];
    const erros = camposObrigatorios.filter(campo => !dados[campo] || dados[campo].trim() === '').map(campo => `O campo ${campo} é obrigatório.`);

    if (!['00SL_emendas', '00SL_comissao', '20JP_emenda', '20JP_comissao', '00SL_comissao_mais65mil', '20JP_comissao_mais65mil'].includes(dados.opcaoSelecao)) {
        erros.push('A opção selecionada é inválida.');
    }

    if (dados.opcaoSelecao.startsWith('00SL') && (!dados.espacosFisicos || dados.espacosFisicos.length === 0)) {
        erros.push('Pelo menos um espaço físico deve ser informado para propostas 00SL.');
    }

    return erros;
}

// Funções de mensagens
function exibirMensagemErro(mensagem) {
    const toast = document.getElementById('toast');
    console.error('Exibindo mensagem de erro:', mensagem);
    if (toast) {
        toast.textContent = mensagem;
        toast.style.backgroundColor = 'var(--error-color)';
        toast.className = 'toast show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    } else {
        console.error('Toast não encontrado:', mensagem);
        alert("Erro: " + mensagem);
    }
}

function exibirMensagemSucesso(mensagem) {
    const toast = document.getElementById('toast');
    console.log('Exibindo mensagem de sucesso:', mensagem);
    if (toast) {
        toast.textContent = mensagem;
        toast.style.backgroundColor = 'var(--success-color)';
        toast.className = 'toast show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    } else {
        console.log('Toast não encontrado:', mensagem);
        alert("Sucesso: " + mensagem);
    }
}

// Função para capturar dados do formulário
async function capturarDadosFormulario() {
    console.log('Capturando dados do formulário');
    const getValue = (id) => {
        const element = document.getElementById(id);
        const value = element?.value || '';
        console.log(`Campo ${id}:`, value);
        return value;
    };
    const checkboxValue = (id) => {
        const element = document.getElementById(id);
        const checked = element ? element.checked : false;
        console.log(`Checkbox ${id}:`, checked);
        return checked;
    };
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
        municipioMais65mil00SL: checkboxValue('municipioMais65mil'), // Checkbox para 00SL
        municipioMais65mil20JP: checkboxValue('municipioMais65mil20JP'), // Checkbox para 20JP
        espacosFisicos: []
    };

    document.querySelectorAll('#espacoFisicoFields .form-row').forEach(row => {
        const nome = row.querySelector('input[id^="nomeEspacoFisico"]')?.value;
        const endereco = row.querySelector('input[id^="enderecoEspacoFisico"]')?.value;
        if (nome && endereco) {
            dados.espacosFisicos.push({ nome, endereco });
        }
    });

    console.log('Dados capturados:', dados);
    return dados;
}

// Inicialização do DOM
document.addEventListener('DOMContentLoaded', () => {
    const gerarPDFBtn = document.getElementById('gerarPDF');
    if (!gerarPDFBtn) {
        console.error('Botão Gerar PDF não encontrado');
        exibirMensagemErro('Erro interno: Botão Gerar PDF não encontrado.');
        return;
    }

    gerarPDFBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const dados = await capturarDadosFormulario();
        try {
            await gerarPDF(dados);
        } catch (error) {
            console.error('Erro durante a geração de PDF:', error);
            exibirMensagemErro('Erro ao gerar PDF: ' + error.message);
        }
    });

    document.querySelectorAll('input[name="tipo_proposta"], input[name="origem_00SL"], input[name="origem_20JP"], #municipioMais65mil, #municipioMais65mil20JP').forEach(input => {
        input.addEventListener('change', atualizarOpcao);
    });

    atualizarOpcao();
});