// Flag para evitar cliques múltiplos
let isGeneratingPDF = false;

// Função para validar dados obrigatórios
function validarDadosFormulario(dados) {
    const camposObrigatorios = [
        'nome', 'matricula', 'cargoDirigente', 'proposta', 'cnpj', 'entidade',
        'endereco', 'uf', 'municipio', 'cep', 'opcaoSelecao'
    ];
    const erros = [];

    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].trim() === '') {
            erros.push(`O campo ${campo} é obrigatório.`);
        }
    }

    if (dados.opcaoSelecao.startsWith('00SL') && (!dados.espacosFisicos || dados.espacosFisicos.length === 0)) {
        erros.push('Pelo menos um espaço físico deve ser informado para propostas 00SL.');
    }

    return erros;
}

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

// Função para capturar dados do formulário
function capturarDadosFormulario() {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const imagens = Array.from(document.getElementById('imagens')?.files || []);
    const descricoes = imagens.map((_, index) => getValue(`descricao${index}`));
    const dataAtual = new Date();
    const diaAtual = String(dataAtual.getDate()).padStart(2, '0');
    const mesAtual = dataAtual.toLocaleString('pt-BR', { month: 'long' });
    const anoAtual = dataAtual.getFullYear();

    const espacosFisicos = [];
    document.querySelectorAll('[id^="nomeEspacoFisico"]').forEach((_, i) => {
        espacosFisicos.push({
            nome: getValue(`nomeEspacoFisico${i}`) || 'Espaço físico não informado',
            endereco: getValue(`enderecoEspacoFisico${i}`) || 'Endereço do espaço físico não informado'
        });
    });

    return {
        nome: getValue('dirigente'),
        matricula: getValue('matricula'),
        cargoDirigente: getValue('cargoDirigente'),
        proposta: getValue('proposta'),
        cnpj: getValue('cnpj'),
        entidade: getValue('entidade'),
        endereco: getValue('endereco'),
        uf: getValue('uf'),
        municipio: getValue('municipio'),
        cep: getValue('cep'),
        temAquisicao: document.getElementById('temAquisicao')?.checked || false,
        opcaoSelecao: getValue('opcaoSelecao'),
        espacosFisicos,
        imagens,
        descricoes,
        diaAtual,
        mesAtual,
        anoAtual
    };
}

// Substitui placeholders no texto
function substituirPlaceholders(texto, dados) {
    return texto
        .replace(/\[NOME\]/g, dados.nome || 'Nome não informado')
        .replace(/\[MATRICULA\]/g, dados.matricula || 'Matrícula não informada')
        .replace(/\[CARGO_DIRIGENTE\]/g, dados.cargoDirigente || 'Cargo não informado')
        .replace(/\[ENTIDADE\]/g, dados.entidade || 'Entidade não informada')
        .replace(/\[CNPJ\]/g, dados.cnpj || 'CNPJ não informado')
        .replace(/\[ENDERECO\]/g, dados.endereco || 'Endereço não informado')
        .replace(/\[UF\]/g, dados.uf || 'UF não informada')
        .replace(/\[MUNICIPIO\]/g, dados.municipio || 'Município não informado')
        .replace(/\[CEP\]/g, dados.cep || 'CEP não informado')
        .replace(/\[PROPOSTA\]/g, dados.proposta || 'Proposta não informada')
        .replace(/\[DIA_ATUAL\]/g, dados.diaAtual)
        .replace(/\[MES_ATUAL\]/g, dados.mesAtual)
        .replace(/\[ANO_ATUAL\]/g, dados.anoAtual);
}

// Converte número em texto por extenso
function numeroParaExtenso(num) {
    const unidades = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    if (num < 20) return unidades[num];
    if (num < 100) return dezenas[Math.floor(num / 10)] + (num % 10 !== 0 ? ' e ' + unidades[num % 10] : '');
    return num.toString();
}

