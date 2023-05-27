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
            $toast("Verifique os valores informados");
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
        $.toast("Baú adicionado");
        // return false faz com que o formulario não siga para o evento
        return false;
    })
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
            $toast("Verifique os valores informados");
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
        $.toast("Nó adicionado ao grafo");
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
    window['trunk'].forEach(e => {
        list.append(`
            <li class="list-group-item">
                <div class="row">
                    <div class="col-2">${e.capacity}</div>
                    <div class="col-2">${e.height}</div>
                    <div class="col-2">${e.width}</div>
                    <div class="col-2">${e.depth}</div>
                    <div class="col-2">${e.volumetry}</div>
                    <div class="col-2"><i class="bi bi-trash">la</i></div>
                    </div>
            </li>
        `)
    });
}

const newMerchandise = () => {
    $('#new-merchandise').click((e) => {
        console.log(e.target)
        $(e.target).closest('ul').append(`
            <li class="list-group-item">
                <div class="row justify-content-between align-items-center">
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="kg">
                    </div>
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="m">
                    </div>
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="m">
                    </div>
                    <div class="col-2">
                        <input class="form-control" type="text" placeholder="m">
                    </div>
                    <div class="col-2 text-end"> 
                        <button type="button" class="btn px-2 py-0 mb-1 btn-danger delete-merchandise">
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
    })
}

const onload = function () {
    addVertex();
    addTrunk();
    listTrunk();
    newMerchandise();
};


$(document).on('DOMContentLoaded', onload);
