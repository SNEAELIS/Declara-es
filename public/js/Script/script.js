
async function getBase64ImageFromUrl(imageUrl) {
    try {
        // 1. Faz a requisição para buscar a imagem na URL fornecida.
        const response = await fetch(imageUrl);

        // 2. Verifica se a resposta da requisição foi bem-sucedida (status 200-299).
        if (!response.ok) {
            throw new Error(`Falha ao carregar a imagem: ${response.status} ${response.statusText}`);
        }

        // 3. Converte a resposta em um 'blob' (objeto binário).
        const blob = await response.blob();

        // 4. Usa a API FileReader para ler o blob e convertê-lo para uma URL de dados (Base64).
        // A conversão é feita dentro de uma Promise para aguardar o resultado da leitura.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            // Define o que fazer quando a leitura for concluída com sucesso.
            reader.onloadend = () => resolve(reader.result);
            // Define o que fazer em caso de erro na leitura.
            reader.onerror = reject;
            // Inicia a operação de leitura.
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        // Se qualquer etapa falhar, exibe o erro no console para depuração.
        console.error("Erro ao carregar a imagem da marca d'água:", error);
        // Retorna null para indicar que a imagem não pôde ser carregada.
        return null;
    }
}

/**
 * Função principal que coleta dados do formulário, monta e gera o documento PDF.
 */
