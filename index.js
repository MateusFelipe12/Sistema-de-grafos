$.toast = (text) => {
    Toastify({
        text: text,
        duration: 2000,
        gravity: "bottom",
        position: "left",
    }).showToast();
    return true;
}

const setItemStorage = (item) => {
    if (!window[item]) window[item] = [];
    localStorage.setItem(item, JSON.stringify(window[item]));
    return window[item];
}

const getItemStorage = (item) => {
    window[item] = JSON.parse(localStorage.getItem(item));
    if (!window[item]) window[item] = [];
    return window[item];
}

const clearStorage = (item) => {
    delete window[item];
    localStorage.removeItem(item)
}

const getNodesGraph = function () {
    getItemStorage('vertex');
    let allNodes = [];
    window['vertex'].forEach((e, i) => {
        if (e) {
            e.forEach(element => {
                if (element) allNodes.push(window['vertex'][i].indexOf(element));
            });
            allNodes.push(window['vertex'].indexOf(e));
        }
    })
    // unifica o array -> passou a ser json
    allNodes = new Set(allNodes)
    allNodes = Array.from(allNodes).sort((a, b) => a - b);
    return allNodes;
}

const addVertex = () => {
    // esta função é usada para observar o formulario de adicionar vertices
    $('#form_add_vertex').submit(function (e) {
        e.preventDefault()
        // quando recebe um submit, vai pegar os valores dos inputs
        let node_origin = $(this).find('input[name="node-origin"]').val();
        let node_destiny = $(this).find('[name="node-destiny"]').val();
        let vertex_weight = $(this).find('[name="vertex-weight"]').val();

        // valida
        if (!node_destiny || !node_origin || !vertex_weight) {
            $.toast("Verifique os valores informados");
            return false;
        }
        // atualiza ou cria a global
        getItemStorage('vertex');

        // se ainda não existe o no de origem ele cria
        if (!vertex[node_origin]) vertex[node_origin] = [];

        // aqui vai seguir a logica de nó de origem e nó destino, guardando o peso;
        vertex[node_origin][node_destiny] = vertex_weight;
        // manda guardar no local storage pra não perder informações
        setItemStorage('vertex');

        // limpa o form
        $(this).find('input').val('');
        // foca no primeiro input
        $(this).find('input').first().focus();

        // da o retorno de sucesso ao user
        $.toast("Nó adicionado ao grafo");
        // return false faz com que o formulario não siga para o evento
        insertVertexSelect();
        listVertex();
        return false;
    })
}

const listVertex = () => {
    let allNodes = getNodesGraph();
    if (allNodes.length) {
        let list = $('#list_vertex >div');

        let htmlTd = '<th>#</th>';
        allNodes.forEach((i) => htmlTd += '<th>' + i + '</th>')
        let htmlTr = `<thead>${htmlTd}</thead>`;

        allNodes.forEach((i) => {
            htmlTd = '';
            allNodes.forEach((j) => {
                if (window['vertex'][i] && window['vertex'][i][j]) {
                    htmlTd += `<td has>${window['vertex'][i][j]}</td>`
                } else if (window['vertex'][j] && window['vertex'][j][i]) {
                    htmlTd += `<td has>${window['vertex'][j][i]}</td>`
                } else if (i == j) {
                    htmlTd += `<td>0</td>`
                } else htmlTd += `<td>X</td>`
            })
            htmlTr += `<tr><th scope="row">${i}</th>${htmlTd}</tr>`
        })

        $('#list_vertex >div').html(`
            <div class="text-start">
                <p>Para remover um vertice, clique duas vezes no vertice</p>
                <p>
                    Para resetar o grafo,
                    <a type="button" id="clear-vertex" href="javascript:;">
                        clique aqui
                    </a>
                </p>
            </div>
            <table>${htmlTr}</table>
        `)

        list.find('td[has]').on('dblclick', (e) => {
            let i = $(e.target).siblings('th').text();
            let j = $(e.target).index();
            j = $(list.find('thead th')[j]).text()
            removeVertex(i, j)
        })

        $('#clear-vertex').click(() => {
            clearStorage('vertex');
            listVertex()
            insertVertexSelect()
        });
    } else $('#list_vertex').html('<div class="text-center" >Adicione um vertice para iniciar</div>')
}

const removeVertex = function (i, j) {
    getItemStorage('vertex');
    if (window['vertex'][i] && window['vertex'][i][j]) {
        delete window['vertex'][i][j];
    } else delete window['vertex'][j][i];
    setItemStorage('vertex');
    listVertex();
    insertVertexSelect();
}

