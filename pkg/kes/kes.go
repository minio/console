package kes

import (
	"crypto/x509"
	"encoding/pem"
	"errors"
	"time"

	"github.com/minio/kes"
)

type Identity = kes.Identity

type TLSProxyHeader struct {
	ClientCert string `yaml:"cert,omitempty"`
}

type TLSProxy struct {
	Identities *[]Identity     `yaml:"identities,omitempty"`
	Header     *TLSProxyHeader `yaml:"header,omitempty"`
}

type TLS struct {
	KeyPath  string    `yaml:"key,omitempty"`
	CertPath string    `yaml:"cert,omitempty"`
	Proxy    *TLSProxy `yaml:"proxy,omitempty"`
}

type Policy struct {
	Paths      []string   `yaml:"paths,omitempty"`
	Identities []Identity `yaml:"identities,omitempty"`
}

type Expiry struct {
	Any    time.Duration `yaml:"any,omitempty"`
	Unused time.Duration `yaml:"unused,omitempty"`
}

type Cache struct {
	Expiry *Expiry `yaml:"expiry,omitempty"`
}

type Log struct {
	Error string `yaml:"error,omitempty"`
	Audit string `yaml:"audit,omitempty"`
}

type Fs struct {
	Path string `yaml:"path,omitempty"`
}

type AppRole struct {
	EnginePath string        `yaml:"engine,omitempty"`
	ID         string        `yaml:"id,omitempty"`
	Secret     string        `yaml:"secret,omitempty"`
	Retry      time.Duration `yaml:"retry,omitempty"`
}

type VaultTLS struct {
	KeyPath  string `yaml:"key,omitempty"`
	CertPath string `yaml:"cert,omitempty"`
	CAPath   string `yaml:"ca,omitempty"`
}

type VaultStatus struct {
	Ping time.Duration `yaml:"ping,omitempty"`
}

type Vault struct {
	Endpoint   string       `yaml:"endpoint,omitempty"`
	EnginePath string       `yaml:"engine,omitempty"`
	Namespace  string       `yaml:"namespace,omitempty"`
	Prefix     string       `yaml:"prefix,omitempty"`
	AppRole    *AppRole     `yaml:"approle,omitempty"`
	TLS        *VaultTLS    `yaml:"tls,omitempty"`
	Status     *VaultStatus `yaml:"status,omitempty"`
}

type AwsSecretManagerLogin struct {
	AccessKey    string `yaml:"accesskey"`
	SecretKey    string `yaml:"secretkey"`
	SessionToken string `yaml:"token"`
}

type AwsSecretManager struct {
	Endpoint string                 `yaml:"endpoint,omitempty"`
	Region   string                 `yaml:"region,omitempty"`
	KmsKey   string                 ` yaml:"kmskey,omitempty"`
	Login    *AwsSecretManagerLogin `yaml:"credentials,omitempty"`
}

type Aws struct {
	SecretsManager *AwsSecretManager `yaml:"secretsmanager,omitempty"`
}

type GemaltoCredentials struct {
	Token  string        `yaml:"token,omitempty"`
	Domain string        `yaml:"domain,omitempty"`
	Retry  time.Duration `yaml:"retry,omitempty"`
}

type GemaltoTLS struct {
	CAPath string `yaml:"ca,omitempty"`
}

type GemaltoKeySecure struct {
	Endpoint    string              `yaml:"endpoint,omitempty"`
	Credentials *GemaltoCredentials `yaml:"credentials,omitempty"`
	TLS         *GemaltoTLS         `yaml:"tls,omitempty"`
}

type Gemalto struct {
	KeySecure *GemaltoKeySecure `yaml:"keysecure,omitempty"`
}

type GcpCredentials struct {
	ClientEmail  string `yaml:"client_email"`
	ClientID     string `yaml:"client_id"`
	PrivateKeyID string `yaml:"private_key_id"`
	PrivateKey   string `yaml:"private_key"`
}

type GcpSecretManager struct {
	ProjectID   string          `yaml:"project_id"`
	Endpoint    string          `yaml:"endpoint,omitempty"`
	Credentials *GcpCredentials `yaml:"credentials,omitempty"`
}

type Gcp struct {
	SecretManager *GcpSecretManager `yaml:"secretmanager,omitempty"`
}

type Keys struct {
	Fs      *Fs      `yaml:"fs,omitempty"`
	Vault   *Vault   `yaml:"vault,omitempty"`
	Aws     *Aws     `yaml:"aws,omitempty"`
	Gemalto *Gemalto `yaml:"gemalto,omitempty"`
	Gcp     *Gcp     `yaml:"gcp,omitempty"`
}

type ServerConfig struct {
	Addr     string            `yaml:"address,omitempty"`
	Root     Identity          `yaml:"root,omitempty"`
	TLS      TLS               `yaml:"tls,omitempty"`
	Policies map[string]Policy `yaml:"policy,omitempty"`
	Cache    Cache             `yaml:"cache,omitempty"`
	Log      Log               `yaml:"log,omitempty"`
	Keys     Keys              `yaml:"keys,omitempty"`
}

func ParseCertificate(cert []byte) (*x509.Certificate, error) {
	for {
		var certDERBlock *pem.Block
		certDERBlock, cert = pem.Decode(cert)
		if certDERBlock == nil {
			break
		}

		if certDERBlock.Type == "CERTIFICATE" {
			return x509.ParseCertificate(certDERBlock.Bytes)
		}
	}
	return nil, errors.New("found no (non-CA) certificate in any PEM block")
}
