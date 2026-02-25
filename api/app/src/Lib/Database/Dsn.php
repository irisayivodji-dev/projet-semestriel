<?php

namespace App\Lib\Database;

class Dsn {
    const string DATABASE_CONFIG_PATH = __DIR__ . '/../../../config/database.json';
    
    private string $host;
    private string $user;
    private string $password;
    private string $dbname;
    private int $port;
    private string $dsn;

    public function __construct() {
        $config = self::getConfig();

        if (!empty($_ENV['DATABASE_URL'])) {
            $url = parse_url($_ENV['DATABASE_URL']);
            $this->host     = $url['host'];
            $this->user     = $url['user'];
            $this->password = $url['pass'];
            $this->dbname   = ltrim($url['path'], '/');
            $this->port     = $url['port'] ?? 5432;
        } else {
            $this->host     = $_ENV['PGHOST']     ?? $_ENV['DB_HOST']     ?? $config['host'];
            $this->user     = $_ENV['PGUSER']     ?? $_ENV['DB_USER']     ?? $config['user'];
            $this->password = $_ENV['PGPASSWORD'] ?? $_ENV['DB_PASSWORD'] ?? $config['password'];
            $this->dbname   = $_ENV['PGDATABASE'] ?? $_ENV['DB_NAME']     ?? $config['database'];
            $this->port     = (int)($_ENV['PGPORT'] ?? $_ENV['DB_PORT']   ?? $config['port']);
        }
        $this->dsn = 'pgsql:';
    }

    public function getUser(): string {
        return $this->user;
    }

    public function getPassword(): string {
        return $this->password;
    }

    public function addHostToDsn(): self {
        $this->dsn .= "host=$this->host;";
        return $this;
    }

    public function addDbnameToDsn(): self {
        $this->dsn .= "dbname=$this->dbname;";
        return $this;
    }

    public function addPortToDsn(): self {
        $this->dsn .= "port=$this->port;";
        return $this;
    }

    public function getDsn(): string {
        return $this->dsn;
    }

    public function getDbName(): string {
        return $this->dbname;
    }

    private static function getConfig(): array {
        $file = file_get_contents(self::DATABASE_CONFIG_PATH);
        return json_decode($file, true);
    }
    
    
}
