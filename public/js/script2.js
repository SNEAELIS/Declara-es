let isGeneratingPDF = false;
let letterheadImage = null;

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
    },
];

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
        },
        {
            title: "DECLARAÇÃO DE AQUISIÇÃO DE BENS E SERVIÇOS COMUNS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], no que respeita à aquisição de bens e serviços comuns, declaro o compromisso de:\n1. Realizar Processo Licitatório na modalidade Pregão, em atendimento ao § 2º do Art. 17, da Lei n.º 14.133, de 1º de abril de 2021, Art. 51, da Portaria Conjunta n.º 33, de 30 de agosto de 2023, § 3º do Art. 1º, do Decreto n.º 10.024, de 20 de setembro de 2019 e demais legislações que regem a matéria, inclusive quanto a contratação de recursos humanos, quando for o caso, em conformidade com as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário.\n2. Dar publicidade ao Processo Licitatório, divulgando no Diário Oficial da União, conforme preconiza o Art. 11 do Decreto nº 3.555, de 08 de agosto de 2000 e Art. 20, do Decreto n.º 10.024, de 20 de setembro de 2019.\n3. Consultar e emitir, para posterior inserção no sistema Transferegov, a declaração e certidões citadas no item 3 quando da assinatura do contrato a ser formalizado com as empresas vencedoras do certame ou do registro da nota de empenho quando não ocorrer a celebração do instrumento contratual, a fim de comprovar que no ato de assinatura as empresas estavam idôneas e aptas para contratar com a Administração Pública.\n4. Publicar os editais de licitação para consecução do objeto conveniado somente após a assinatura do respectivo instrumento, conforme Art. 53, da Portaria Conjunta n.º 33, de 30 de agosto de 2023.\n\nPor ser expressão da verdade, firmo a presente declaração.`
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
        },
        {
            title: "DECLARAÇÃO DE AQUISIÇÃO DE BENS E SERVIÇOS COMUNS",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], no que respeita à aquisição de bens e serviços comuns, declaro o compromisso de:\n1. Realizar Processo Licitatório na modalidade Pregão, em atendimento ao § 2º do Art. 17, da Lei n.º 14.133, de 1º de abril de 2021, Art. 51, da Portaria Conjunta n.º 33, de 30 de agosto de 2023, § 3º do Art. 1º, do Decreto n.º 10.024, de 20 de setembro de 2019 e demais legislações que regem a matéria, inclusive quanto a contratação de recursos humanos, quando for o caso, em conformidade com as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário.\n2. Dar publicidade ao Processo Licitatório, divulgando no Diário Oficial da União, conforme preconiza o Art. 11 do Decreto nº 3.555, de 08 de agosto de 2000 e Art. 20, do Decreto n.º 10.024, de 20 de setembro de 2019.\n3. Consultar e emitir, para posterior inserção no sistema Transferegov, a declaração e certidões citadas no item 3 quando da assinatura do contrato a ser formalizado com as empresas vencedoras do certame ou do registro da nota de empenho quando não ocorrer a celebração do instrumento contratual, a fim de comprovar que no ato de assinatura as empresas estavam idôneas e aptas para contratar com a Administração Pública.\n4. Publicar os editais de licitação para consecução do objeto conveniado somente após a assinatura do respectivo instrumento, conforme Art. 53, da Portaria Conjunta n.º 33, de 30 de agosto de 2023.\n\nPor ser expressão da verdade, firmo a presente declaração.`
        },
        {
            title: "DECLARAÇÃO DE ADIMPLÊNCIA",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS, com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares). Por ser expressão da verdade, firmo a presente declaração.`
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
        },
        {
            title: "DECLARAÇÃO DE ADIMPLÊNCIA",
            content: `Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ nº [cnpj], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade não está inadimplente com a União, incluindo, mas não se limitando a, contribuições previstas nos artigos 195 e 239 da Constituição Federal (seguridade social, PIS/PASEP e FGTS), bem como obrigações decorrentes de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições e auxílios previamente celebrados com a Administração Pública Federal. Esta declaração está baseada em certidões negativas atualizadas, arquivadas na [entidade], e me comprometo a apresentá-las quando requisitadas, nos termos da Lei nº 14.133/2021.`
        }
    ]
};

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

function getBase64FromFile(file) {
    if (!file) throw new Error('No file provided');
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Error reading file as DataURL'));
        reader.readAsDataURL(file);
    });
}

