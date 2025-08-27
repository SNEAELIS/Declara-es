// ---------------------------------------------------------------------------------
// AUXILIARY FUNCTIONS FOR BASE64 CONVERSION
// ---------------------------------------------------------------------------------

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

// Global declaration list
const declarations = [
    'NÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA',
    'AUSÊNCIA DE DESTINAÇÃO DE RECURSOS',
    'CUMPRIMENTO DO ART 89 DA LEI Nº 15.080, DE 30 DE DEZEMBRO DE 2024',
    'NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA',
    'ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA',
    'NÃO OCORRÊNCIA DE IMPEDIMENTOS',
    'NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO',
    'COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS',
    'COMPROMISSO',
    'CUSTOS',
    'ADIMPLÊNCIA',
    'CIÊNCIA DO ART. 42, INCISO XIX, DA LEI Nº 13.019/2014'
];

// ---------------------------------------------------------------------------------
// MAIN PDF GENERATION LOGIC
// ---------------------------------------------------------------------------------

function createHeader(formData) {
    return [
        { text: formData.entidade || 'ASSOCIACAO MORIA', bold: true, alignment: 'center', fontSize: 14, margin: [0, 0, 0, 2] },
        { text: formData.endereco || 'SRTVN QD 701 CONJUNTO C ALA B SN - ASA NORTE, SALA 603 CENTRO EMPRESARIAL NORTE', fontSize: 10, alignment: 'center' },
        { canvas: [{ type: 'line', x1: 70, y1: 15, x2: 445, y2: 15, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 0, 0, 25] }
    ];
}

async function generatePdfDocDefinition(orderedDeclarationsList = null, letterheadImageBase64 = null, layoutOptions = {}, formData = {}) {
    if (!window.pdfMake) return null;

    const finalDeclarations = orderedDeclarationsList || declarations;
    if (!finalDeclarations?.length) return null;

    const dataExtenso = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

    const finalLetterheadImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');

    const defaults = { leftRightMargin: 40, topMargin: 130, bottomMargin: 100, footerPosY: 770 };
    const { topMargin = defaults.topMargin, footerPosition = defaults.footerPosY } = { ...defaults, ...layoutOptions };
    const bottomMargin = Math.max(100, 841.89 - footerPosition - 40);

    const allPagesContent = finalDeclarations.map((title, index) => {
        return {
            pageBreak: index < finalDeclarations.length - 1 ? 'after' : undefined,
            margin: [defaults.leftRightMargin, topMargin, defaults.leftRightMargin, bottomMargin],
            stack: [
                ...createHeader(formData),
                { text: `DECLARAÇÃO\n${title}`, style: 'header', alignment: 'center', margin: [0, 0, 0, 30] },
                { text: getDeclarationContent(title, formData), alignment: 'justify', fontSize: 12, lineHeight: 1.15 }
            ]
        };
    }).concat({
        pageBreak: 'before',
        margin: [40, 100.249, 40, 100],
        stack: [
            ...createHeader(formData),
            { text: 'Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 40, 0, 15] },
            { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'justify', margin: [0, 5, 0, 5] },
            {
                table: {
                    headerRows: 1,
                    widths: [40, '*'],
                    body: [
                        [{ text: 'Página', style: 'tableHeader' }, { text: 'DECLARAÇÃO', style: 'tableHeader' }],
                        ...finalDeclarations.map((titulo, idx) => [
                            { text: `${idx + 1}`, alignment: 'center', fontSize: 9, fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: `Declaração ${titulo}`, linkToPage: idx + 1, decoration: 'underline', color: '#003087', fontSize: 9, alignment: 'left', fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                        ])
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                    vLineWidth: () => 1,
                    hLineColor: () => '#003087',
                    vLineColor: () => '#003087',
                    paddingLeft: () => 5, paddingRight: () => 5,
                    paddingTop: () => 2, paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5],
                alignment: 'center'
            },
            { text: `Por ser verdade, firmo o teor das declarações que compõem este arquivo:`, alignment: 'justify', fontSize: 11, margin: [0, 20, 0, 20] },
            { text: `${(formData.municipio || '').toUpperCase()}/${(formData.uf || '').toUpperCase()}, Na data da assinatura.`, alignment: 'center', fontSize: 11, margin: [0, 20, 0, 20] },
            { text: '__________________________________________', alignment: 'center', fontSize: 11, margin: [0, 20, 0, 10] },
            { text: formData.dirigente || 'Pedro Dias', alignment: 'center', bold: true, fontSize: 11, margin: [0, 0, 0, 10] },
            { text: `${formData.cargoDirigente || 'Presidente'}`, alignment: 'center', italic: true, fontSize: 11, margin: [0, 0, 0, 10] }
        ]
    });

    return {
        pageSize: 'A4',
        pageMargins: [defaults.leftRightMargin, 0, defaults.leftRightMargin, bottomMargin],
        background: (currentPage, pageCount) => 
            finalLetterheadImage 
                ? { image: finalLetterheadImage, width: 595.28, height: 841.89, absolutePosition: { x: 0, y: 0 }, opacity: 1.0 }
                : null,
        footer: (currentPage, pageCount) => {
            return {
                margin: [40, 0, 40, 0],
                stack: [
                    {
                        columns: [
                            { 
                                text: currentPage < pageCount 
                                    ? 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as páginas anteriores.' 
                                    : `Documento composto por ${finalDeclarations.length} (${numToWords(finalDeclarations.length)}) declarações, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`, 
                                fontSize: 8.5, 
                                color: '#555555', 
                                alignment: 'left' 
                            },
                            { text: `Página ${currentPage} de ${pageCount}`, fontSize: 8.5, color: '#555555', alignment: 'right' }
                        ]
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1, lineColor: '#003087' }] }
                ]
            };
        },
        content: allPagesContent,
        styles: {
            header: { fontSize: 14, bold: true, color: '#003087', alignment: 'center' },
            subheader: { fontSize: 10, italic: true, color: '#333333', alignment: 'justify' },
            tableHeader: { fontSize: 10, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'center' }
        },
        defaultStyle: { font: 'Roboto' }
    };
}

async function generateAllDeclarationsPDF(orderedDeclarationsList = null, customLayoutOptions = {}, programmaticFormData = {}) {
    if (!window.pdfMake) {
        console.error("pdfMake is not loaded. Cannot generate PDF.");
        alert("Erro: A biblioteca pdfMake não foi carregada. Verifique as dependências.");
        return;
    }

    const getInputValue = id => document.getElementById(id)?.value || '';

    const formDataFromDom = {
        dirigente: getInputValue('dirigente') || 'Pedro Dias',
        cargoDirigente: getInputValue('cargoDirigente') || 'Presidente',
        entidade: getInputValue('entidade') || 'ASSOCIACAO MORIA',
        cnpj: getInputValue('cnpj') || '27.119.091/001-35',
        endereco: getInputValue('endereco') || 'SRTVN QD 701 CONJUNTO C ALA B SN - ASA NORTE, SALA 603 CENTRO EMPRESARIAL NORTE',
        uf: getInputValue('uf') || 'DF',
        municipio: getInputValue('municipio') || 'Brasília',
        proposta: getInputValue('proposta') || '22/22/23/2/24'
    };

    const finalFormData = { ...formDataFromDom, ...programmaticFormData };

    try {
        const docDefinition = await generatePdfDocDefinition(orderedDeclarationsList, null, customLayoutOptions, finalFormData);
        if (!docDefinition) throw new Error("Failed to generate document definition.");

        docDefinition.permissions = {
            printing: 'highResolution', modifying: false, copying: false,
            annotating: false, fillingForms: false, contentAccessibility: false, documentAssembly: false
        };

        pdfMake.createPdf(docDefinition).download(`Todas_Declaracoes_${(finalFormData.dirigente || 'Unnamed').replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR')}.pdf`);
    } catch (error) {
        console.error("Error in generateAllDeclarationsPDF:", error);
        alert("Erro ao gerar o PDF: " + error.message);
    }
}

function getDeclarationContent(title, { dirigente = '', cargoDirigente = '', entidade = '', cnpj = '', endereco = '', proposta = '' } = {}) {
    const contents = {
        'NÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento no âmbito do Ministério do Esporte - MESP, que a presente Entidade não utilizará os recursos para finalidade alheia ao objeto da parceria.`,
        'AUSÊNCIA DE DESTINAÇÃO DE RECURSOS': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro que os recursos do presente Termo de Fomento não se destinarão ao pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme art. 167, inciso X, da Constituição Federal de 1988 e art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000.`,
        'CUMPRIMENTO DO ART 89 DA LEI Nº 15.080, DE 30 DE DEZEMBRO DE 2024': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, que a presente Entidade cumprirá com o disposto no art. 89, incisos IV e VIII, da Lei nº 15.080, de 30 de dezembro de 2024: \n\n• Compromisso da entidade beneficiada de disponibilizar ao cidadão, em seu sítio eletrônico ou, na falta deste, em sua sede, consulta ao extrato do convênio ou instrumento congênere, que conterá, no mínimo, o objeto, a finalidade e o detalhamento da aplicação dos recursos; \n• Inclusão de cláusula de reversão patrimonial no convênio ou instrumento congênere, válida até a depreciação integral do bem ou a amortização do investimento, que constituirá garantia real em favor do concedente em montante equivalente aos recursos de capital destinados à entidade, cuja execução ocorrerá caso se verifique desvio de finalidade ou aplicação irregular dos recursos.`,
        'NÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas – CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.`,
        'ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA': 
            `A ${entidade}, pessoa jurídica de direito privado, na forma de associação sem fins lucrativos, com sede na ${endereco}, inscrita no CNPJ nº ${cnpj}, neste ato representada por ${dirigente}, ${cargoDirigente}, declara para fins de cadastramento de celebração do presente Termo de Fomento junto ao Ministério do Esporte - MESP, que a ${entidade} é uma entidade viável e autônoma financeiramente, e que, de acordo com as demonstrações contábeis regularmente escrituradas, sob pena do art. 299 do Código Penal: \n\n• Compromete-se em manter a escrituração completa de suas receitas e despesas em livros revestidos das formalidades que assegurem a respectiva exatidão, de acordo com a legislação e normas editadas pelo Conselho Federal de Contabilidade; \n• Compromete-se a conservar em boa ordem, pelo prazo de cinco anos, contado da data da emissão, os documentos que comprovem a origem de suas receitas e a efetivação de suas despesas, bem como a realização de quaisquer outros atos ou operações que venham modificar a sua situação patrimonial; \n• Apresentar à Secretaria da Receita Federal do Brasil, anualmente, Declaração de Rendimentos, em conformidade com o disposto em ato daquele órgão, sem prejuízo da exigência de apresentação da cópia do respectivo recibo de entrega da referida Declaração de Rendimentos.`,
        'NÃO OCORRÊNCIA DE IMPEDIMENTOS': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, nos termos do art. 26, caput, inciso IX, do Decreto nº 8.726, de 2016, que a presente Entidade e seus dirigentes não incorrem em quaisquer das vedações previstas no art. 39 da Lei nº 13.019, de 2014. Nesse sentido: \n\n• Está regularmente constituída ou, se estrangeira, está autorizada a funcionar no território nacional; \n• Não está omissa no dever de prestar contas de parceria anteriormente celebrada; e \n• Não teve contas de parceria julgadas irregulares ou rejeitadas por Tribunal ou Conselho de Contas de qualquer esfera da Federação, em decisão irrecorrível, nos últimos 8 (oito) anos.`,
        'NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro ao Ministério do Esporte - MESP, que a entidade a qual represento apresentou informações para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, bem como não recebe recursos financeiros de outra entidade ou órgão (incluindo a Lei de Incentivo ao Esporte, a Lei Agnelo-Piva e/ou patrocínio de empresas estatais) para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta nº ${proposta}, cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.`,
        'COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, atesto que a presente entidade existe há, no mínimo, 3 (três) anos e possui o cadastro ativo, bem como experiência prévia na realização, com efetividade, no desenvolvimento do objeto proposto de natureza semelhante, assim como instalações, condições materiais e capacidade técnica e operacional para o desenvolvimento do objeto apresentado na Proposta nº ${proposta} e para o cumprimento das metas estabelecidas, em atendimento aos dispostos no art. 89, inciso XI, da Lei nº 15.080/2024 (LDO 2025), no art. 33, incisoV, da Lei nº 13.019/2014 e no art. 26, incisos I, II e III, do Decreto nº 8.726/2016.`,
        'COMPROMISSO': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro o compromisso de: \n\n• Dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até a prestação de contas final; \n• Dar publicidade ao Projeto/Programa durante toda a execução, em observância à aplicação dos selos e marcas adotadas pelo Ministério do Esporte - MESP e Governo Federal, de acordo com o estipulado no Manual de Selos e Marcas do Governo Federal, inclusive, em ações de Patrocínio; \n• Previamente à confecção dos materiais, encaminhar para aprovação os layouts, juntamente com o número do instrumento, processo e nome do programa/projeto/evento, para o e-mail: ascom.pdlie@esporte.gov.br.`,
        'CUSTOS': 
            `Eu, ${dirigente}, na qualidade de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, atesto a veracidade da planilha de custos, bem como das cotações obtidas, conforme disposto no art. 25, § 1º, do Decreto nº 8.726, de 27 de abril de 2016, inseridas no Sistema Eletrônico Transferegov, Proposta nº ${proposta}. Declaro que os custos apresentados estão compatíveis com os valores praticados no mercado.`,
        'ADIMPLÊNCIA': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade: Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS), com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares.`,
        'CIÊNCIA DO ART. 42, INCISO XIX, DA LEI Nº 13.019/2014': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro estar ciente da responsabilidade exclusiva pelo gerenciamento administrativo e financeiro dos recursos recebidos, inclusive no que diz respeito às despesas de custeio, de investimento e de pessoal, em atendimento ao disposto no art. 42, inciso XIX, da Lei nº 13.019, de 31 de julho de 2014.`
    };
    return contents[title] || 'Conteúdo da declaração não encontrado.';
}

function numToWords(num) {
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

    if (num === 0) return 'zero';
    if (num < 13) return units[num];
    if (num >= 10 && num < 20) return teens[num - 10];
    if (num >= 20 && num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' e ' + units[num % 10] : '');
    return String(num);
}