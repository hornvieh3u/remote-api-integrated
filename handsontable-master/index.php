<?php
    require_once './crud.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Handsontable</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pikaday@1.8.2/css/pikaday.css">
    <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pikaday@1.8.2/pikaday.min.js"></script>

    <link rel="stylesheet" href="http://localhost/assets/css/index.css" />
</head>
<body>
    <h2 class="text-center">
        Bill Handsontable
        <button class="btn btn-primary btn-muted pull-right save" onclick="BillTable.save();">
            Save Changes
        </button>
    </h2>
    <div id="bill"></div>

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"></script>
    <script type="text/javascript" src="http://localhost/assets/js/index.js?<?php echo microtime(); ?>"></script>

    <script type="text/javascript">
        $(function() {
            BillTable.init( <?php echo json_encode($list); ?> );
        })
    </script>
</body>
</html>