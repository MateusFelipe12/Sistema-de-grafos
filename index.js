$.toast = function(text){
    Toastify({
        text: text,
        duration: 2000,
        gravity: "bottom", 
        position: "left", 
    }).showToast();
    return true;
}

const setVertexStorage = function(){
    if(!window.vertex) window.vertex = [];
    console.log(window.vertex)
    console.log('aqui')
    localStorage.setItem('vertex', JSON.stringify(window.vertex));
    return window.vertex;
}

const getVertexStorage = function(){
    window.vertex = JSON.parse(localStorage.getItem('vertex'));
    if(!window.vertex) window.vertex = [];
    return window.vertex
}

const clearGraph = function(){
    delete window.vertex;
    localStorage.removeItem('vertex')
}

const addVertex = ()=>{
    // esta função é usada para observar o formulario de adicionar vertices
    $('#form_add_vertex').submit(function(e){
        e.preventDefault()
        // quando recebe um submit, vai pegar os valores dos inputs
        let node_origin = $(this).find('input[name="node-origin"]').val();
        let node_destiny = $(this).find('[name="node-destiny"]').val();
        let vertex_weight = $(this).find('[name="vertex-weight"]').val();

        // valida
        if( !node_destiny || !node_origin || !vertex_weight ){
            $toast("Verifique os valores informados");
            return false;
        } 
        // atualiza ou cria a global
        console.log(window.vertex)
        console.log(getVertexStorage());
        console.log(window.vertex)
        // se ainda não existe o no de origem ele cria
        if(!vertex[node_origin]) vertex[node_origin] = [];

        // aqui vai seguir a logica de nó de origem e nó destino, guardando o peso;
        vertex[node_origin][node_destiny] =  vertex_weight;
        // manda guardar no local storage pra não perder informações
        setVertexStorage();

        // limpa o form
        $(this).find('input').val('');
        // foca no primeiro input
        $(this).find('input').first().focus();
        
        // da o retorno de sucesso ao user
        $.toast("Nó adicionado ao grafo");
        // return false faz com que o formulario não siga para o evento
        return false;
    })
}
addVertex();
