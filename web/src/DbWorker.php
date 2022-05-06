<?php

class DbWorker {

    const URLS = [
        "OCCUPATIONS" => 'https://corpora-api.glitch.me/humans/occupations',
        "URL" => 'https://random-data-api.com/api/internet_stuff/random_internet_stuff',
        "COMPANIES" => 'https://random-data-api.com/api/company/random_company',
        "LOREM" => 'https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum',
    ];
    const INSERT_SIZE = 2000;
    
    private $db;
    private $rest;

    public function __construct() {
        $this->connect();
        $this->rest = new RestClient([ 'format' => "json" ]);
    }

    public function work() {
        $this->create();
        $this->insert();
    }

    public function select() {
        return $this->db->query("select * from jobs")->fetchAll();
    }

    private function connect() {
        try {
            $config = parse_url(getenv('DATABASE_URL'));
            $connectionString = "pgsql:host=" . $config['host'];

            if (isset($config['port'])) $connectionString .= ";port=" . $config['port'];
            if (isset($config['user'])) $connectionString .= ";user=" . $config['user'];
            if (isset($config['pass'])) $connectionString .= ";password=" . $config['pass'];
            if (isset($config['path'])) $connectionString .= ";dbname=" . ltrim($config["path"], "/");

            $this->db = new PDO($connectionString);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            print "Unable to open database: " . $e->getMessage();
            exit();
        }
    }

    private function query($sql, $data = [[]]) {
        try {
            $stmt = $this->db->prepare($sql);
            $this->db->beginTransaction();
            foreach($data as $row) {
                $stmt->execute($row);
            }
            $this->db->commit();
        } catch (PDOException $e) {
            $this->db->rollBack();
            print "Error: " . $e->getMessage();
            exit();
        }
    }

    private function create() {
        $this->query("drop table if exists jobs");
        $this->query("create table jobs (
            id serial primary key, 
            title varchar(100), 
            type varchar(100),
            company varchar(100),
            location varchar(100),
            url varchar(100),
            description text,
            lat float,
            lng float,
            created_at timestamp
        )");
    }

    private function insert() {
        $result['OCCUPATIONS'] = $this->rest->get($this::URLS['OCCUPATIONS'])->decode_response();
        $result['URL'] = $this->rest->get($this::URLS['URL'], [ "size" => 100 ])->decode_response();
        $result['COMPANIES'] = $this->rest->get($this::URLS['COMPANIES'], [ "size" => 100 ])->decode_response();
        $result['LOREM'] = $this->rest->get($this::URLS['LOREM'], [ "size" => 100 ])->decode_response();
        
        $data = [];

        for ($i = 0; $i < $this::INSERT_SIZE; $i++) {
            $occupations = $result["OCCUPATIONS"]->data->occupations;
            $lorem = $result["LOREM"][$i % sizeof($result["LOREM"])];
            $company = $result["COMPANIES"][$i % sizeof($result["COMPANIES"])];
            $url = $result["URL"][$i % sizeof($result["URL"])];

            array_push($data, 
                [ 
                    $occupations[rand(0, sizeof($occupations)-1)],
                    $company->industry . ' - ' . $company->type,
                    $company->business_name,
                    $company->full_address,
                    $url->url,
                    sprintf('%s %s %s %s %s %s' ,$lorem->very_long_sentence, $lorem->long_sentence, $lorem->short_sentence, $lorem->paragraphs[0], $lorem->paragraphs[1], $lorem->paragraphs[2]),
                    $company->latitude,
                    $company->longitude
                ]);
        }
        
        $this->query("insert into jobs (title, type, company, location, url, description, lat, lng, created_at)
            values (?, ?, ?, ?, ?, ?, ?, ?, now())", $data);
    }
}

?>