const addTrunk = () => {
    // esta função é usada para observar o formulario de adicionar vertices
    $('#form_add_trunk').submit(function (e) {
        e.preventDefault()
        // quando recebe um submit, vai pegar os valores dos inputs
        let capacity = $(this).find('input[name="capacity"]').val();
        let height = $(this).find('[name="height"]').val();
        let width = $(this).find('[name="width"]').val();
        let depth = $(this).find('[name="depth"]').val();

        // valida
        if (!capacity || !height || !width || !depth) {
            $.toast("Verifique os valores informados");
            return false;
        }

        // atualiza ou cria a global
        getItemStorage('trunk');

        window['trunk'].push({
            capacity,
            height,
            width,
            depth,
            "volumetry": height * width * depth + '' //parse string
        })
        // manda guardar no local storage pra não perder informações
        setItemStorage('trunk');

        // limpa o form
        $(this).find('input').val('');
        // foca no primeiro input
        $(this).find('input').first().focus();

        // da o retorno de sucesso ao user
        $.toast("Baú adicionado");
        // return false faz com que o formulario não siga para o evento
        listTrunk();
        return false;
    })
}

const listTrunk = () => {
    let list = $('#list_trunk ul');

    getItemStorage('trunk');
    list.html(`
    <li class="list-group-item">
    <div class="row">
    <div class="col-2">Capacidade</div>
    <div class="col-2">Altura</div>
    <div class="col-2">Largura</div>
    <div class="col-2">Comprimento</div>
    <div class="col-2">Volume</div>
    <div class="col-2">Excluir</div>
    </div>
    </li>
    `)
    window['trunk'].forEach((e, i) => {
        if (e)
            list.append(`
            <li  class="list-group-item">
                <div class="row">
                <div class="col-2">${e.capacity}</div>
                <div class="col-2">${e.height}</div>
                <div class="col-2">${e.width}</div>
                <div class="col-2">${e.depth}</div>
                <div class="col-2">${e.volumetry}</div>
                <div class="col-2">
                <button id="delete-trunk-${i}" index="${i}" class="btn btn-danger p-0 px-2" type="button" >
                <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </li>
            `)
    });
    deleteTrunk();
}

const deleteTrunk = () => {
    $('[id*="delete-trunk"]').click((e) => {
        let btn = $(e.target).closest('button')
        let index = btn.attr('index');
        if (index) {
            getItemStorage('trunk');
            delete window['trunk'][index];
            btn.closest('li').remove();
            setItemStorage('trunk');
            return false;
        }
        $.toast('Não foi possivel remover')
    })
}

const addDelivery = () => {
    // esta função é usada para observar o formulario de adicionar vertices
    $('#form_add_delivery').submit(function (e) {
        e.preventDefault()
        // quando recebe um submit, vai pegar os valores dos inputs
        let origin = $(this).find('select[name="origin"]').val();
        let destiny = $(this).find('select[name="destiny"]').val();
        let merchandisesList = $(this).find('#list-merchandise ul li:not(.head)');

        if (!origin || !destiny) {
            $.toast("Verifique os valores informados");
            return false;
        }

        // atualiza ou cria a global
        getItemStorage('delivery');

        let merchandises = []
        merchandisesList.each((i, e) => {
            let weight = $(e).find('input[name="weight"]').val();
            let height = $(e).find('input[name="height"]').val();
            let width = $(e).find('input[name="width"]').val();
            let depth = $(e).find('input[name="depth"]').val();

            merchandises.push({
                weight,
                height,
                width,
                depth,
                "volumetry": height * width * depth + '' //parse string
            })
        })

        window['delivery'].push({ origin, destiny, merchandises })

        // manda guardar no local storage pra não perder informações
        setItemStorage('delivery');

        // limpa o form
        $(this).find('input').val('');
        // foca no primeiro input
        $(this).find('input').first().focus();

        // da o retorno de sucesso ao user
        $.toast("Entrega adicionada");
        // return false faz com que o formulario não siga para o evento

        listDelivery();
        return false;
    })
}

