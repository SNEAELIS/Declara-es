// ---------------------------------------------------------------------------------
// AUXILIARY FUNCTIONS FOR BASE64 CONVERSION
// ---------------------------------------------------------------------------------

async function getBase64ImageFromUrl(imageUrl) {
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
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function convertPdfPageToImage(file) {
    const fileAsArrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(fileAsArrayBuffer).promise;
    const page = await pdf.getPage(1);
    const scale = 1.5; // Adjusted scale for better fit
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = { canvasContext: context, viewport };
    await page.render(renderContext).promise;
    
    return canvas.toDataURL('image/png');
}

// ---------------------------------------------------------------------------------
// MAIN PDF GENERATION FUNCTION
// ---------------------------------------------------------------------------------

async function generateAllDeclarationsPDF() {
    // Collect form data
    const dirigente = document.getElementById('dirigente').value || 'Pedro Dias Pereira Neto';
    const cargoDirigente = document.getElementById('cargoDirigente').value || 'Presidente';
    const entidade = document.getElementById('entidade').value || 'MUNICÍPIO DE SÃO DOMINGOS DO PRATA';
    const cnpj = document.getElementById('cnpj').value || '18.401.018/0001-60';
    const endereco = document.getElementById('endereco').value || 'GETÚLIO VARGAS, 224, CENTRO';
    const uf = document.getElementById('uf').value || 'MG';
    const municipio = document.getElementById('municipio').value || 'SÃO DOMINGOS DO PRATA';
    const proposta = document.getElementById('proposta').value || '000111/2024';

    // Get current date and time
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const date = `${dia}/${mes}/${ano} às ${horas}:${minutos}`;

    // Handle letterhead selection
    let backgroundImage = null;
    const useLetterheadCheckbox = document.getElementById('useLetterhead');
    const letterheadFileInput = document.getElementById('letterheadFile');

    if (useLetterheadCheckbox.checked && letterheadFileInput.files.length > 0) {
        const file = letterheadFileInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type! Please select a JPEG, PNG, or PDF file.");
            throw new Error("Invalid letterhead file type");
        }

        if (file.type.startsWith('image/')) {
            backgroundImage = await getBase64FromFile(file);
        } else if (file.type === 'application/pdf') {
            backgroundImage = await convertPdfPageToImage(file);
        }
    } else {
        backgroundImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
    }

    // Define declarations
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

    // PDF definition
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 80], // Adjusted bottom margin to ensure footer fits
        background: (currentPage, pageCount) => {
            if (currentPage === pageCount || !backgroundImage) return null;
            return {
                image: backgroundImage,
                width: 595, // A4 width in points (1/72 inch)
                height: 842, // A4 height in points
                absolutePosition: { x: 0, y: 0 },
                opacity: 1.0
            };
        },
        footer: (currentPage, pageCount) => {
            if (currentPage === pageCount) return null; // No footer on last page
            const footerHeight = 40; // Fixed height for footer
            const availableHeight = 842 - 60 - footerHeight; // A4 height minus top margin minus footer height

            return {
                stack: [
                    { canvas: [{ type: 'line', x1: 40, y1: 0, x2: 555, y2: 0, lineWidth: 1.5, lineColor: '#003087' }] },
                    {
                        text: [
                            'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as declarações anteriores. ',
                            { text: `Página ${currentPage} de ${pageCount}`, fontSize: 8.5, alignment: 'right', color: '#555555' }
                        ],
                        fontSize: 8.5,
                        alignment: 'left',
                        color: '#555555'
                    }
                ],
                margin: [40, 10, 40, 0],
                absolutePosition: { x: 0, y: availableHeight }
            };
        },
        content: [
            ...declarations.map((title, index) => {
                const content = getDeclarationContent(title, dirigente, cargoDirigente, entidade, cnpj, endereco, proposta);
                const isCustomLetterhead = useLetterheadCheckbox.checked && letterheadFileInput.files.length > 0;
                const marginTop = isCustomLetterhead ? [0, 80, 0, 20] : [0, 20, 0, 20];
                return {
                    pageBreak: index > 0 ? 'before' : '', // Each declaration on a new page
                    stack: [
                        { text: `DECLARAÇÃO\n${title}`, style: 'header', alignment: 'center', margin: marginTop },
                        { text: content, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20] }
                    ]
                };
            }),
            // Last page content
            {
                pageBreak: 'before',
                stack: [
                    { text: 'Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
                    { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'center', margin: [0, 0, 0, 20] },
                    {
                        table: {
                            headerRows: 1,
                            widths: [30, '*', 40],
                            body: [
                                [{ text: 'Nº', style: 'tableHeader' }, { text: 'Declaração', style: 'tableHeader' }, { text: 'Página', style: 'tableHeader' }],
                                ...declarations.map((titulo, idx) => [
                                    { text: `${idx + 1}`, alignment: 'center', fontSize: 9, fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                                    { text: titulo, linkToPage: idx + 1, decoration: 'underline', color: '#003087', fontSize: 9, fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                                    { text: `${idx + 1}`, alignment: 'center', fontSize: 9, fillColor: idx % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                                ])
                            ]
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
                            vLineWidth: () => 1,
                            hLineColor: () => '#003087',
                            vLineColor: () => '#003087',
                            paddingLeft: () => 5,
                            paddingRight: () => 5,
                            paddingTop: () => 4,
                            paddingBottom: () => 4
                        },
                        margin: [15, 0, 15, 20],
                        alignment: 'center'
                    },
                    { text: `Por ser verdade, firmo o teor das declarações referenciais que compõem este arquivo.`, alignment: 'center', fontSize: 11, margin: [0, 0, 0, 20] },
                    { text: `${municipio.toUpperCase()}/${uf.toUpperCase()}, ${date}.`, alignment: 'center', fontSize: 11, margin: [0, 0, 0, 20] },
                    { text: '__________________________________________', alignment: 'center', fontSize: 11, margin: [0, 20, 0, 10] },
                    { text: dirigente, alignment: 'center', bold: true, fontSize: 11, margin: [0, 0, 0, 5] },
                    { text: `(${cargoDirigente})`, alignment: 'center', italic: true, fontSize: 11 }
                ]
            }
        ],
        styles: {
            header: { fontSize: 18, bold: true, color: '#003087', alignment: 'center' },
            subheader: { fontSize: 10, italic: true, color: '#333333', alignment: 'center' },
            tableHeader: { fontSize: 10, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'right' }
        },
        defaultStyle: { font: 'Roboto' },
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

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Todas_Declaracoes_${dirigente.replace(/\s+/g, '_')}.pdf`);
}

// Helper function to get declaration content
function getDeclarationContent(title, dirigente, cargoDirigente, entidade, cnpj, endereco, proposta) {
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
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, atesto que a presente entidade existe há, no mínimo, 3 (três) anos e possui o cadastro ativo, bem como experiência prévia na realização, com efetividade, no desenvolvimento do objeto proposto de natureza semelhante, assim como instalações, condições materiais e capacidade técnica e operacional para o desenvolvimento do objeto apresentado na Proposta nº ${proposta} e para o cumprimento das metas estabelecidas, em atendimento aos dispostos no art. 89, inciso XI, da Lei nº 15.080/2024 (LDO 2025), no art. 33, inciso V, da Lei nº 13.019/2014 e no art. 26, incisos I, II e III, do Decreto nº 8.726/2016.`,
        'COMPROMISSO': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro o compromisso de: \n\n• Dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até a prestação de contas final; \n• Dar publicidade ao Projeto/Programa durante toda a execução, em observância à aplicação dos selos e marcas adotadas pelo Ministério do Esporte - MESP e Governo Federal, de acordo com o estipulado no Manual de Selos e Marcas do Governo Federal, inclusive, em ações de Patrocínio; \n• Previamente à confecção dos materiais, encaminhar para aprovação os layouts, juntamente com o número do instrumento, processo e nome do programa/projeto/evento, para o e-mail: ascom.pdlie@esporte.gov.br.`,
        'CUSTOS': 
            `Eu, ${dirigente}, na qualidade de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, atesto a veracidade da planilha de custos, bem como das cotações obtidas, conforme disposto no art. 25, § 1º, do Decreto nº 8.726, de 27 de abril de 2016, inseridas no Sistema Eletrônico Transferegov, Proposta nº ${proposta}. Declaro que os custos apresentados estão compatíveis com os valores praticados no mercado.`,
        'ADIMPLÊNCIA': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade: Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS), com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares.`,
        'CIÊNCIA DO ART. 42, INCISO XIX, DA LEI Nº 13.019/2014': 
            `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro estar ciente da responsabilidade exclusiva pelo gerenciamento administrativo e financeiro dos recursos recebidos, inclusive no que diz respeito às despesas de custeio, de investimento e de pessoal, em atendimento ao disposto no art. 42, inciso XIX, da Lei nº 13.019, de 31 de julho de 2014.`
    };
    return contents[title] || '';
}

// ---------------------------------------------------------------------------------
// EVENT LISTENER
// ---------------------------------------------------------------------------------
document.getElementById('botaoGerarPDF').addEventListener('click', async (event) => {
    event.preventDefault();
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block';

    try {
        await generateAllDeclarationsPDF();
    } catch (error) {
        console.error("Error generating PDF:", error.message);
        alert("An error occurred while generating the PDF. Please check the console for details.");
    } finally {
        loadingMessage.style.display = 'none';
    }
});