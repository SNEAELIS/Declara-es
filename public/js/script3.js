async function getBase64Image(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = reject;
    });
}

async function gerarPDF() {
    let watermarkImage;
    try {
        watermarkImage = await getBase64Image('https://i.ibb.co/Lz10svWs/Declara-es-page-0001.jpg');
    } catch (error) {
        console.error('Erro ao carregar a imagem da marca d\'água:', error);
        watermarkImage = null;
    }

    const nomeEntidade = document.getElementById('nomeEntidade').value;
    const contasRejeitadas = document.getElementById('contasRejeitadas').checked;
    const improbidadeAdministrativa = document.getElementById('improbidadeAdministrativa').checked;
    const numDirigentes = document.getElementById('numDirigentes').value;
    const camposDirigentes = [];

    for (let i = 1; i <= numDirigentes; i++) {
        const nome = document.getElementById('dirigenteNome' + i).value;
        const cargo = document.getElementById('dirigenteCargo' + i) ? document.getElementById('dirigenteCargo' + i).value : ''; // Adicionado cargo, se existir
        const rg = document.getElementById('dirigenteRG' + i).value;
        const cpf = document.getElementById('dirigenteCPF' + i).value;
        const email = document.getElementById('dirigenteEmail' + i).value;
        const cep = document.getElementById('dirigenteCEP' + i).value;
        const rua = document.getElementById('dirigenteRua' + i).value;
        const bairro = document.getElementById('dirigenteBairro' + i).value;
        const cidade = document.getElementById('dirigenteCidade' + i).value;
        const estado = document.getElementById('dirigenteEstado' + i).value;
        const complemento = document.getElementById('dirigenteComplemento' + i).value;

        const enderecoCompleto = `${rua}, ${complemento ? complemento + ', ' : ''}${bairro}, ${cidade} - ${estado}, CEP: ${cep}`;

        camposDirigentes.push([
            `${nome} - ${cargo}`,
            `${rg}, CPF: ${cpf}`,
            `${enderecoCompleto}, E-mail: ${email}`
        ]);
    }

    let textoContasRejeitadas = contasRejeitadas
        ? 'V - tiveram as contas rejeitadas, mas demonstraram, nos termos do art. 39, IV, alíneas "a", "b" e "c", da Lei nº 13.019, de 2014, que:\n' +
          'V.1 – a irregularidade que motivou a rejeição das contas foi sanada e que os débitos eventualmente imputados foram quitados;\n' +
          'V.2 – a decisão de rejeição das contas foi reconsiderada ou revista;\n' +
          'V.3 – a decisão sobre a apreciação das contas está pendente de decisão sobre recurso com efeito suspensivo;'
        : 'V – não tiveram as contas rejeitadas pela Administração Pública nos últimos cinco anos.';

    let textoImprobidadeAdministrativa = improbidadeAdministrativa
        ? 'c) foram considerados responsáveis por ato de improbidade ou foram considerados responsáveis por ato de improbidade, mas os respectivos efeitos, nos prazos previstos no art. 12, incisos I, II e III, da Lei nº 8.429, de 1992, já se exauriram.'
        : '';

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [20, 80, 20, 40],
        background: function (currentPage) {
            return watermarkImage && currentPage === 1 ? [
                {
                    image: watermarkImage,
                    width: 595,
                    height: 842,
                    opacity: 0.1,
                    absolutePosition: { x: 0, y: 0 }
                }
            ] : [];
        },
        content: [
            { text: 'DECLARAÇÃO DOS ARTS. 26 E 27, DO DECRETO Nº 8.726, DE 2016, E DO ART. 39, DA LEI Nº 13.019, DE 2014', style: 'header', margin: [0, 0, 0, 20] },
            { text: `Declaro para os devidos fins, em nome da ${nomeEntidade}, nos termos dos art. 26, caput, inciso VII e art. 27 do Decreto nº 8.726, de 2016, e art. 39, incisos III ao VII, da Lei nº 13.019, de 2014, que os seus dirigentes abaixo relacionados, a saber:`, margin: [0, 0, 0, 10], alignment: 'justify' },
            { text: 'RELAÇÃO NOMINAL ATUALIZADA DOS DIRIGENTES DA ENTIDADE', style: 'subheader', margin: [0, 20, 0, 10], alignment: 'justify' },
            {
                table: {
                    headerRows: 1,
                    widths: ['30%', '35%', '35%'],
                    body: [
                        [
                            { text: 'Nome do dirigente e cargo', bold: true, alignment: 'center', fontSize: 10 },
                            { text: 'Carteira de identidade, órgão expedidor e CPF', bold: true, alignment: 'center', fontSize: 10 },
                            { text: 'Endereço residencial, telefone e e-mail', bold: true, alignment: 'center', fontSize: 10 }
                        ],
                        ...camposDirigentes.map(dir => [
                            { text: dir[0], alignment: 'left', fontSize: 9 },
                            { text: dir[1], alignment: 'left', fontSize: 9 },
                            { text: dir[2], alignment: 'left', fontSize: 9 }
                        ])
                    ]
                },
                layout: 'lightHorizontalLines'
            },
            { text: 'I - não são membros de Poder ou do Ministério Público ou dirigente de órgão ou entidade da Administração Pública Federal;', margin: [0, 10], alignment: 'justify' },
            { text: 'II – não são cônjuges ou companheiros, bem como parentes em linha reta, colateral ou por afinidade, até o segundo grau, de quaisquer membros de Poder ou do Ministério Público ou de dirigente de órgão ou entidade da Administração Pública Federal;', margin: [0, 10], alignment: 'justify' },
            { text: 'III - Não contratará com recursos da parceria, para prestação de serviços, servidor ou empregado público, inclusive aquele que exerça cargo em comissão ou função de confiança, de órgão ou entidade da administração pública federal celebrante, ou seu cônjuge, companheiro ou parente em linha reta, colateral ou por afinidade, até o segundo grau, ressalvadas as hipóteses previstas em lei específica e na lei de diretrizes orçamentárias;', margin: [0, 10], alignment: 'justify' },
            { text: 'IV - Não serão remunerados, a qualquer título, com os recursos repassados:', margin: [0, 10], alignment: 'justify' },
            { text: '• membro de Poder ou do Ministério Público ou dirigente de órgão ou entidade da administração pública federal;', margin: [10, 5], alignment: 'justify' },
            { text: '• servidor ou empregado público, inclusive aquele que exerça cargo em comissão ou função de confiança, de órgão ou entidade da administração pública federal celebrante, ou seu cônjuge, companheiro ou parente em linha reta, colateral ou por afinidade, até o segundo grau, ressalvadas as hipóteses previstas em lei específica e na lei de diretrizes orçamentárias;', margin: [10, 5], alignment: 'justify' },
            { text: '• pessoas naturais condenadas pela prática de crimes contra a administração pública ou contra o patrimônio público, de crimes eleitorais para os quais a lei comine pena privativa de liberdade, e de crimes de lavagem ou ocultação de bens, direitos e valores.', margin: [10, 5], alignment: 'justify' },
            { text: textoContasRejeitadas, margin: [0, 10], alignment: 'justify' },
            { text: 'VI – não foram punidos com as sanções previstas no art. 39, inciso V, alíneas "a", "b", "c" e "d", da Lei nº 13.019, de 2014, ou foram punidos, mas o período que durou a penalidade já se exauriu;', margin: [0, 10], alignment: 'justify' },
            { text: 'VII – não são pessoas que, durante os últimos 8 (oito) anos:', margin: [0, 10], alignment: 'justify' },
            { text: 'a) tiveram suas contas relativas a parcerias julgadas irregulares ou rejeitadas por Tribunal ou Conselho de Contas de qualquer esfera da Federação, em decisão irrecorrível, nos últimos 8 (oito) anos;', margin: [10, 5], alignment: 'justify' },
            { text: 'b) foram julgados responsáveis por falta grave e inabilitados para o exercício de cargo em comissão ou função de confiança, enquanto durar a inabilitação;', margin: [10, 5], alignment: 'justify' },
            { text: textoImprobidadeAdministrativa, margin: [10, 5], alignment: 'justify', color: 'red' },
            { text: `\n${document.getElementById('enderecoEntidade').value}, na data da assinatura.\n\n`, alignment: 'center', margin: [0, 40] },
            { text: '...........................................................................................', alignment: 'center', margin: [0, 40] },
            { text: '(Nome e Cargo do Representante Legal da OSC)', alignment: 'center', margin: [0, 10] }
        ],
        styles: {
            header: { fontSize: 16, bold: true },
            subheader: { fontSize: 14, bold: true }
        }
    };

    pdfMake.createPdf(docDefinition).download('declaracao-dirigentes.pdf');
}

document.getElementById('botaoGerarPDF').addEventListener('click', gerarPDF);

