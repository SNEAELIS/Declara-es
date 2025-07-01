async function getBase64ImageFromUrl(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to load image: ${response.status}`);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading watermark image:', error);
        return null;
    }
}

function formatDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

async function generateAllDeclarationsPDF() {
    // Obter valores dos campos do formulário
    const dirigente = document.getElementById('dirigente').value;
    const cargoDirigente = document.getElementById('cargoDirigente').value;
    const entidade = document.getElementById('entidade').value;
    const cnpj = document.getElementById('cnpj').value;
    const endereco = document.getElementById('endereco').value;
    const uf = document.getElementById('uf').value;
    const municipio = document.getElementById('municipio').value;
    const proposta = document.getElementById('proposta').value;
    const date = formatDate();

    // Carregar imagem de marca d'água
    const watermarkImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');

    // Definir o documento PDF
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        background: watermarkImage ? [{
            image: watermarkImage,
            width: 595,
            height: 842,
            absolutePosition: { x: 0, y: 0 },
            opacity: 0.9
        }] : undefined,
        content: [
            {
                text: 'DECLARAÇÃO\nNÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento no âmbito do Ministério do Esporte - MESP, que a presente Entidade não utilizará os recursos para finalidade alheia ao objeto da parceria.\n\n`,
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `___________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro que os recursos do presente Termo de Fomento não se destinarão ao pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme art. 167, inciso X, da Constituição Federal de 1988 e art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000.\n\n`,
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DE CUMPRIMENTO DO ART 89 DA\nLEI Nº 15.080, DE 30 DE DEZEMBRO DE 2024',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, que a presente Entidade cumprirá com o disposto no art. 89, incisos IV e VIII, da Lei nº 15.080, de 30 de dezembro de 2024:\n\n`,
                    '• Compromisso da entidade beneficiada de disponibilizar ao cidadão, em seu sítio eletrônico ou, na falta deste, em sua sede, consulta ao extrato do convênio ou instrumento congênere, que conterá, no mínimo, o objeto, a finalidade e o detalhamento da aplicação dos recursos;\n',
                    '• Inclusão de cláusula de reversão patrimonial no convênio ou instrumento congênere, válida até a depreciação integral do bem ou a amortização do investimento, que constituirá garantia real em favor do concedente em montante equivalente aos recursos de capital destinados à entidade, cuja execução ocorrerá caso se verifique desvio de finalidade ou aplicação irregular dos recursos.\n\n',
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `__________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO\nNÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas – CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.\n\n`,
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `__________________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `A ${entidade}, pessoa jurídica de direito privado, na forma de associação sem fins lucrativos, com sede na ${endereco}, inscrita no CNPJ nº ${cnpj}, neste ato representada por ${dirigente}, ${cargoDirigente}, declara para fins de cadastramento de celebração do presente Termo de Fomento junto ao Ministério do Esporte - MESP, que a ${entidade} é uma entidade viável e autônoma financeiramente, e que, de acordo com as demonstrações contábeis regularmente escrituradas, sob pena do art. 299 do Código Penal:\n\n`,
                    '• Compromete-se em manter a escrituração completa de suas receitas e despesas em livros revestidos das formalidades que assegurem a respectiva exatidão, de acordo com a legislação e normas editadas pelo Conselho Federal de Contabilidade;\n',
                    '• Compromete-se a conservar em boa ordem, pelo prazo de cinco anos, contado da data da emissão, os documentos que comprovem a origem de suas receitas e a efetivação de suas despesas, bem como a realização de quaisquer outros atos ou operações que venham modificar a sua situação patrimonial;\n',
                    '• Apresentar à Secretaria da Receita Federal do Brasil, anualmente, Declaração de Rendimentos, em conformidade com o disposto em ato daquele órgão, sem prejuízo da exigência de apresentação da cópia do respectivo recibo de entrega da referida Declaração de Rendimentos.\n'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `____________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DA NÃO OCORRÊNCIA DE IMPEDIMENTOS',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, DECLARO para os devidos fins, nos termos do art. 26, caput, inciso IX, do Decreto nº 8.726, de 2016, que a presente Entidade e seus dirigentes não incorrem em quaisquer das vedações previstas no art. 39 da Lei nº 13.019, de 2014. Nesse sentido:\n\n`,
                    '• Está regularmente constituída ou, se estrangeira, está autorizada a funcionar no território nacional;\n',
                    '• Não está omissa no dever de prestar contas de parceria anteriormente celebrada; e\n',
                    '• Não teve contas de parceria julgadas irregulares ou rejeitadas por Tribunal ou Conselho de Contas de qualquer esfera da Federação, em decisão irrecorrível, nos últimos 8 (oito) anos.\n\n',
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `_______________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ ${cnpj}, DECLARO ao Ministério do Esporte - MESP, que a entidade a qual represento apresentou informações para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, bem como não recebe recursos financeiros de outra entidade ou órgão (incluindo a Lei de Incentivo ao Esporte, a Lei Agnelo-Piva e/ou patrocínio de empresas estatais) para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta N° ${proposta}, cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.\n\n`
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `_______________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DE COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, ATESTO que a presente entidade existe há, no mínimo, 3 (três) anos e possui o cadastro ativo, bem como experiência prévia na realização, com efetividade, no desenvolvimento do objeto de natureza semelhante, assim como instalações, condições materiais e capacidade técnica e operacional para o desenvolvimento do objeto apresentado na Proposta nº ${proposta}/2024 e para o cumprimento das metas estabelecidas, em atendimento aos dispostos no art. 89, inciso XI, da Lei nº 15.080/2024 (LDO 2025), no art. 33, inciso V, da Lei nº 13.019/2014 e no art. 26, incisos I, II e III, do Decreto nº 8.726/2016 ou outras condições materiais para contratar ou adquirir com recursos da parceria, em conformidade com o art. 26, inciso X, do Decreto nº 8.726/2016.\n\n`
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 40]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 40]
            },
            {
                text: `_______________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DE COMPROMISSO',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro o compromisso de:\n\n`,
                    `• Dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até a prestação de contas final;\n`,
                    `• Dar publicidade ao Projeto/Programa durante toda a execução, em observância à aplicação dos selos e marcas adotadas pelo Ministério do Esporte - MESP e Governo Federal, de acordo com o estipulado no Manual de Selos e Marcas do Governo Federal, inclusive, em ações de Patrocínio;\n`,
                    `• Previamente à confecção dos materiais, encaminhar para aprovação os layouts, juntamente com o número do instrumento, processo e nome do programa/projeto/evento, para o e-mail: ascom.pdlie@esporte.gov.br.\n\n`,
                    `Por ser expressão da verdade, firmo a presente declaração.`
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 10]
            },
            {
                text: `${municipio}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 20]
            },
            {
                text: `__________________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
                text: 'DECLARAÇÃO DE CUSTOS',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na qualidade de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, `,
                    { text: 'ATESTO ', bold: true },
                    `a veracidade da planilha de custos, bem como das cotações obtidas, conforme disposto no art. 25, § 1º, do Decreto nº 8.726, de 27 de abril de 2016, inseridas no Sistema Eletrônico Transferegov, Proposta nº ${proposta}/2024.\n\n`,
                    { text: 'DECLARO ', bold: true },
                    `que os custos apresentados estão compatíveis com os valores praticados no mercado.\n\n`,
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 10]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 20]
            },
            {
                text: `__________________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12,
                pageBreak: 'after'
            },
            {
            text: 'DECLARAÇÃO DE ADIMPLÊNCIA',
            style: 'header',
            alignment: 'center',
            margin: [0, 120, 0, 20]
        },
        {
            text: [
                `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, `,
                { text: 'DECLARO', bold: true },
                `, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade:\n\n`,
                {
                    text: 'Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS), com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares.\n\n',
                    bold: true
                },
                'Por ser expressão da verdade, firmo a presente declaração.'
            ],
            alignment: 'justify',
            fontSize: 12,
            margin: [0, 20, 0, 40]
        },
        {
            text: `${municipio}/${uf}, ${date}.`,
            alignment: 'left',
            fontSize: 12,
            margin: [0, 0, 0, 40]
        },
        {
            text: `__________________________________________\n${dirigente}\n(${cargoDirigente})`,
            alignment: 'center',
            fontSize: 12,
            margin: [0, 0, 0, 20],
            pageBreak: 'after' // Move page break here
        },

            {
                text: 'DECLARAÇÃO DE CIÊNCIA DO ART. 42, INCISO XIX, DA LEI Nº 13.019/2014',
                style: 'header',
                alignment: 'center',
                margin: [0, 120, 0, 20]
            },
            {
                text: [
                    `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, `,
                    'declaro estar ciente da responsabilidade exclusiva pelo gerenciamento administrativo e financeiro dos recursos recebidos, inclusive no que diz respeito às despesas de custeio, de investimento e de pessoal, em atendimento ao disposto no art. 42, inciso XIX, da Lei nº 13.019, de 31 de julho de 2014.\n\n',
                    'Por ser expressão da verdade, firmo a presente declaração.'
                ],
                alignment: 'justify',
                fontSize: 12,
                margin: [0, 20, 0, 10]
            },
            {
                text: `${municipio}/${uf}, ${date}.`,
                alignment: 'left',
                fontSize: 12,
                margin: [0, 0, 0, 20]
            },
            {
                text: `__________________________________________\n${dirigente}\n(${cargoDirigente})`,
                alignment: 'center',
                fontSize: 12
            }
        ],
        styles: {
            header: {
                fontSize: 16,
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

    // Gerar e baixar o PDF
    pdfMake.createPdf(docDefinition).download(`Todas_Declaracoes_${dirigente}.pdf`);
}

// Adicionar o event listener para o botão de gerar PDF
document.getElementById('botaoGerarPDF').addEventListener('click', async function (e) {
    e.preventDefault();
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block';
    try {
        await generateAllDeclarationsPDF();
        loadingMessage.style.display = 'none';
    } catch (error) {
        alert("Ocorreu um erro ao gerar os PDFs.");
        console.error(error);
        loadingMessage.style.display = 'none';
    }
});