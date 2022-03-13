//contenido del input con id id
var id = $('#id');
//contenido del input con id nombre
var nombre = $('#nombre');
//elemento tbody contenido dentro del elemento con id seleccionados
var seleccionados = $('#seleccionados > tbody');
//elemento tbody contenido dentro del elemento con id resultados
var resultados = $('#resultados > tbody');

// accion a ejecutar con el click sobre el elemento con id mostrar seleccionados
$('#mostrar-seleccionados').click(function() {
    //quita la clase css d-none para que se visualice la tabla
    seleccionados.empty().parent().removeClass("d-none");

    //recorremos el archivo json montando una fila de la tabla por cada elemento
    $.getJSON('pokedex.php', function(data) {
        data.forEach(function(item) {
            var fila = $('<tr/>').appendTo(seleccionados);
            fila.append(
                $('<td/>').text(item.id),//elemento id
                $('<td/>').text(item.name),//elemento nombre
                $('<td/>').append(
                    //accion al pulsr el boton
                    $('<button class="btn btn-danger"/>').text('Borrar').click(function() {
                        $.ajax({
                            url: 'pokedex.php',
                            type: 'DELETE',
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({ id: item.id })
                            //enviamos el elemento seleccionado a pokedex.php para eliminarlo
                        }).done(function(data) {
                            fila.remove(); //elimina la fila de DB
                            alert("Pokémon descartado correctamente"); //muestra un mensaje de informacion
                        });
                    })
                )//elemento boton para borrar
            )
        });
    });
});

//accion a ejecutar con el evento click sobre el elemento con id cargar-json
$('#cargar-json').click(function() {

    resultados.empty();//limpiamos la tabla resultados
    //obtenemos los valores del filtro
    var filtroId = id.val();//valor del campo id
    var filtroNombre = nombre.val();//valor del campo nombre

    //recorremos el archivo json montando una fila de la tabla por cada elemento
    $.getJSON('pokedex.json', function(data) {
        data.forEach(function(item) {

            //comprobamos las opciones de filtrado sobre el resultado
            if (filtroNombre === item.name.english || !filtroNombre && item.id <= filtroId || !filtroNombre && !filtroId) {
                //campo nombre igual al nombre del elemento O campo nombre vacío y id del elemento menor o igual que el campo id O campo nombre y campo id están vacíos 
                $('<tr/>').append(
                    $('<td/>').text(item.id),//elemento id
                    $('<td/>').text(item.name.english),//elemento nombre en inglés
                    $('<td/>').text(item.type.join(', ')),//elemento tipo separado con ,
                    $('<td/>').append( //boton seleccionar
                        //evento click sobre el boton seleccionar
                        $('<button class="btn btn-success"/>').text('Seleccionar').click(function() {
                            $.ajax({
                                url: 'pokedex.php',
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ id: item.id, name: item.name.english })
                                //enviamos el elemento seleccionado a pokedex.php para guardarlo
                            }).done(function(data) {
                                if (data === "1") {//si se ha guardado muestro un mensaje correcto
                                    alert("Pokémon guardado correctamente");
                                } else {//si no, el mensaje es de aviso
                                    alert("AVISO: El pokémon ya estaba guardado");
                                }
                            });
                        })
                    )
                ).appendTo(resultados);
            }
        });
    });
});