const listDelivery = () => {
    let list = $('#list_delivery');

    getItemStorage('delivery')
    let html = ''
    let weight = 0;
    let height = 0;
    let width = 0;
    let depth = 0;
    let volumetry = 0;
    window['delivery'].forEach((e, i) => {
        let htmlDelivery = ''
        if (e) {

            e['merchandises'].forEach((element, index) => {
                if (element) {
                    htmlDelivery += `
                    <div class="row">
                    <div class="col-2">Peso: ${element.weight}</div>
                    <div class="col-2">Altura: ${element.height}</div>
                    <div class="col-2">Largura: ${element.width}</div>
                    <div class="col-2">Comprimento: ${element.depth}</div>
                    <div class="col-2">Volume: ${element.volumetry}</div>
                    <div class="col-2">
                    <button index="${index}_${i}" type="button" class="remove-merchandise p-0 px-1 btn btn-danger">    
                    <i class="bi bi-trash"></i>
                    </button>    
                    </div>
                    </div>
                    `
                    weight += Number(element.weight);
                    height += Number(element.height);
                    width += Number(element.width);
                    depth += Number(element.depth);
                    volumetry += Number(element.volumetry);
                }
            })
            htmlDelivery += `
            <div class="row">
                <div>Total:</div>
            </div>
            <div class="row">
            <div class="col-2">Peso: ${weight}</div>
            <div class="col-2">Altura: ${height}</div>
            <div class="col-2">Largura: ${width}</div>
            <div class="col-2">Comprimento: ${depth}</div>
            <div class="col-2">Volume: ${volumetry}</div>
            <div class="col-2"></div>
            </div>`

            html += `
            <div class="card">
            <div class="card-body">
            <div class="row">
            <div class="col-6">Origem: ${e.origin}</div>
                <div class="col-4">Destino: ${e.destiny}</div>
                    <div class="col-2 text-end"> 
                        <button index="${i}" type="button" class="remove-delivery btn btn-danger">    
                        <i class="bi bi-trash"></i>
                            </button>   
                            </div>
                        <div class="col-12"><span class="pt-1">Mercadorias:</span> <div class="card p-2">${htmlDelivery}</div></div>
                        </div>
                        </div>
            </div>
            `
        }
    })
    list.html(html)
    removeDelivery();
    if (!weight && !height && !width && !depth && !volumetry) {
        list.html(` Adicione entregas para visualiza-las`)
    }
}

const removeDelivery = () => {
    $('.remove-merchandise').click((e) => {
        getItemStorage('delivery')
        let index = $(e.target).closest('button').attr('index').split('_')
        delete window['delivery'][index[1]]['merchandises'][index[0]]
        setItemStorage('delivery')
        listDelivery()
    })

    $('.remove-delivery').click((e) => {
        getItemStorage('delivery')
        let index = $(e.target).closest('button').attr('index')
        delete window['delivery'][index]
        setItemStorage('delivery')
        listDelivery()
    })
}

const insertVertexSelect = () => {
    let allNodes = getNodesGraph();
    let html = '';
    allNodes.forEach(e => html += `<option value="${e}">${e}</option>`)

    $(`#form_add_delivery select[name="destiny"]`).html(
        '<option value="" disabled selected>Selecione o vértice de destino</option>' + html
    );
    $(`#form_add_delivery select[name="origin"]`).html(
        '<option value="" disabled selected>Selecione o vértice de origem</option>' + html
    );
}

const newMerchandise = () => {
    $('#new-merchandise').click((e) => {
        $(e.target).closest('ul').append(`
            <li class="list-group-item">
                <div class="row justify-content-between align-items-center">
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="kg" name="weight">
                    </div>
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="m" name="height">
                    </div>
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="m" name="width">
                        </div>
                        <div class="col-2">
                        <input class="form-control" type="text" placeholder="m" name="depth">
                        </div>
                        <div class="col-2 text-end"> 
                    <button type="button" class="btn px-2 py-0 mb-1 btn-danger cursor-pointer delete-merchandise">
                    <i class="bi bi-trash"></i>
                            </button>
                            </div>
                        </div>
                        </li>
            `)
        deleteMerchandise()
    })
}

const deleteMerchandise = () => {
    $('.delete-merchandise').click((e) => {
        $(e.target).closest('li').remove();
        return false;
    })
}

function dijkstra(graph, source) {
    const distances = {};
    const paths = {};
    const visited = {};
    const queue = [];

    const numVertices = graph.length;
    for (let vertex = 0; vertex < numVertices; vertex++) {
        distances[vertex] = Infinity;
        paths[vertex] = [];
    }

    distances[source] = 0;
    queue.push({ vertex: source, distance: 0 });

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { vertex, distance } = queue.shift();
        if (visited[vertex]) {
            continue;
        }

        visited[vertex] = true;

        for (let neighbor = 0; neighbor < numVertices; neighbor++) {
            const weight = graph[vertex][neighbor];
            if (weight > 0) {
                const newDistance = distance + weight;

                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    console.log(neighbor)
                    paths[neighbor] = paths[vertex].concat(neighbor);
                    queue.push({ vertex: neighbor, distance: newDistance });
                }
            }
        }
    }

    return paths;
}


const onload = function () {
    addVertex();
    addTrunk();
    addDelivery();
    newMerchandise();
    listTrunk();
    listVertex();
    insertVertexSelect();
    listDelivery();
};


$(document).on('DOMContentLoaded', onload);