async function generateAllDeclarationsPDF() {
    // --- 1. COLETA DINÂMICA DE DADOS DO FORMULÁRIO HTML ---
    // Busca os valores preenchidos pelo usuário nos campos do formulário usando seus IDs.
    const dirigente = document.getElementById('dirigente').value;
    const cargoDirigente = document.getElementById('cargoDirigente').value;
    const entidade = document.getElementById('entidade').value;
    const cnpj = document.getElementById('cnpj').value;
    const endereco = document.getElementById('endereco').value;
    const uf = document.getElementById('uf').value;
    const municipio = document.getElementById('municipio').value;
    const proposta = document.getElementById('proposta').value;

    // --- 2. GERAÇÃO AUTOMÁTICA DA DATA E HORA ---
    // Cria a data e hora no momento exato da geração do documento.
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Mês em JS é base 0 (0-11)
    const ano = agora.getFullYear();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const date = `${dia}/${mes}/${ano} às ${horas}:${minutos}`; // Formato: dd/mm/aaaa às HH:MM

    // --- 3. CARREGAMENTO DE RECURSOS EXTERNOS ---
    const watermarkImage = await getBase64ImageFromUrl('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');

    // --- 4. DEFINIÇÃO DA ESTRUTURA E CONTEÚDO DO PDF ---
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

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 80],
        background: (currentPage, pageCount) => {
            // A marca d'água não será aplicada na última página (página de assinatura).
            if (currentPage === pageCount) return null;
            return watermarkImage ? [{
                image: watermarkImage,
                width: 595,
                height: 842,
                absolutePosition: { x: 0, y: 0 },
                opacity: 0.9
            }] : null;
        },
        footer: (currentPage, pageCount) => {
            if (currentPage === pageCount) {
                return {
                    text: `Documento composto por ${declarations.length} (doze) declarações referenciais, assinado eletronicamente nesta página, com validade jurídica para o conjunto.`,
                    alignment: 'center',
                    fontSize: 8.5,
                    margin: [40, 20, 40, -3]
                };
            }
            return {
                columns: [
                    {
                        text: 'A assinatura eletrônica será realizada exclusivamente na última página, sendo considerada válida para todas as declarações anteriores.',
                        fontSize: 8.5,
                        alignment: 'left',
                        width: '*',
                        noWrap: false
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        fontSize: 8.5,
                        alignment: 'right',
                        width: 100, // largura fixa para impedir quebra
                        noWrap: true
                    }
                ],
                columnGap: 10,
                margin: [40, 20, 40, -3]
            };
        },
        // O conteúdo de cada declaração usará as variáveis preenchidas dinamicamente.
        content: [
            { text: 'DECLARAÇÃO\nNÃO UTILIZAÇÃO DE RECURSOS PARA FINALIDADE ALHEIA AO OBJETO DA PARCERIA', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento no âmbito do Ministério do Esporte - MESP, que a presente Entidade não utilizará os recursos para finalidade alheia ao objeto da parceria.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE AUSÊNCIA DE DESTINAÇÃO DE RECURSOS', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro que os recursos do presente Termo de Fomento não se destinarão ao pagamento de despesas com pessoal ativo, inativo ou pensionista, dos Estados, do Distrito Federal e Municípios, conforme art. 167, inciso X, da Constituição Federal de 1988 e art. 25, § 1º, inciso III, da Lei Complementar nº 101/2000.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE CUMPRIMENTO DO ART 89 DA\nLEI Nº 15.080, DE 30 DE DEZEMBRO DE 2024', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, que a presente Entidade cumprirá com o disposto no art. 89, incisos IV e VIII, da Lei nº 15.080, de 30 de dezembro de 2024: \n\n• Compromisso da entidade beneficiada de disponibilizar ao cidadão, em seu sítio eletrônico ou, na falta deste, em sua sede, consulta ao extrato do convênio ou instrumento congênere, que conterá, no mínimo, o objeto, a finalidade e o detalhamento da aplicação dos recursos; \n• Inclusão de cláusula de reversão patrimonial no convênio ou instrumento congênere, válida até a depreciação integral do bem ou a amortização do investimento, que constituirá garantia real em favor do concedente em montante equivalente aos recursos de capital destinados à entidade, cuja execução ocorrerá caso se verifique desvio de finalidade ou aplicação irregular dos recursos.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO\nNÃO CONTRATAÇÃO COM RECURSOS DA PARCERIA', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins de celebração de Termo de Fomento, no âmbito do Ministério do Esporte - MESP, que a presente Entidade não contratará com recursos da presente parceria, empresas que sejam do mesmo grupo econômico; tenham participação societária cruzada; pertençam ou tenham participação societária de parentes de dirigentes ou funcionários da entidade, possuam o mesmo endereço, telefone e CNPJ; bem como, que as cotações relativas aos itens previstos no Plano de Trabalho não apresentarão incompatibilidade, no que se refere a situação cadastral dos fornecedores e a classificação de atividades econômicas – CNAE em relação ao serviço ou fornecimento de material alusivo à respectiva cotação, e ainda, responsabilizar-se-á pela veracidade dos documentos apresentados referentes às pesquisas de preços junto aos fornecedores.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO ART. 299 CÓDIGO PENAL E AUTONOMIA FINANCEIRA', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `A ${entidade}, pessoa jurídica de direito privado, na forma de associação sem fins lucrativos, com sede na ${endereco}, inscrita no CNPJ nº ${cnpj}, neste ato representada por ${dirigente}, ${cargoDirigente}, declara para fins de cadastramento de celebração do presente Termo de Fomento junto ao Ministério do Esporte - MESP, que a ${entidade} é uma entidade viável e autônoma financeiramente, e que, de acordo com as demonstrações contábeis regularmente escrituradas, sob pena do art. 299 do Código Penal: \n\n• Compromete-se em manter a escrituração completa de suas receitas e despesas em livros revestidos das formalidades que assegurem a respectiva exatidão, de acordo com a legislação e normas editadas pelo Conselho Federal de Contabilidade; \n• Compromete-se a conservar em boa ordem, pelo prazo de cinco anos, contado da data da emissão, os documentos que comprovem a origem de suas receitas e a efetivação de suas despesas, bem como a realização de quaisquer outros atos ou operações que venham modificar a sua situação patrimonial; \n• Apresentar à Secretaria da Receita Federal do Brasil, anualmente, Declaração de Rendimentos, em conformidade com o disposto em ato daquele órgão, sem prejuízo da exigência de apresentação da cópia do respectivo recibo de entrega da referida Declaração de Rendimentos.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE NÃO OCORRÊNCIA DE IMPEDIMENTOS', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro para os devidos fins, nos termos do art. 26, caput, inciso IX, do Decreto nº 8.726, de 2016, que a presente Entidade e seus dirigentes não incorrem em quaisquer das vedações previstas no art. 39 da Lei nº 13.019, de 2014. Nesse sentido: \n\n• Está regularmente constituída ou, se estrangeira, está autorizada a funcionar no território nacional; \n• Não está omissa no dever de prestar contas de parceria anteriormente celebrada; e \n• Não teve contas de parceria julgadas irregulares ou rejeitadas por Tribunal ou Conselho de Contas de qualquer esfera da Federação, em decisão irrecorrível, nos últimos 8 (oito) anos.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO NÃO RECEBE RECURSOS PARA A MESMA FINALIDADE DE OUTRA ENTIDADE OU ÓRGÃO', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro ao Ministério do Esporte - MESP, que a entidade a qual represento apresentou informações para apreciação SOMENTE junto a esse órgão e em nenhum outro ente da administração pública, bem como não recebe recursos financeiros de outra entidade ou órgão (incluindo a Lei de Incentivo ao Esporte, a Lei Agnelo-Piva e/ou patrocínio de empresas estatais) para a mesma finalidade na execução das ações apresentadas e especificadas na Proposta nº ${proposta}, cadastrada no Sistema Eletrônico Transferegov, evitando desta forma a sobreposição de recursos.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE COMPROVAÇÃO DE EXISTÊNCIA, EXPERIÊNCIA, INSTALAÇÕES E OUTRAS CONDIÇÕES MATERIAIS', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, atesto que a presente entidade existe há, no mínimo, 3 (três) anos e possui o cadastro ativo, bem como experiência prévia na realização, com efetividade, no desenvolvimento do objeto proposto de natureza semelhante, assim como instalações, condições materiais e capacidade técnica e operacional para o desenvolvimento do objeto apresentado na Proposta nº ${proposta} e para o cumprimento das metas estabelecidas, em atendimento aos dispostos no art. 89, inciso XI, da Lei nº 15.080/2024 (LDO 2025), no art. 33, inciso V, da Lei nº 13.019/2014 e no art. 26, incisos I, II e III, do Decreto nº 8.726/2016.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE COMPROMISSO', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, CNPJ nº ${cnpj}, declaro o compromisso de: \n\n• Dispor dos recursos informatizados necessários ao acesso ao Sistema Eletrônico Transferegov, com o objetivo de alimentar, atualizar e acompanhar de forma permanente o referido sistema, de acordo com a norma vigente, durante todo o período da formalização da parceria até a prestação de contas final; \n• Dar publicidade ao Projeto/Programa durante toda a execução, em observância à aplicação dos selos e marcas adotadas pelo Ministério do Esporte - MESP e Governo Federal, de acordo com o estipulado no Manual de Selos e Marcas do Governo Federal, inclusive, em ações de Patrocínio; \n• Previamente à confecção dos materiais, encaminhar para aprovação os layouts, juntamente com o número do instrumento, processo e nome do programa/projeto/evento, para o e-mail: ascom.pdlie@esporte.gov.br.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE CUSTOS', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na qualidade de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, atesto a veracidade da planilha de custos, bem como das cotações obtidas, conforme disposto no art. 25, § 1º, do Decreto nº 8.726, de 27 de abril de 2016, inseridas no Sistema Eletrônico Transferegov, Proposta nº ${proposta}. Declaro que os custos apresentados estão compatíveis com os valores praticados no mercado.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE ADIMPLÊNCIA', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro, no uso das atribuições que me foram delegadas e sob as penas da lei, que a presente Entidade: Não está inadimplente com a União, inclusive no que tange às contribuições de que tratam os artigos 195 e 239 da Constituição Federal (contribuições dos empregados para a seguridade social, contribuições para o PIS/PASEP e contribuições para o FGTS), com relação a recursos anteriormente recebidos da Administração Pública Federal, por meio de convênios, contratos, acordos, ajustes, subvenções sociais, contribuições, auxílios e similares.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            { text: 'DECLARAÇÃO DE CIÊNCIA DO ART. 42, INCISO XIX, DA LEI Nº 13.019/2014', style: 'header', alignment: 'center', margin: [0, 40, 0, 20] },
            { text: `Eu, ${dirigente}, na condição de ${cargoDirigente} da ${entidade}, inscrita no CNPJ sob o nº ${cnpj}, declaro estar ciente da responsabilidade exclusiva pelo gerenciamento administrativo e financeiro dos recursos recebidos, inclusive no que diz respeito às despesas de custeio, de investimento e de pessoal, em atendimento ao disposto no art. 42, inciso XIX, da Lei nº 13.019, de 31 de julho de 2014.`, alignment: 'justify', fontSize: 12, margin: [0, 20, 0, 20], pageBreak: 'after' },

            // --- PÁGINA FINAL: SUMÁRIO E ASSINATURA ---
            { text: 'Declarações Referenciais', style: 'header', alignment: 'center', margin: [0, 20, 0, 5] },
            { text: 'Relação das declarações contidas neste documento, assinadas eletronicamente na presente página.', style: 'subheader', alignment: 'center', margin: [0, 5, 0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', 40],
                    body: [
                        [{ text: 'Nº', style: 'tableHeader', alignment: 'center' }, { text: 'Declaração', style: 'tableHeader', alignment: 'left' }, { text: 'Página', style: 'tableHeader', alignment: 'center' }],
                        ...declarations.map((titulo, index) => [
                            { text: `${index + 1}`, alignment: 'center', fontSize: 9, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: titulo, linkToPage: index + 1, decoration: 'underline', color: 'blue', fontSize: 9, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' },
                            { text: `${index + 1}`, alignment: 'center', fontSize: 9, fillColor: index % 2 === 0 ? '#F5F6F5' : '#FFFFFF' }
                        ])
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5, vLineWidth: () => 1,
                    hLineColor: () => '#003087', vLineColor: () => '#003087',
                    paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 4, paddingBottom: () => 4
                },
                margin: [15, 5, 15, 20],
                alignment: 'center'
            },
            { text: `Por ser verdade, firmo o teor das declarações referenciais que compõem este arquivo.`, alignment: 'center', fontSize: 11, margin: [0, 10, 0, 10] },
            { text: `${municipio.toUpperCase()}/${uf.toUpperCase()}, ${date}.`, alignment: 'center', fontSize: 11, margin: [0, 10, 0, 10] },
            { text: '__________________________________________', alignment: 'center', fontSize: 11, margin: [0, 10, 0, 5] },
            { text: dirigente, alignment: 'center', bold: true, fontSize: 11, margin: [0, 0, 0, 5] },
            { text: `(${cargoDirigente})`, alignment: 'center', italic: true, fontSize: 11 }
        ],
        styles: {
            header: { fontSize: 18, bold: true, color: '#003087', alignment: 'center' },
            subheader: { fontSize: 10, italic: true, color: '#333333', alignment: 'center' },
            tableHeader: { fontSize: 10, bold: true, color: '#FFFFFF', fillColor: '#003087', alignment: 'left' }
        },
        defaultStyle: { font: 'Roboto' },
        permissions: {
            printing: 'highResolution', modifying: false, copying: false, annotating: false,
            fillingForms: false, contentAccessibility: false, documentAssembly: false
        }
    };

    // --- 5. GERAÇÃO E DOWNLOAD DO PDF ---
    // Usa a biblioteca pdfMake para criar o PDF e iniciar o download no navegador.
    // O nome do arquivo também é dinâmico, usando o nome do dirigente.
    pdfMake.createPdf(docDefinition).download(`Todas_Declaracoes_${dirigente.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Adiciona o "ouvinte de evento" ao botão 'Gerar Declarações'.
 * Ele gerencia o fluxo de cliques, exibe mensagens de carregamento e trata erros.
 */
document.getElementById('botaoGerarPDF').addEventListener('click', async (event) => {
    // Impede que o formulário seja enviado da maneira tradicional (recarregando a página).
    event.preventDefault();

    const loadingMessage = document.getElementById('loadingMessage');
    
    // Mostra a mensagem "Aguarde um momento..." para o usuário.
    loadingMessage.style.display = 'block';

    try {
        // Chama a função principal que faz todo o trabalho de gerar o PDF.
        await generateAllDeclarationsPDF();
    } catch (error) {
        // Se ocorrer qualquer erro durante a geração, exibe um alerta para o usuário.
        alert("Ocorreu um erro ao gerar as declarações. Verifique os dados e tente novamente.");
        // E também exibe o erro detalhado no console para o desenvolvedor.
        console.error("Erro na geração do PDF:", error);
    } finally {
        // Independentemente de sucesso ou falha, esconde a mensagem de carregamento.
        loadingMessage.style.display = 'none';
    }
});