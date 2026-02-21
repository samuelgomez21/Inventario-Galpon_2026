<?php
$db = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');
$stmt = $db->query('SELECT nombre, email, rol FROM users');
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($users as $u) {
    echo $u['nombre'] . " | " . $u['email'] . " | " . $u['rol'] . "\n";
}
echo "\nTotal: " . count($users) . " usuarios\n";

