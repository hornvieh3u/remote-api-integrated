<?php
    class DataBase {
        private $_mysql;

        function __construct() {
            try {
                $this->_mysql = new PDO("mysql:host=localhost;dbname=bill", 'root', '');
                $this->_mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }

        public function get_all_list() {
            $list = $this->_execute_query(
                'SELECT
                    billInfo.*,
                    testorders.SalesItemID 
                FROM
                    ( SELECT bills.BillCurrency Currency, billdetails.* FROM bills, billdetails WHERE bills.BillID = billdetails.MainBIllID ) billInfo
                    LEFT JOIN testorders ON billInfo.SORefNum = testorders.OrderNum
                ORDER BY billInfo.BillItemID'
            )->fetchAll();

            return $list;
        }

        public function update_field($BillItemID, $update) {
            $this->_execute_query(
                'UPDATE billdetails SET ' . implode(" = ?, ", array_keys($update)) . " = ?" . ' WHERE BillItemID = ' . $BillItemID,
                array_values($update)
            );

            return TRUE;
        }

        public function delete($BillItemIDs) {
            $this->_execute_query(
                'DELETE FROM billdetails WHERE BillItemID in (' . implode(', ', $BillItemIDs) . ')'
            );

            return TRUE;
        }

        public function create_one() {
            $create_data = $this->_execute_query(
                'SELECT
                    MAX( BillItemID ) + 1 BillItemID,
                    MAX( MainBIllID ) MainBIllID
                FROM
                    billdetails'
            )->fetchAll();

            $this->_execute_query(
                'INSERT INTO billdetails VALUES(' . $create_data[0]['BillItemID'] . ',' . 20 . ',null,null,null,null,null,null,null,null,0,0,0,0,null)'
            );

            return [
                'BillItemID' => $create_data[0]['BillItemID'],
                'MainBIllID' => 20,
                'Currency' => 'RMB'
            ];
        }

        private function _execute_query( $query = '', $bind = [] ) {
            $stmt = $this->_mysql->prepare( $query );
            if( empty( $bind ) )
                $stmt->execute();
            else
                $stmt->execute( $bind );

            return $stmt;
        }

        function __destruct() {
            $this->_mysql = null;
        }
    }
?>