// Função principal para gerar o PDF
async function gerarPDF() {
    if (isGeneratingPDF) {
        console.log('Geração de PDF já em andamento. Ignorando solicitação.');
        return;
    }
    isGeneratingPDF = true;

    try {
        const dados = capturarDadosFormulario();
        console.log('Iniciando geração do PDF com dados:', JSON.stringify(dados, null, 2));

        const erros = validarDadosFormulario(dados);
        if (erros.length > 0) {
            showToast(`Erro: ${erros.join(' ')}`, true);
            console.error('Validação falhou:', erros);
            isGeneratingPDF = false;
            return;
        }

        const opcao = dados.opcaoSelecao;
        if (!opcao || !declaracoesEspecificas[opcao]) {
            showToast('Selecione uma opção válida antes de gerar o PDF.', true);
            console.error('Opção inválida:', opcao);
            isGeneratingPDF = false;
            return;
        }

        const watermarkImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
        if (!watermarkImage) {
            console.warn('Imagem de fundo não carregada. Prosseguindo sem ela.');
        }

        const imageBase64Array = await Promise.all(
            (dados.imagens || []).map(file => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }))
        );

        const imageContent = imageBase64Array.flatMap((base64, index) => ([
            { text: '', pageBreak: 'before' },
            { image: base64, width: 200, margin: [0, 20, 0, 5], alignment: 'center' },
            { text: dados.descricoes[index] || `Imagem ${index + 1}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 20] }
        ]));
        
        // Função para criar conteúdo de uma declaração
        const createDeclarationContent = (declaracao, isLastDeclaration = false) => {
            let content = substituirPlaceholders(declaracao.content, dados);
            let contentArray = [{ text: content, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 40] }];

            if (['00SL_emendas', '00SL_comissao'].includes(opcao) && declaracao.title === "DECLARAÇÃO DE TITULARIDADE DO TERRENO") {
                const tableData = dados.espacosFisicos.map(espaco => [espaco.nome, espaco.endereco]);
                if (tableData.length > 0) {
                    contentArray = [
                        { text: content.replace(/Nome do Espaço Físico:.*?\[ENDERECO_ESPACO_FISICO\]/, '').trim(), alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 0] },
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [[{ text: 'Nome do Espaço Físico', bold: true }, { text: 'Endereço do Espaço Físico', bold: true }], ...tableData]
                            },
                            layout: 'lightHorizontalLines', margin: [0, 10, 0, 20]
                        }
                    ];
                }
            }

            // Bloco da declaração sem assinatura individual, mas com quebra de página
            return [
                { text: substituirPlaceholders(declaracao.title, dados), style: 'header', alignment: 'center', margin: [0, 100, 0, 20] },
                ...contentArray,
                { text: '', pageBreak: isLastDeclaration ? undefined : 'after' }
            ];
        };
        
        // Monta a lista completa de declarações
        let declaracoesParaIncluir = [
            ...declaracoesCompletas.filter(decl => {
                const ehSustentabilidade = decl.title === "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO";
                const condicaoSustentabilidade = opcao.startsWith('00SL') || (dados.temAquisicao && opcao.startsWith('20JP'));
                return !ehSustentabilidade || condicaoSustentabilidade;
            }),
            ...declaracoesEspecificas[opcao]
        ];

        // Gera o conteúdo de todas as declarações
        const allDeclarationsContent = declaracoesParaIncluir.flatMap((declaracao, index) =>
            createDeclarationContent(declaracao, index === declaracoesParaIncluir.length - 1)
        );

        // Cria a página de sumário e assinatura com tabela profissional
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
                        [
                            { text: 'Nº', style: 'tableHeader', alignment: 'center' },
                            { text: 'Declaração', style: 'tableHeader', alignment: 'left' },
                            { text: 'Página', style: 'tableHeader', alignment: 'center' }
                        ],
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
            { text: `__________________________________________\n${dados.nome}\n(${dados.cargoDirigente})`, alignment: 'center', fontSize: 12 }
        ];

        const allContent = [...allDeclarationsContent, ...imageContent, ...summaryPage];

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 80],
            background: (currentPage, pageCount) => {
                if (currentPage === pageCount) return null;
                return watermarkImage ? [{ image: watermarkImage, width: 595, height: 842, absolutePosition: { x: 0, y: 0 }, opacity: 0.9 }] : null;
            },
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
            content: allContent,
            styles: {
                header: { fontSize: 18, bold: true, color: '#003087', alignment: 'center' },
                subheader: { fontSize: 11, italic: true, color: '#333333', alignment: 'center' },
                tableHeader: { fontSize: 12, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'left' }
            },
            defaultStyle: { font: 'Roboto' },
            permissions: {
                printing: 'lowResolution', // Permite impressão em baixa resolução
                modifying: false, // Impede modificações
                copying: false, // Impede cópia de conteúdo
                annotating: false, // Impede anotações
                fillingForms: false, // Impede preenchimento de formulários
                contentAccessibility: false, // Impede acessibilidade de conteúdo
                documentAssembly: false // Impede montagem de documentos
            }
        };

        const nomeArquivo = `${opcao}_${dados.nome.replace(/\s+/g, '_') || 'documento'}_${dados.proposta.replace(/\//g, '-')}.pdf`;
        pdfMake.createPdf(docDefinition).download(nomeArquivo);
        showToast('PDF gerado com sucesso!');

    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        showToast('Erro ao gerar o PDF: ' + error.message, true);
    } finally {
        isGeneratingPDF = false;
    }
}

// Evento para o botão de gerar PDF
document.addEventListener('DOMContentLoaded', () => {
    const gerarPDFButton = document.getElementById('gerarPDF');
    if (!gerarPDFButton) {
        console.error("Elemento 'gerarPDF' não encontrado.");
        return;
    }

    const handler = () => {
        console.log('Botão Gerar PDF clicado.');
        gerarPDF();
    };

    gerarPDFButton.removeEventListener('click', handler);
    gerarPDFButton.addEventListener('click', handler);

    const imagensInput = document.getElementById('imagens');
    const descricaoContainer = document.getElementById('descricaoImagens');
    if (imagensInput && descricaoContainer) {
        imagensInput.addEventListener('change', function () {
            descricaoContainer.innerHTML = '';
            Array.from(this.files).forEach((file, index) => {
                const div = document.createElement('div');
                div.innerHTML = `<div class="form-row"><label for="descricao${index}">Descrição da Imagem ${index + 1}:</label><textarea id="descricao${index}" rows="2" style="width: 100%;"></textarea></div>`;
                descricaoContainer.appendChild(div);
            });
        });
    }
});

// Função para exibir toast
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

// Declarações
const declaracoesCompletas = [
    {
        title: "DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que os recursos do presente convênio não se destinarão para o pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme Art. 167, X, CF/88 e Art. 25, § 1º, III, Lei Complementar nº 101/2000.`
    },
    {
        title: "DECLARAÇÃO DE NÃO VÍNCULO",
        content: `Eu, [NOME], matrícula [MATRICULA], cargo [CARGO_DIRIGENTE], declaro, sob as penas da lei, em especial a do art. 299 do Código Penal Brasileiro, que as Empresas a serem contratadas no âmbito do Convênio a ser celebrado com o Ministério do Esporte - MESP, sob o número da Proposta nº [PROPOSTA], não possuem em seu quadro societário, cônjuge ou companheiro, bem como, vínculo de parentesco, colateral ou por afinidade, até o terceiro grau, ou de natureza técnica, comercial, econômica, financeira, trabalhista e civil.`
    },
    {
        title: "DECLARAÇÃO NEGATIVA DE DUPLICIDADE DE CONVÊNIO",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro para os devidos fins de celebração de convênios junto ao Ministério do Esporte - MESP, que a proposta inserida no Sistema Transferegov sob o nº [PROPOSTA] e demais informações foram apresentados para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, ficando, portanto, sujeito às sanções civis, administrativas e penais cabíveis no caso de comprovada a falsidade ideológica.`
    },
    {
        title: "DECLARAÇÃO NÃO RECEBE RECURSOS DE OUTRA ENTIDADE PARA A MESMA FINALIDADE",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO ao Ministério do Esporte - MESP, que a entidade a qual represento não recebe recursos financeiros de outra entidade para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta Nº [PROPOSTA], cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.`
    },
    {
        title: "DECLARAÇÃO NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal da [ENTIDADE], CNPJ Nº [CNPJ], declaro para os devidos fins de celebração do Termo de Convênio, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas - CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.`
    },
    {
        title: "DECLARAÇÃO DE COMPROMISSO",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até prestação de contas final.`
    },
    {
        title: "DECLARAÇÃO DE CUSTOS",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], ATESTO a planilha de custos, bem como as cotações obtidas, conforme Instrução Normativa SEGES/ME n.º 65, de 7 julho de 2021, inseridas no Sistema Eletrônico Transferegov, Proposta n.º [PROPOSTA].\n\nAdemais, DECLARO que os custos apresentados estão de acordo com os praticados no mercado.`
    },
    {
        title: "DECLARAÇÃO DE SUSTENTABILIDADE DO OBJETO",
        content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO perante o Ministério do Esporte, para fins de celebração de convênio, que o(a) [ENTIDADE], possui condições orçamentárias para arcar com as despesas dela decorrentes e meios que garantam a sustentabilidade do objeto, por se tratar da aquisição de bens de capital.`
    }
];

const declaracoesEspecificas = {
    '00SL_emendas': [
        {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno é de domínio público e pertence ao Município de [MUNICIPIO]/[UF], assim como está disponível, apto e compatível para instalação dos equipamentos.\n\nNome do Espaço Físico: [NOME_ESPACO_FISICO]; Endereço do Espaço Físico: [ENDERECO_ESPACO_FISICO]`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, e dá outras providências ao projeto, nos termos da Lei nº 10.098, de 19 de dezembro de 2000 e demais legislações e normativas aplicáveis.\n\nDECLARO, outrossim, sob as penas da lei, estar plenamente ciente do teor e da extensão desta declaração e deter plenos poderes e informações para firmá-la.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de:\n\nDispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [PROPOSTA].`
        }
    ],
    '00SL_comissao': [
       {
            title: "DECLARAÇÃO DE TITULARIDADE DO TERRENO",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro que o terreno é de domínio público e pertence ao Município de [MUNICIPIO]/[UF], assim como está disponível, apto e compatível para instalação dos equipamentos.\n\nNome do Espaço Físico: [NOME_ESPACO_FISICO]; Endereço do Espaço Físico: [ENDERECO_ESPACO_FISICO]`
        },
        {
            title: "DECLARAÇÃO DE CONFORMIDADE EM ACESSIBILIDADE",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, que serão garantidos os meios necessários para acessibilidade de pessoas com deficiência ou com mobilidade reduzida, e dá outras providências ao projeto, nos termos da Lei nº 10.098, de 19 de dezembro de 2000 e demais legislações e normativas aplicáveis.\n\nDECLARO, outrossim, sob as penas da lei, estar plenamente ciente do teor e da extensão desta declaração e deter plenos poderes e informações para firmá-la.`
        },
        {
            title: "DECLARAÇÃO DE CUSTEIO DA INSTALAÇÃO DOS EQUIPAMENTOS",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], declaro o compromisso de:\n\nDispor de recursos financeiros para custear a instalação dos equipamentos pactuados na proposta n.º [PROPOSTA].`
        }
    ],
    '20JP_emenda': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], no que diz respeito à contratação de recursos humanos, declaro ter ciência de que:\n\n1. A forma de contratação necessitará de análise da Consultoria Jurídica da Entidade Convenente, a qual deverá observar as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário, Portaria Conjunta MGI/MF/AGU n.º 33, de 30 de agosto de 2023 e demais legislações pertinentes.\n\n2. O repasse de recursos financeiros para custeio desta ação, no que tange ao pagamento dos profissionais e encargos sociais e trabalhistas, seguirá os valores e os percentuais aprovados no Plano de Trabalho da Proposta n.º [PROPOSTA]. Assim, caso os encargos sociais e/ou trabalhistas ultrapassem o limite estabelecido, a Entidade arcará com esta despesa.\n\n3. O valor total do recurso, destinado ao pagamento dos profissionais, encargos sociais e/ou trabalhistas, será obrigatoriamente pago mensalmente, conforme pactuado no Plano de Trabalho e em observância ao que segue:\n\n· Pagamento dos Profissionais: no mês seguinte da prestação dos serviços; e\n\n· Pagamento dos Encargos Sociais e/ou Trabalhistas: deverá acompanhar periodicidade dos pagamentos realizados aos recursos humanos vinculados.`
        }
    ],
    '20JP_comissao': [
        {
            title: "DECLARAÇÃO DE CIÊNCIA DOS REQUISITOS PARA CONTRATAÇÃO DE RECURSOS HUMANOS",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], no que diz respeito à contratação de recursos humanos, declaro ter ciência de que:\n\n1. A forma de contratação necessitará de análise da Consultoria Jurídica da Entidade Convenente, a qual deverá observar as orientações contidas no Acórdão n.º 2588/2017 – TCU – Plenário, Portaria Conjunta MGI/MF/AGU n.º 33, de 30 de agosto de 2023 e demais legislações pertinentes.\n\n2. O repasse de recursos financeiros para custeio desta ação, no que tange ao pagamento dos profissionais e encargos sociais e trabalhistas, seguirá os valores e os percentuais aprovados no Plano de Trabalho da Proposta n.º [PROPOSTA]. Assim, caso os encargos sociais e/ou trabalhistas ultrapassem o limite estabelecido, a Entidade arcará com esta despesa.\n\n3. O valor total do recurso, destinado ao pagamento dos profissionais, encargos sociais e/ou trabalhistas, será obrigatoriamente pago mensalmente, conforme pactuado no Plano de Trabalho e em observância ao que segue:\n\n· Pagamento dos Profissionais: no mês seguinte da prestação dos serviços; e\n\n· Pagamento dos Encargos Sociais e/ou Trabalhistas: deverá acompanhar periodicidade dos pagamentos realizados aos recursos humanos vinculados.`
        },
        {
            title: "DECLARAÇÃO DE ADIMPLÊNCIA",
            content: `Eu, [NOME], matrícula [MATRICULA], na condição de representante legal do(a) [ENTIDADE], CNPJ Nº [CNPJ], DECLARO, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade:\n\nNão está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS, com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares).`
        }
    ]
};