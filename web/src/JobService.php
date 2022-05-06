<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;    

require("DbWorker.php");

class JobService {
    
    private $db;
    private $response;
    
    public function __invoke(Request $request, Response $response, array $args) {
        $this->response = $response;
        $this->db = new DbWorker();

        try {
            $this->getJobs();
        } catch (Exception $e) {
            $this->setResponse(false, $e->getMessage());
        }

        return $this->response;
    }
    
    private function setResponse($result, $values) {
        if ($result) {
            $this->response = $this->response->withJson($values);
        } else {
            $this->response = $this->response->withJson([
                'error' => '1',
                'message' => $values
            ], 500);
        }
    }
    
     
    // GET /jobs/
    private function getJobs() {
        $jobs = $this->db->select();

        if ($_GET['search']) {
            $jobs = array_filter($jobs, function($item) {
                return str_contains(strtolower($item['title']), strtolower($_GET['search']))
                    || str_contains(strtolower($item['id']), strtolower($_GET['search']))
                    || str_contains(strtolower($item['location']), strtolower($_GET['search']));
            });
        }

        return $this->setResponse(true, $jobs);
    }
}

?>