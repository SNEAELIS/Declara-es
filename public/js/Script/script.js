// =============================================================================
// script.js — Gerador de Declarações — Termo de Fomento
// Ministério do Esporte — Layout com cabeçalho, rodapé e índice final
// =============================================================================

// -----------------------------------------------------------------------------
// Lista de declarações
// -----------------------------------------------------------------------------
const declarations = [
    'NÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA',
    'AUSÊNCIA DE DESTINAÇÃO DE RECURSOS',
    'CUMPRIMENTO DO ART. 94 DA LEI Nº 15.321, DE 31 DE DEZEMBRO DE 2025',
    'NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA',
    'ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA',
    'NÃO OCORRÊNCIA DE IMPEDIMENTOS',
    'NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO',
    'COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS',
    'COMPROMISSO',
    'CUSTOS',
    'ADIMPLÊNCIA',
    'CIÊNCIA DOS DEVERES E RESPONSABILIDADES IMPOSTOS PELA LEGISLAÇÃO ELEITORAL',
    'INEXISTÊNCIA DE NEPOTISMO E VEDAÇÕES À DESTINAÇÃO E EXECUÇÃO DE EMENDAS PARLAMENTARES',
];

// -----------------------------------------------------------------------------
// Utilitários
// -----------------------------------------------------------------------------
function formatDate() {
    const t = new Date();
    return `${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}`;
}

function numToWords(n) {
    const units = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze'];
    return n <= 15 ? units[n] : String(n);
}

const cmToPoints = (cm) => cm * 28.3465;

// -----------------------------------------------------------------------------
// Imagem de fundo (papel timbrado)
// -----------------------------------------------------------------------------
const LETTERHEAD_URL = 'https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg';

async function getBase64Image(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        return new Promise((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result);
            r.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn('Timbrado não carregado:', e.message);
        return null;
    }
}

