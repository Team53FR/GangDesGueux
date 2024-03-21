<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GangDesGueux</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<?php include 'header.php'; ?>

<main>
    <?php
    if (isset($_GET['page'])) 
    {
        $page = $_GET['page'];
        $allowedPages = array('about', 'accueil', 'contact', 'sponsor');

        if (in_array($page, $allowedPages)) 
        {
            include 'Vue/' . $page . '.php';
        } 
        else 
        {
            include 'error.php';
        }
    } 
    else 
    {
        include 'Vue/accueil.php'; // Page par défaut
    }
    ?>
</main>

<?php include 'footer.php'; ?>

</body>
</html>