async function convertPdfPageToImage(file) {
    if (!file || !window.pdfjsLib) throw new Error('PDF.js not loaded or no file provided');
    const fileAsArrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(fileAsArrayBuffer);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL('image/png');
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

async function gerarPDF(formData, isPreview = false, letterheadImageBase64 = null, layoutOptions = {}) {
    if (!window.pdfMake) {
        console.error("pdfMake is not loaded. Cannot generate PDF.");
        return isPreview ? {} : undefined;
    }
    if (isGeneratingPDF && !isPreview) {
        console.warn('PDF generation already in progress. Waiting for completion.');
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
            return isPreview ? {} : undefined;
        }

        let finalLetterheadImage = letterheadImageBase64;
        if (dados.usarPapelTimbrado && !finalLetterheadImage && dados.letterheadFile) {
            finalLetterheadImage = await (dados.letterheadFile.type.startsWith('image/') 
                ? getBase64FromFile(dados.letterheadFile) 
                : dados.letterheadFile.type === 'application/pdf' 
                    ? convertPdfPageToImage(dados.letterheadFile) 
                    : null);
            if (!finalLetterheadImage) throw new Error('Failed to load custom letterhead.');
        } else if (!dados.usarPapelTimbrado && !finalLetterheadImage) {
            finalLetterheadImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
            if (!finalLetterheadImage) throw new Error('Failed to load default letterhead.');
        }

        const defaults = { leftRightMargin: 40, topMargin: 130, bottomMargin: 100, footerPosY: 770 };
        const { topMargin = defaults.topMargin, footerPosition = defaults.footerPosY } = { ...defaults, ...layoutOptions };
        const bottomMargin = Math.max(100, 841.89 - footerPosition - 40);

        // Consolidar declarações sem duplicatas
        const todasDeclaracoes = new Map();
        declaracoesCompletas.forEach(decl => {
            const ehSustentabilidade = decl.title === "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO";
            const condicaoSustentabilidade = dados.opcaoSelecao.startsWith('00SL') || dados.opcaoSelecao.startsWith('20JP');
            const ehAdimplencia = decl.title === "DECLARAÇÃO DE ADIMPLÊNCIA";
            const condicaoAdimplencia = !dados.opcaoSelecao.startsWith('00SL') || dados.municipioMais65mil;
            if ((!ehSustentabilidade || condicaoSustentabilidade) && (!ehAdimplencia || condicaoAdimplencia)) {
                todasDeclaracoes.set(decl.title, decl);
            }
        });

        const opcaoBase = dados.opcaoSelecao.replace(/_timbrado|_mais65mil/g, '');
        const declaracoesEspecificasArray = declaracoesEspecificas[opcaoBase] || [];
        declaracoesEspecificasArray.forEach(decl => {
            todasDeclaracoes.set(decl.title, decl);
        });

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

            const headerStack = !dados.usarPapelTimbrado ? [
                { text: dados.entidade || 'Entidade não informada', bold: true, alignment: 'center', fontSize: 14, margin: [0, 0, 0, 2] },
                { text: `${dados.endereco || 'Endereço não informado'} - ${dados.municipio || 'Município não informado'}/${dados.uf || 'UF não informada'} - CEP: ${dados.cep || 'CEP não informado'}`, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 5] },
                { canvas: [{ type: 'line', x1: 70, y1: 15, x2: 445, y2: 15, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 25] }
            ] : [];

            return {
                pageBreak: index < declaracoesParaIncluir.length - 1 ? 'after' : undefined,
                margin: [defaults.leftRightMargin, topMargin, defaults.leftRightMargin, bottomMargin],
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
                { text: 'Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 40, 0, 15] },
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
            background: (currentPage, pageCount) => 
                finalLetterheadImage ? { image: finalLetterheadImage, width: 595.28, height: 841.89, absolutePosition: { x: 0, y: 0 }, opacity: 1.0 } : null,
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

        if (isPreview) {
            return docDefinition;
        }

        const nomeArquivo = `declaracao_${dados.proposta.replace(/\//g, '-')}.pdf`;
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.download(nomeArquivo, () => {
            console.log('PDF download completed:', nomeArquivo);
        }, (error) => {
            console.error('Error downloading PDF:', error);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        isGeneratingPDF = false;
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

function validarDadosFormulario(dados) {
    const camposObrigatorios = ['dirigente', 'matricula', 'cargoDirigente', 'proposta', 'cnpj', 'entidade', 'endereco', 'uf', 'municipio', 'cep', 'opcaoSelecao'];
    const erros = camposObrigatorios.filter(campo => !dados[campo] || dados[campo].trim() === '').map(campo => `O campo ${campo} é obrigatório.`);

    if (!['00SL_emendas', '00SL_comissao', '20JP_emenda', '20JP_comissao', '00SL_emendas_timbrado', '00SL_comissao_timbrado', '20JP_emenda_timbrado', '20JP_comissao_timbrado', '00SL_emendas_mais65mil', '00SL_comissao_mais65mil', '00SL_emendas_timbrado_mais65mil', '00SL_comissao_timbrado_mais65mil'].includes(dados.opcaoSelecao)) {
        erros.push('A opção selecionada é inválida.');
    }

    if (dados.opcaoSelecao.startsWith('00SL') && (!dados.espacosFisicos || dados.espacosFisicos.length === 0)) {
        erros.push('Pelo menos um espaço físico deve ser informado para propostas 00SL.');
    }

    console.log('Resultado da validação do formulário:', erros);
    return erros;
}

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

function fecharModal() {
    console.log('Fechando modal de pré-visualização');
    const modal = document.getElementById('layoutEditorModal');
    if (modal) {
        modal.style.display = 'none';
        const iframe = document.getElementById('previewIframe');
        if (iframe) iframe.src = 'about:blank';
    }
}

async function updatePreview() {
    console.log('Atualizando pré-visualização');
    const modal = document.getElementById('layoutEditorModal');
    if (!modal || modal.style.display === 'none') {
        console.log('Modal não está visível, ignorando atualização');
        return;
    }

    const dados = await capturarDadosFormulario();
    const marginTopCm = parseFloat(document.getElementById('marginTopCm')?.value || 4.58);
    const footerMarginBottomCm = parseFloat(document.getElementById('footerMarginBottomCm')?.value || 2.4);

    const cmToPoints = cm => cm * 28.3465;
    const validatedTopMarginCm = Math.min(Math.max(marginTopCm, 0), 7);
    const validatedFooterMarginBottomCm = Math.min(Math.max(footerMarginBottomCm, 0), 6.5);

    const layoutOptions = {
        topMargin: cmToPoints(validatedTopMarginCm),
        footerPosition: 841.89 - cmToPoints(validatedFooterMarginBottomCm) - 40
    };

    console.log('Opções de layout:', layoutOptions);

    try {
        const docDefinition = await gerarPDF(dados, true, letterheadImage, layoutOptions);
        if (!docDefinition || !docDefinition.content) {
            console.error('DocDefinition inválido ou vazio');
            exibirMensagemErro('Erro ao gerar pré-visualização: Documento inválido.');
            return;
        }

        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getDataUrl((dataUrl) => {
            console.log('Pré-visualização gerada com sucesso:', dataUrl.substring(0, 50));
            const iframe = document.getElementById('previewIframe');
            if (iframe) {
                iframe.src = dataUrl;
            } else {
                console.error('Iframe de pré-visualização não encontrado');
                exibirMensagemErro('Erro ao exibir pré-visualização: Iframe não encontrado.');
            }
        }, (error) => {
            console.error('Erro ao gerar DataURL para pré-visualização:', error);
            exibirMensagemErro('Erro ao gerar pré-visualização: ' + error.message);
        });
    } catch (error) {
        console.error('Erro ao atualizar pré-visualização:', error);
        exibirMensagemErro('Erro ao atualizar pré-visualização: ' + error.message);
    }
}

async function capturarDadosFormulario() {
    console.log('Capturando dados do formulário');
    const getValue = (id) => {
        const element = document.getElementById(id);
        const value = element?.value || '';
        console.log(`Campo ${id}:`, value);
        return value;
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
        usarPapelTimbrado: !!document.getElementById('usarPapelTimbrado') && document.getElementById('usarPapelTimbrado').checked,
        municipioMais65mil: !!document.getElementById('municipioMais65mil') && document.getElementById('municipioMais65mil').checked,
        letterheadFile: document.getElementById('letterheadFile')?.files[0] || null,
        espacosFisicos: []
    };

    document.querySelectorAll('#espacoFisicoFields .form-row').forEach(row => {
        const nome = row.querySelector('input[id^="nomeEspacoFisico"]')?.value;
        const endereco = row.querySelector('input[id^="enderecoEspacoFisico"]')?.value;
        if (nome && endereco) {
            console.log('Espaço físico adicionado:', { nome, endereco });
            dados.espacosFisicos.push({ nome, endereco });
        }
    });

    return dados;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando eventos do DOM');
    const gerarPDFBtn = document.getElementById('gerarPDF');
    const confirmAndGenerateBtn = document.getElementById('confirmAndGenerate');
    const usarPapelTimbradoCheckbox = document.getElementById('usarPapelTimbrado');
    const letterheadFileInput = document.getElementById('letterheadFile');
    const marginTopInput = document.getElementById('marginTopCm');
    const footerMarginInput = document.getElementById('footerMarginBottomCm');
    const cancelLayoutBtn = document.getElementById('cancelLayout');

    if (!gerarPDFBtn || !confirmAndGenerateBtn || !usarPapelTimbradoCheckbox || !letterheadFileInput || !marginTopInput || !footerMarginInput || !cancelLayoutBtn) {
        console.error('Um ou mais elementos HTML não foram encontrados');
        exibirMensagemErro('Erro interno: Elementos do formulário não encontrados.');
        return;
    }

    marginTopInput.value = 4.58;
    footerMarginInput.value = 2.4;

    async function initiatePDFGeneration(closeModalAfter = false) {
        console.log('Iniciando geração de PDF, fechar modal:', closeModalAfter);
        const dados = await capturarDadosFormulario();
        
        if (dados.usarPapelTimbrado && !letterheadImage && !dados.letterheadFile) {
            console.error('Papel timbrado selecionado, mas nenhum arquivo foi fornecido');
            exibirMensagemErro('Por favor, selecione um arquivo de papel timbrado.');
            return;
        }

        const marginTopCm = parseFloat(marginTopInput.value || 4.58);
        const footerMarginBottomCm = parseFloat(footerMarginInput.value || 2.4);
        const cmToPoints = cm => cm * 28.3465;

        const layoutOptions = {
            topMargin: cmToPoints(Math.min(Math.max(marginTopCm, 0), 7)),
            footerPosition: 841.89 - cmToPoints(Math.min(Math.max(footerMarginBottomCm, 0), 6.5)) - 40
        };

        try {
            await gerarPDF(dados, false, letterheadImage, layoutOptions);
            if (closeModalAfter) {
                fecharModal();
            }
        } catch (error) {
            console.error('Erro durante a geração de PDF:', error);
            exibirMensagemErro('Erro ao gerar PDF: ' + error.message);
        }
    }

    usarPapelTimbradoCheckbox.addEventListener('change', () => {
        console.log('Alterando estado do papel timbrado:', usarPapelTimbradoCheckbox.checked);
        const uploadContainer = document.getElementById('letterheadUploadContainer');
        if (uploadContainer) {
            uploadContainer.style.display = usarPapelTimbradoCheckbox.checked ? 'block' : 'none';
            if (!usarPapelTimbradoCheckbox.checked) {
                letterheadFileInput.value = '';
                letterheadImage = null;
                console.log('Papel timbrado desativado, limpando arquivo');
            }
        }
        updatePreview();
    });

    letterheadFileInput.addEventListener('change', async (e) => {
        console.log('Arquivo de papel timbrado selecionado');
        const file = e.target.files[0];
        if (file) {
            try {
                letterheadImage = await (file.type.startsWith('image/') 
                    ? getBase64FromFile(file) 
                    : file.type === 'application/pdf' 
                        ? convertPdfPageToImage(file) 
                        : null);
                exibirMensagemSucesso('Arquivo de papel timbrado carregado com sucesso.');
                updatePreview();
            } catch (error) {
                console.error('Erro ao carregar arquivo de papel timbrado:', error);
                exibirMensagemErro(error.message);
                letterheadFileInput.value = '';
                letterheadImage = null;
            }
        }
    });

    gerarPDFBtn.addEventListener('click', () => initiatePDFGeneration(false));
    confirmAndGenerateBtn.addEventListener('click', () => initiatePDFGeneration(true));
    cancelLayoutBtn.addEventListener('click', fecharModal);

    marginTopInput.addEventListener('input', (e) => {
        console.log('Ajustando margem superior:', e.target.value);
        const value = parseFloat(e.target.value);
        if (value < 0 || value > 7) {
            e.target.value = Math.min(Math.max(value, 0), 7);
            exibirMensagemErro('A margem superior deve estar entre 0 e 7 cm.');
        }
        updatePreview();
    });

    footerMarginInput.addEventListener('input', (e) => {
        console.log('Ajustando margem inferior:', e.target.value);
        const value = parseFloat(e.target.value);
        if (value < 0 || value > 6.5) {
            e.target.value = Math.min(Math.max(value, 0), 6.5);
            exibirMensagemErro('A margem inferior do rodapé deve estar entre 0 e 6,5 cm.');
        }
        updatePreview();
    });
});