// -----------------------------------------------------------------------------
// Corpo de cada declaração (array de text nodes pdfmake)
// -----------------------------------------------------------------------------
function getDeclarationBody(title, f) {
    const { dirigente, cargoDirigente, entidade, cnpj, endereco, proposta } = f;

    const map = {
        'NÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento no âmbito do Ministério do Esporte - MESP, que a presente Entidade `,
            { text: 'não utilizará os recursos para finalidade alheia ao objeto da parceria', bold: true },
            `.\n\nPor ser expressão da verdade, firmo a presente declaração.`,
        ],
        'AUSÊNCIA DE DESTINAÇÃO DE RECURSOS': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro que os recursos do presente Termo de Fomento não se destinarão ao pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme art. 167, inciso X, da Constituição Federal de 1988 e art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000.\n\nPor ser expressão da verdade, firmo a presente declaração.`,
        ],
        'CUMPRIMENTO DO ART. 94 DA LEI Nº 15.321, DE 31 DE DEZEMBRO DE 2025': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, que a presente Entidade cumprirá com o disposto no art. 94, incisos V e IX, da Lei nº 15.321 de 31 de dezembro de 2025:\n\n• Compromisso da entidade beneficiada de disponibilizar ao cidadão, em seu sítio eletrônico ou, na falta deste, em sua sede, consulta ao extrato do convênio ou instrumento congênere, que conterá, no mínimo, o objeto, a finalidade e o detalhamento da aplicação dos recursos;\n• Inclusão de cláusula de reversão patrimonial no convênio ou instrumento congênere, válida até a depreciação integral do bem ou a amortização do investimento, que constituirá garantia real em favor do concedente em montante equivalente aos recursos de capital destinados à entidade, cuja execução ocorrerá caso se verifique desvio de finalidade ou aplicação irregular dos recursos.`,
        ],
        'NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere à situação cadastral dos fornecedores e à classificação de atividades econômicas – CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.`,
        ],
        'ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA': [
            `A ${entidade}, pessoa jurídica de direito privado, na forma de associação sem fins lucrativos, com sede na ${endereco}, inscrita no CNPJ nº ${cnpj}, neste ato representada por ${dirigente}, ${cargoDirigente}, declara para fins de cadastramento de celebração do presente Termo de Fomento junto ao Ministério do Esporte - MESP, que a ${entidade} é uma entidade viável e autônoma financeiramente, e que, de acordo com as demonstrações contábeis regularmente escrituradas, sob pena do art. 299 do Código Penal:\n\n• Compromete-se em manter a escrituração completa de suas receitas e despesas em livros revestidos das formalidades que assegurem a respectiva exatidão, de acordo com a legislação e normas editadas pelo Conselho Federal de Contabilidade;\n• Compromete-se a conservar em boa ordem, pelo prazo de cinco anos, contado da data da emissão, os documentos que comprovem a origem de suas receitas e a efetivação de suas despesas, bem como a realização de quaisquer outros atos ou operações que venham modificar a sua situação patrimonial;\n• Apresentar à Secretaria da Receita Federal do Brasil, anualmente, Declaração de Rendimentos, em conformidade com o disposto em ato daquele órgão, sem prejuízo da exigência de apresentação da cópia do respectivo recibo de entrega da referida Declaração de Rendimentos.`,
        ],
        'NÃO OCORRÊNCIA DE IMPEDIMENTOS': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, nos termos do art. 26, caput, inciso IX, do Decreto nº 8.726, de 2016, que a presente Entidade e seus dirigentes não incorrem em quaisquer das vedações previstas no art. 39 da Lei nº 13.019, de 2014. Nesse sentido:\n\n• Está regularmente constituída ou, se estrangeira, está autorizada a funcionar no território nacional;\n• Não está omissa no dever de prestar contas de parceria anteriormente celebrada; e\n• Não teve contas de parceria julgadas irregulares ou rejeitadas por Tribunal ou Conselho de Contas de qualquer esfera da Federação, em decisão irrecorrível, nos últimos 8 (oito) anos.`,
        ],
        'NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro ao Ministério do Esporte - MESP, que a entidade a qual represento apresentou informações para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, bem como não recebe recursos financeiros de outra entidade ou órgão (incluindo a Lei de Incentivo ao Esporte, a Lei Agnelo-Piva e/ou patrocínio de empresas estatais) para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta nº ${proposta}, cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.`,
        ],
        'COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, atesto que a presente entidade existe há, no mínimo, 3 (três) anos e possui o cadastro ativo, bem como experiência prévia na realização, com efetividade, no desenvolvimento do objeto proposto de natureza semelhante, assim como instalações, condições materiais e capacidade técnica e operacional para o desenvolvimento do objeto apresentado na Proposta nº ${proposta} e para o cumprimento das metas estabelecidas, em atendimento aos dispostos no art. 94, inciso XII, da Lei nº 15.321/2025 (LDO 2026), no art. 33, inciso V, da Lei nº 13.019/2014 e no art. 26, incisos I, II e III, do Decreto nº 8.726/2016.`,
        ],
        'COMPROMISSO': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro o compromisso de:\n\n• Dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até a prestação de contas final;\n• Dar publicidade ao Projeto/Programa durante toda a execução, em observância à aplicação dos selos e marcas adotadas pelo Ministério do Esporte - MESP e Governo Federal, de acordo com o estipulado no Manual de Selos e Marcas do Governo Federal, inclusive, em ações de Patrocínio;\n• Previamente à confecção dos materiais, encaminhar para aprovação os layouts, juntamente com o número do instrumento, processo e nome do programa/projeto/evento, para o e-mail: publicidade.cgce@esporte.gov.br.`,
        ],
        'CUSTOS': [
            `Eu, ${dirigente}, na qualidade de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, atesto a veracidade da planilha de custos, bem como das cotações obtidas, conforme disposto no art. 25, § 1º, do Decreto nº 8.726, de 27 de abril de 2016, inseridas no Sistema Eletrônico Transferegov, Proposta nº ${proposta}. Declaro que os custos apresentados estão compatíveis com os valores praticados no mercado.`,
        ],
        'ADIMPLÊNCIA': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade: Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS), com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares.`,
        ],
        'CIÊNCIA DOS DEVERES E RESPONSABILIDADES IMPOSTOS PELA LEGISLAÇÃO ELEITORAL': [
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob nº ${cnpj}, Declaro, sob as penas da lei e passível de devolução dos recursos do Termo de Fomento nº ${proposta}:\n\n1. Estar ciente das condutas vedadas aos agentes públicos durante o período do defeso eleitoral, de acordo com disposto no caput do art. 73 da Lei nº 9.504 de 1997;\n2. Estar ciente de que as condutas vedadas dispensam comprovação de dolo ou culpa, sendo cláusulas de responsabilidade objetiva;\n3. Que a presente Entidade não possui dentro do quadro de dirigentes candidatos ao pleito eleitoral;\n4. Que não será permitido no âmbito do Termo de Fomento nº ${proposta} a distribuição de brindes ou outros bens que possam proporcionar vantagem ao eleitor durante o período de campanha eleitoral;\n5. Que não será permitido o uso promocional em favor de candidatos, partidos políticos ou coligações, na distribuição de bens e serviços de caráter social custeados pelo Termo de Fomento nº ${proposta};\n6. Que não será permitida qualquer promoção pessoal ou condutas que afetem a igualdade de oportunidades entre candidatos nos pleitos eleitorais;\n7. Que não será realizada publicidade institucional de atos, programas, obras, serviços e campanhas dos órgãos públicos federais;\n8. Estar ciente do inteiro teor da Cartilha de Condutas Vedadas aos Agentes Públicos Federais em Eleições, disponível no site do governo.\n\nPor ser expressão da verdade, firmo a presente declaração.`,
        ],
        'INEXISTÊNCIA DE NEPOTISMO E VEDAÇÕES À DESTINAÇÃO E EXECUÇÃO DE EMENDAS PARLAMENTARES': [
            `${entidade}, inscrita no CNPJ sob o nº ${cnpj}, com sede em ${endereco}, por intermédio de seu representante legal abaixo assinado, o(a) Sr.(a) ${dirigente}, na condição de ${cargoDirigente}, para fins de celebração de Termo de Fomento no âmbito do Ministério do Esporte - MESP, DECLARA, sob as penas da lei:\n\n`,
            `1. Que a entidade não possui, em seus quadros diretivos e administrativos, pessoas que sejam cônjuges, companheiros ou parentes, em linha reta, colateral ou por afinidade, até o terceiro grau, inclusive:\n`,
            `   • Do parlamentar responsável pela indicação da emenda que originou o recurso;\n`,
            `   • De assessores parlamentares vinculados ao referido parlamentar.\n\n`,
            `2. Que a entidade está ciente de que a indicação por parlamentar a familiares configura violação à Súmula Vinculante nº 13 do Supremo Tribunal Federal, bem como ao art. 11, XI, da Lei nº 8.429/1992, caracterizando-se em nepotismo e ato de improbidade administrativa, respectivamente.\n\n`,
            `3. Que a entidade se compromete a não realizar contratações, subcontratações ou intermediações de pessoas físicas ou jurídicas que possuam, em seu quadro de sócios, dirigentes, prestadores de serviço ou fornecedores de bens, as pessoas mencionadas no item "1", visando garantir que nenhum destes seja o beneficiário final do recurso público.\n\n`,
            `4. Que a entidade possui plena autonomia administrativa e financeira e que os recursos recebidos serão executados estritamente para o objeto pactuado, observando-se os princípios da impessoalidade e moralidade.\n\n`,
            `A presente declaração é a expressão da verdade e a entidade assume total responsabilidade pela veracidade destas informações, ciente de que a falsidade poderá acarretar a rescisão imediata da parceria e a aplicação de sanções administrativas e penais cabíveis.`
        ],
    };

    return map[title] || [`Declaração "${title}" não encontrada.`];
}

// -----------------------------------------------------------------------------
// Cabeçalho de página (nome entidade + endereço + linha)
// -----------------------------------------------------------------------------
function buildPageHeader(f) {
    return [
        {
            text: f.entidade || '',
            bold: true, alignment: 'center', fontSize: 13, margin: [0, 0, 0, 2]
        },
        {
            text: f.endereco || '',
            fontSize: 9, alignment: 'center', margin: [0, 0, 0, 0]
        },
        {
            canvas: [{
                type: 'line', x1: 70, y1: 12, x2: 445, y2: 12,
                lineWidth: 0.5, lineColor: '#cccccc'
            }],
            margin: [0, 0, 0, 22]
        }
    ];
}

// -----------------------------------------------------------------------------
// Uma página de declaração completa
// -----------------------------------------------------------------------------
function buildDeclarationPage(title, f) {
    return [
        ...buildPageHeader(f),
        {
            text: `DECLARAÇÃO\n${title}`,
            style: 'declTitle',
            alignment: 'center',
            margin: [0, 0, 0, 28],
        },
        {
            text: getDeclarationBody(title, f),
            alignment: 'justify',
            fontSize: 12,
            lineHeight: 1.3,
        },
    ];
}

// -----------------------------------------------------------------------------
// Última página: Índice de Declarações Referenciais
// -----------------------------------------------------------------------------
function buildIndexPage(orderedDeclarations, f) {
    const tableBody = [
        [
            { text: 'Página',     style: 'tableHeader' },
            { text: 'DECLARAÇÃO', style: 'tableHeader' },
        ],
        ...orderedDeclarations.map((title, idx) => [
            {
                text: `${idx + 1}`,
                alignment: 'center', fontSize: 9,
                fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF',
            },
            {
                text: `Declaração ${title}`,
                fontSize: 9, alignment: 'left',
                color: '#003087', decoration: 'underline',
                fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF',
            },
        ])
    ];

    return [
        ...buildPageHeader(f),
        {
            text: 'Declarações Referenciais',
            style: 'declTitle', alignment: 'center', margin: [0, 20, 0, 10]
        },
        {
            text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.',
            fontSize: 10, italic: true, color: '#333333',
            alignment: 'justify', margin: [0, 5, 0, 10]
        },
        {
            table: { headerRows: 1, widths: [40, '*'], body: tableBody },
            layout: {
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                vLineWidth: () => 1,
                hLineColor: () => '#003087',
                vLineColor: () => '#003087',
                paddingLeft: () => 5, paddingRight: () => 5,
                paddingTop: () => 3,  paddingBottom: () => 3,
            },
            margin: [0, 5, 0, 20],
        },
        {
            text: 'Por ser verdade, firmo o teor das declarações que compõem este arquivo:',
            alignment: 'justify', fontSize: 11, margin: [0, 10, 0, 20]
        },
        {
            text: `${(f.municipio || '').toUpperCase()}/${(f.uf || '').toUpperCase()}, na data da assinatura eletrônica.`,
            alignment: 'center', fontSize: 11, margin: [0, 10, 0, 30]
        },
        {
            text: '__________________________________________',
            alignment: 'center', fontSize: 11, margin: [0, 0, 0, 8]
        },
        {
            text: f.dirigente || '',
            alignment: 'center', bold: true, fontSize: 11, margin: [0, 0, 0, 4]
        },
        {
            text: f.cargoDirigente || '',
            alignment: 'center', italic: true, fontSize: 11, margin: [0, 0, 0, 0]
        },
    ];
}

// -----------------------------------------------------------------------------
// buildDocDefinition — monta o documento pdfmake completo
// -----------------------------------------------------------------------------
function buildDocDefinition(orderedDeclarations, f, bgImage, layoutOptions = {}) {
    const topMarginPts = layoutOptions.topMargin    ?? cmToPoints(3.8);
    const botMarginPts = layoutOptions.bottomMargin ?? cmToPoints(3.2);

    // Conteúdo: declarações + índice
    const content = [];
    orderedDeclarations.forEach((title, idx) => {
        content.push(...buildDeclarationPage(title, f));
        content.push({ text: '', pageBreak: 'after' }); // sempre quebra, incluindo antes do índice
    });
    content.push(...buildIndexPage(orderedDeclarations, f));

    return {
        pageSize:    'A4',
        pageMargins: [56.69, topMarginPts, 56.69, botMarginPts],

        // Timbrado em todas as páginas
        background: bgImage
            ? () => ({
                image:            bgImage,
                width:            595.28,
                height:           841.89,
                absolutePosition: { x: 0, y: 0 },
                opacity:          1.0,
              })
            : undefined,

        // Rodapé dinâmico
        footer: (currentPage, pageCount) => ({
            margin: [56.69, 4, 56.69, 0],
            stack: [
                {
                    columns: [
                        {
                            text: currentPage < pageCount
                                ? 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as páginas anteriores.'
                                : `Documento composto por ${orderedDeclarations.length} (${numToWords(orderedDeclarations.length)}) declarações, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`,
                            fontSize: 8, color: '#555555', alignment: 'left',
                        },
                        {
                            text: `Página ${currentPage} de ${pageCount}`,
                            fontSize: 8, color: '#555555', alignment: 'right',
                        },
                    ]
                },
                {
                    canvas: [{
                        type: 'line', x1: 0, y1: 6, x2: 481.89, y2: 6,
                        lineWidth: 1, lineColor: '#003087'
                    }]
                }
            ]
        }),

        content,

        styles: {
            declTitle: {
                fontSize: 13, bold: true, color: '#003087',
            },
            tableHeader: {
                fontSize: 10, bold: true,
                color: '#FFFFFF', fillColor: '#003087', alignment: 'center',
            },
        },

        permissions: {
            printing:             'highResolution',
            modifying:            false,
            copying:              false,
            annotating:           false,
            fillingForms:         false,
            contentAccessibility: false,
            documentAssembly:     false,
        },
    };
}

// -----------------------------------------------------------------------------
// generatePdfDocDefinition — para pré-visualização no modal
// -----------------------------------------------------------------------------
async function generatePdfDocDefinition(orderedDeclarations, letterheadFile, layoutOptions, formData) {
    const bgImage = await getBase64Image(LETTERHEAD_URL);
    return buildDocDefinition(orderedDeclarations, formData, bgImage, layoutOptions);
}

// -----------------------------------------------------------------------------
// generateAllDeclarationsPDF — chamada pelo botão "Gerar Declarações"
// -----------------------------------------------------------------------------
async function generateAllDeclarationsPDF(orderedDeclarations, layoutOptions, formData) {
    const bgImage  = await getBase64Image(LETTERHEAD_URL);
    const doc      = buildDocDefinition(orderedDeclarations, formData, bgImage, layoutOptions);
    const entNome  = (formData.entidade || 'Entidade').replace(/\s+/g, '_').substring(0, 40);
    const proposta = (formData.proposta  || '').replace(/\//g, '-');
    const fileName = `Declaracoes_Termo_Fomento_${entNome}_${proposta}.pdf`;

    return new Promise((resolve) => {
        pdfMake.createPdf(doc).download(fileName, resolve);
    });
}