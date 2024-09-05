<?php
    require_once './database.php';

    $database = new DataBase();

    if ( $_SERVER['REQUEST_METHOD'] === 'GET' ) {

        $list = $database->get_all_list();

    } elseif ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

        $result = [ 'success' => FALSE, 'data' => [] ];
        switch( $_POST['type'] ) {
            case 'create':
                $result['success'] = TRUE;
                $result['data'] = $database->create_one();
                break;
            case 'update':
                foreach( $_POST['changes'] as $BillItemID => $update ) {
                    $database->update_field( $BillItemID, $update );
                }
                $result['success'] = TRUE;
                break;
            case 'remove':
                $result['success'] = $database->delete( $_POST['BillItemIDs'] );
                break;
            
            default:
                break;
        }

        echo json_encode($result);
        exit;
    } else {
        // todo something with error handling
    }

?>