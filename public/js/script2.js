let isGeneratingPDF = false;

function validarDadosFormulario(dados) {
    const camposObrigatorios = ['dirigente', 'matricula', 'cargoDirigente', 'proposta', 'cnpj', 'entidade', 'endereco', 'uf', 'municipio', 'cep', 'opcaoSelecao'];
    const erros = camposObrigatorios.filter(campo => !dados[campo] || dados[campo].trim() === '').map(campo => `O campo ${campo} é obrigatório.`);
    if (dados.opcaoSelecao.startsWith('00SL') && (!dados.espacosFisicos || dados.espacosFisicos.length === 0)) {
        erros.push('Pelo menos um espaço físico deve ser informado para propostas 00SL.');
    }
    return erros;
}

async function getBase64ImageFromUrl(imageUrl) {
    try {
        console.log(`Tentando carregar imagem de: ${imageUrl}`);
        const response = await fetch(imageUrl, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Falha ao carregar imagem: ${response.status} - ${response.statusText}`);
        const blob = await response.blob();
        console.log('Imagem baixada como blob.');
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('Imagem convertida para Base64 com sucesso.');
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Erro ao carregar imagem padrão:', error.message);
        return null;
    }
}

function capturarDadosFormulario() {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const dataAtual = new Date();
    return {
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
        usarPapelTimbrado: document.getElementById('usarPapelTimbrado')?.checked || false,
        espacosFisicos: [],
        diaAtual: String(dataAtual.getDate()).padStart(2, '0'),
        mesAtual: dataAtual.toLocaleString('pt-BR', { month: 'long' }),
        anoAtual: dataAtual.getFullYear()
    };
}

function substituirPlaceholders(texto, dados) {
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
        .replace(/\[diaAtual]/g, dados.diaAtual)
        .replace(/\[mesAtual]/g, dados.mesAtual)
        .replace(/\[anoAtual]/g, dados.anoAtual);
}

function numeroParaExtenso(num) {
    const unidades = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    if (num < 20) return unidades[num];
    if (num < 100) return dezenas[Math.floor(num / 10)] + (num % 10 !== 0 ? ' e ' + unidades[num % 10] : '');
    return num.toString();
}

async function gerarPDF(formData = null, isPreview = false, letterheadBackground = null, layoutOptions = {}) {
    if (isGeneratingPDF) return isPreview ? {} : undefined;
    isGeneratingPDF = true;

    try {
        const dados = formData || capturarDadosFormulario();
        console.log('Iniciando geração do PDF com dados:', JSON.stringify(dados, null, 2));

        const erros = validarDadosFormulario(dados);
        if (erros.length > 0) {
            showToast(`Erro: ${erros.join(' ')}`, true);
            console.error('Validação falhou:', erros);
            isGeneratingPDF = false;
            return isPreview ? {} : undefined;
        }

        document.querySelectorAll('#espacoFisicoFields .form-row').forEach(row => {
            const nome = row.querySelector('input[id^="nomeEspacoFisico"]').value;
            const endereco = row.querySelector('input[id^="enderecoEspacoFisico"]').value;
            if (nome && endereco) {
                dados.espacosFisicos.push({ nome, endereco });
            }
        });

        let finalLetterheadImage = null;
        if (dados.usarPapelTimbrado && letterheadBackground && letterheadBackground.startsWith('data:')) {
            finalLetterheadImage = letterheadBackground;
            console.log('Usando papel timbrado personalizado fornecido.');
        } else {
            finalLetterheadImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
            if (!finalLetterheadImage) {
                console.warn('Imagem padrão não carregada. Prosseguindo sem fundo.');
            }
        }

        const { topMargin = 60, footerPosition = 761.89, isCustom = false } = { ...{ leftRightMargin: 40, topMargin: 60, footerPosition: 761.89 }, ...layoutOptions };
        const bottomMargin = Math.max(80, 841.89 - footerPosition);

        let declaracoesParaIncluir = [
            ...declaracoesCompletas.filter(decl => {
                const ehSustentabilidade = decl.title === "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO";
                const condicaoSustentabilidade = dados.opcaoSelecao.startsWith('00SL') || (dados.temAquisicao && dados.opcaoSelecao.startsWith('20JP'));
                return !ehSustentabilidade || condicaoSustentabilidade;
            }),
            ...declaracoesEspecificas[dados.opcaoSelecao] || []
        ];

        const createDeclarationContent = (declaracao, isLastDeclaration = false) => {
            let content = substituirPlaceholders(declaracao.content, dados);
            let contentArray = [{ text: content, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 40] }];

            if (['00SL_emendas', '00SL_comissao'].includes(dados.opcaoSelecao) && declaracao.title === "DECLARAÇÃO DE TITULARIDADE DO TERRENO") {
                if (dados.espacosFisicos.length > 0) {
                    contentArray = [
                        { text: content.replace(/Nome do Espaço Físico:.*?(Endereço do Espaço Físico:.*?)(?=\n|$)/, '').trim(), alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 0] },
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [['Nome do Espaço Físico', 'Endereço do Espaço Físico'], ...dados.espacosFisicos.map(espaco => [espaco.nome, espaco.endereco])]
                            },
                            layout: 'lightHorizontalLines',
                            margin: [0, 10, 0, 20]
                        }
                    ];
                }
            }

            const headerStack = !dados.usarPapelTimbrado ? [
                { text: dados.entidade || 'Entidade não informada', bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
                { text: dados.endereco || 'Endereço não informado', fontSize: 10, alignment: 'center' },
                { canvas: [{ type: 'line', x1: 70, y1: 15, x2: 445, y2: 15, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 25] }
            ] : [];

            return [
                ...headerStack,
                { text: substituirPlaceholders(declaracao.title, dados), style: 'header', alignment: 'center', margin: [0, topMargin || 100, 0, 20] },
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
            { text: '', pageBreak: 'before' },
            { text: 'Sumário das Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 40, 0, 10] },
            { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'center', margin: [0, 5, 0, 20] },
            {
                table: {
                    headerRows: 1,
                    widths: [40, '*', 50],
                    body: [
                        [{ text: 'Nº', style: 'tableHeader', alignment: 'center' }, { text: 'Declaração', style: 'tableHeader', alignment: 'left' }, { text: 'Página', style: 'tableHeader', alignment: 'center' }],
                        ...titulosDeclaracoes.map((titulo, index) => [
                            { text: `${index + 1}`, alignment: 'center', fontSize: 10, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: titulo, linkToPage: index + 1, decoration: 'underline', color: 'blue', fontSize: 10, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: `${index + 1}`, alignment: 'center', fontSize: 10, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                        ])
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                    vLineWidth: () => 1,
                    hLineColor: () => '#003087',
                    vLineColor: () => '#003087',
                    paddingLeft: () => 10,
                    paddingRight: () => 10,
                    paddingTop: () => 8,
                    paddingBottom: () => 8
                },
                margin: [20, 10, 20, 30],
                alignment: 'center'
            },
            { text: `Por ser verdade, firmo o teor das declarações referenciais que compõem este arquivo.`, alignment: 'justify', fontSize: 12, margin: [20, 20, 20, 40] },
            { text: `${dados.municipio}/${dados.uf}, ${dados.diaAtual} de ${dados.mesAtual} de ${dados.anoAtual}.`, alignment: 'center', fontSize: 12, margin: [0, 20, 0, 40] },
            { text: `__________________________________________\n${dados.dirigente}\n(${dados.cargoDirigente})`, alignment: 'center', fontSize: 12 }
        ];

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, topMargin, 40, bottomMargin],
            background: finalLetterheadImage ? [{ image: finalLetterheadImage, width: 595, height: 842, absolutePosition: { x: 0, y: 0 }, opacity: 0.9 }] : null,
            footer: (currentPage, pageCount) => {
                if (currentPage === pageCount) {
                    return { text: `Documento composto por ${totalDeclaracoes} (${numeroParaExtenso(totalDeclaracoes)}) declarações referenciais, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`, alignment: 'center', fontSize: 9, margin: [40, 40, 40, 0] };
                }
                return {
                    stack: [
                        { text: 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as declarações anteriores.', alignment: 'center', fontSize: 9 },
                        { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 9, margin: [0, 5, 0, 0] }
                    ],
                    margin: [40, 20, 40, 0]
                };
            },
            content: [...allDeclarationsContent, ...summaryPage],
            styles: {
                header: { fontSize: 18, bold: true, color: '#003087', alignment: 'center' },
                subheader: { fontSize: 11, italic: true, color: '#333333', alignment: 'center' },
                tableHeader: { fontSize: 12, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'left' }
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
            isGeneratingPDF = false;
            return docDefinition;
        }

        const nomeArquivo = `declaracao_${dados.proposta.replace(/\//g, '-')}.pdf`;
        pdfMake.createPdf(docDefinition).download(nomeArquivo);
        showToast('PDF gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        showToast('Erro ao gerar PDF: ' + error.message, true);
    } finally {
        isGeneratingPDF = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gerarPDFButton = document.getElementById('gerarPDF');
    if (gerarPDFButton) {
        gerarPDFButton.addEventListener('click', () => gerarPDF());
    } else {
        console.error("Elemento 'gerarPDF' não encontrado.");
    }
});

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.backgroundColor = isError ? 'var(--error-color)' : 'var(--success-color)';
        toast.className = 'toast show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    } else {
        console.log(`Toast: ${message}`);
    }
}

const declaracoesCompletas = [
    { title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro que os recursos do presente convênio não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme Art. 167, X, CF/88 e Art. 25, § 1º, III, Lei Complementar nº 101/2000." },
    { title: "DECLARAÇÃO DE NÃO VÍNCULO", content: "Eu, [dirigente], matrícula [matricula], cargo [cargoDirigente], declaro, sob as penas da lei, que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [proposta], não possuem em seu quadro societário, cônjuge ou companheiro, bem como, vínculo de parentesco, colateral ou por afinidade, até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil." },
    { title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro que a proposta inserida no Sistema Transferegov sob o nº [proposta] e demais informações foram apresentados para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública." },
    { title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], DECLARO ao Ministério do Esporte - MESP, que a entidade a qual represento não recebe recursos financeiros de outra entidade para a mesma finalidade na execução das ações apresentadas na Proposta Nº [proposta]." },
    { title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal da [entidade], CNPJ Nº [cnpj], declaro que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico ou tenham participação societária de parentes de dirigentes." },
    { title: "DECLARAÇÃO DE COMPROMISSO", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro o compromisso de dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov." },
    { title: "DECLARAÇÃO DE CUSTOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], ATESTO a planilha de custos inseridas na Proposta n.º [proposta]." },
    { title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], DECLARO perante o Ministério do Esporte que o(a) [entidade] possui condições orçamentárias para arcar com as despesas decorrentes." }
];

const declaracoesEspecificas = {
    '00SL_emendas': [
        { title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro que o terreno é de domínio público e pertence ao Município de [municipio]/[uf], assim como está disponível, apto e compatível para instalação dos equipamentos.\nNome do Espaço Físico: [nomeEspacoFisico]; Endereço do Espaço Físico: [enderecoEspacoFisico]" },
        { title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, nos termos da Lei nº 10.098, de 19 de dezembro de 2000." },
        { title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro o compromisso de dispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [proposta]." }
    ],
    '00SL_comissao': [
        { title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro que o terreno é de domínio público e pertence ao Município de [municipio]/[uf], assim como está disponível, apto e compatível para instalação dos equipamentos.\nNome do Espaço Físico: [nomeEspacoFisico]; Endereço do Espaço Físico: [enderecoEspacoFisico]" },
        { title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, nos termos da Lei nº 10.098, de 19 de dezembro de 2000." },
        { title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro o compromisso de dispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [proposta]." }
    ],
    '20JP_emenda': [
        { title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], no que diz respeito à contratação de recursos humanos, declaro ter ciência de que: 1. A forma de contratação necessitará de análise da Consultoria Jurídica da Entidade Convenente, conforme Acórdão n.º 2588/2017 – TCU – Plenário; 2. O repasse de recursos seguirá os valores aprovados no Plano de Trabalho da Proposta n.º [proposta]; 3. O pagamento será realizado mensalmente conforme pactuado." }
    ],
    '20JP_comissao': [
        { title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], declaro ter ciência dos requisitos para contratação de recursos humanos conforme legislação vigente." },
        { title: "DECLARAÇÃO DE ADIMPLÊNCIA", content: "Eu, [dirigente], matrícula [matricula], na condição de representante legal do(a) [entidade], CNPJ Nº [cnpj], DECLARO que a presente Entidade não está inadimplente com a União." }
    ]
};