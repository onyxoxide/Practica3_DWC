<?php

  // Leer contenido de la petición
  $data = json_decode(file_get_contents('php://input'), true);

  // Crear conexión BBDD
  $conn = new PDO("mysql:host=localhost; dbname=pokedex", "pokedex", "3M5YEzkCjHhLSJRW"); //host, name DB, usuario, pass
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $conn->query('SET NAMES utf8');

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Definir query y setear variables
    $stmt = $conn->prepare("INSERT IGNORE INTO pokemons VALUES (:id, :name)");
    $stmt->bindValue(":id", $data["id"], PDO::PARAM_INT);
    $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);

    // Ejecutar, devolvemos 1 si se guarda, 0 si ya existe
    $stmt->execute();
    echo $stmt->rowCount();

  } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Consultar y devolver resultados
    $resut = array();
    foreach ($conn->query("SELECT id, name FROM pokemons") as $row) {
      $resut[] = array("id" => $row["id"], "name" => $row["name"]);
    }
    echo json_encode($resut);

  } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    // Definir query y borrar por id
    $stmt = $conn->prepare("DELETE FROM pokemons WHERE id = :id");
    $stmt->bindValue(":id", $data["id"], PDO::PARAM_INT);
    $stmt->execute();

  }
  
  // Cerrar la conexión
  $conn = null;
?>